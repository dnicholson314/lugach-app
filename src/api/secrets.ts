import fs, { promises as fsAsync } from "fs";
import path from "path";
import { type BrowserContext } from "playwright";
import os from "os";

export type StorageState = Awaited<ReturnType<BrowserContext["storageState"]>>;

const STORAGE_STATE_SECRET_NAME = "th_storage";
const ROOT_DIR = path.join(os.homedir(), ".lugach", "app");
const ENV_PATH = path.join(ROOT_DIR, ".env");

const getEnvLines = async (): Promise<string[]> => {
    if (!fs.existsSync(ROOT_DIR)) {
        fs.mkdirSync(ROOT_DIR, { recursive: true });
    }

    if (!fs.existsSync(ENV_PATH)) {
        fs.writeFileSync(ENV_PATH, "", "utf-8");
    }

    const envLines = (await fsAsync.readFile(ENV_PATH, "utf-8")).split(os.EOL);
    return envLines;
};

export const getEnvValue = async (key: string): Promise<string | undefined> => {
    const envLines = await getEnvLines();
    const matchedLine = envLines.find(
        (line: string): boolean => line.split("=")[0] === key,
    );
    return matchedLine ? matchedLine.split("=")[1] : undefined;
};

export const setEnvValue = async (
    key: string,
    value: string,
): Promise<void> => {
    const newLine = `${key}=${value}`;
    const envLines = await getEnvLines();
    const targetLine = envLines.find(
        (line: string): boolean => line.split("=")[0] === key,
    );

    if (targetLine) {
        const targetLineIndex = envLines.indexOf(targetLine);
        envLines.splice(targetLineIndex, 1, newLine);
    } else {
        envLines.push(newLine);
    }

    fs.writeFileSync(ENV_PATH, envLines.join(os.EOL), "utf-8");
};

export const saveStorageState = async (
    storageState: StorageState,
): Promise<void> => {
    const storageFilePath = path.join(
        ROOT_DIR,
        `${STORAGE_STATE_SECRET_NAME}.state`,
    );

    await fsAsync.writeFile(
        storageFilePath,
        JSON.stringify(storageState),
        "utf-8",
    );
};

export const loadStorageState = async (): Promise<StorageState> => {
    const storageFilePath = path.join(
        ROOT_DIR,
        `${STORAGE_STATE_SECRET_NAME}.state`,
    );

    const storageStateString = await fsAsync.readFile(storageFilePath, "utf-8");
    return JSON.parse(storageStateString) as StorageState;
};
