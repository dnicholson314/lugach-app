import { IpcMainInvokeEvent } from "electron";
import fs, { promises as fsAsync } from "fs";
import path from "path";
import { ROOT_DIR } from "src/common/const";
import { EndpointData } from "src/common/models";

export type Integrations = Record<number, number | undefined>;

const INTEGRATIONS_PATH = path.join(ROOT_DIR, "integrations.json");

const getIntegrations = async (): Promise<Integrations> => {
    if (!fs.existsSync(ROOT_DIR)) {
        fs.mkdirSync(ROOT_DIR, { recursive: true });
    }

    if (!fs.existsSync(INTEGRATIONS_PATH)) {
        fs.writeFileSync(INTEGRATIONS_PATH, "{}", "utf-8");
    }

    const integrations = JSON.parse(
        await fsAsync.readFile(INTEGRATIONS_PATH, "utf-8"),
    ) as Integrations;
    return integrations;
};

const setIntegration = async (
    canvasCourseId: number,
    topHatCourseId: number | undefined,
): Promise<void> => {
    const integrations = (await getIntegrations()) as Integrations;
    if (topHatCourseId === undefined) {
        delete integrations[canvasCourseId];
    } else {
        integrations[canvasCourseId] = topHatCourseId;
    }

    fs.writeFileSync(INTEGRATIONS_PATH, JSON.stringify(integrations), "utf-8");
};

export const handleGetIntegrations = async (): Promise<
    EndpointData<Integrations>
> => {
    try {
        const integrations = await getIntegrations();
        return {
            value: integrations,
            error: undefined,
        };
    } catch (error) {
        return {
            value: undefined,
            error: error instanceof Error ? error.message : String(error),
        };
    }
};

export const handleSaveIntegration = async (
    _: IpcMainInvokeEvent,
    canvasCourseId: number,
    topHatCourseId: number | undefined,
): Promise<string | undefined> => {
    try {
        await setIntegration(canvasCourseId, topHatCourseId);
    } catch (error) {
        return error instanceof Error ? error.message : String(error);
    }
};
