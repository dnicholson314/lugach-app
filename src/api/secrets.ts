import fs, { promises as fsAsync } from "fs";
import path from "path";
import { type BrowserContext } from "playwright";
import os from "os";
import { safeStorage } from "electron";
import { ROOT_DIR } from "src/common/const";

export type StorageState = Awaited<ReturnType<BrowserContext["storageState"]>>;

const STORAGE_STATE_SECRET_NAME = "th_storage";
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
    const rawValue = matchedLine ? matchedLine.split("=")[1] : undefined;

    try {
        if (!safeStorage.isEncryptionAvailable()) {
            // Return the raw value, since we probably saved the value in an
            // unencrypted format. This takes place in WSL and in other contexts
            // where no system keyring is available.
            return rawValue;
        }

        const buffer = Buffer.from(rawValue, "base64");
        return safeStorage.decryptString(buffer);
    } catch {
        return undefined;
    }
};

export const setEnvValue = async (
    key: string,
    value: string,
): Promise<void> => {
    let processedValue = value;

    if (safeStorage.isEncryptionAvailable()) {
        const encryptedBuffer = safeStorage.encryptString(value);
        processedValue = encryptedBuffer.toString("base64");
    } else {
        // Since encryption is not available, we'll store the value in plain
        // text. This takes place in WSL and in other contexts where no system
        // keyring is available.
    }

    const newLine = `${key}=${processedValue}`;
    const envLines = await getEnvLines();

    const targetLineIndex = envLines.findIndex(
        (line: string): boolean => line.split("=")[0] === key,
    );

    if (targetLineIndex !== -1) {
        envLines[targetLineIndex] = newLine;
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
