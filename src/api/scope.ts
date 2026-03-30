import { IpcMainInvokeEvent } from "electron";
import fs, { promises as fsAsync } from "fs";
import path from "path";
import { ROOT_DIR } from "src/common/const";
import { EndpointData } from "src/common/models";

export type Scope = {
    canvasCourses: number[];
};

const SCOPE_PATH = path.join(ROOT_DIR, "scope.json");

const getScope = async (): Promise<Scope> => {
    if (!fs.existsSync(ROOT_DIR)) {
        fs.mkdirSync(ROOT_DIR, { recursive: true });
    }

    if (!fs.existsSync(SCOPE_PATH)) {
        fs.writeFileSync(SCOPE_PATH, '{ "canvasCourses": [] }', "utf-8");
    }

    const scope = JSON.parse(
        await fsAsync.readFile(SCOPE_PATH, "utf-8"),
    ) as Scope;
    return scope;
};

const setScope = async (scope: Scope): Promise<void> => {
    fs.writeFileSync(SCOPE_PATH, JSON.stringify(scope), "utf-8");
};

export const handleGetScope = async (): Promise<EndpointData<Scope>> => {
    try {
        const scope = await getScope();
        return {
            value: scope,
            error: undefined,
        };
    } catch (error) {
        return {
            value: undefined,
            error: error instanceof Error ? error.message : String(error),
        };
    }
};

export const handleSaveScopedCanvasCourseIds = async (
    _: IpcMainInvokeEvent,
    courseIds: number[],
): Promise<string | undefined> => {
    try {
        await setScope({ canvasCourses: courseIds });
    } catch (error) {
        return error instanceof Error ? error.message : String(error);
    }
};
