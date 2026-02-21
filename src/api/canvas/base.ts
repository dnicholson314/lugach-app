import { EndpointData } from "src/common/models";
import { getEnvValue, setEnvValue } from "../secrets";
import { IpcMainInvokeEvent } from "electron";

const CANVAS_API_URL_SECRET_NAME = "CANVAS_API_URL";
const CANVAS_API_KEY_SECRET_NAME = "CANVAS_API_KEY";

export interface CanvasCredentials {
    apiUrl: string;
    apiKey: string;
}

const getCanvasCredentials = async (): Promise<CanvasCredentials> => {
    const apiUrl = await getEnvValue(CANVAS_API_URL_SECRET_NAME);
    const apiKey = await getEnvValue(CANVAS_API_KEY_SECRET_NAME);

    return {
        apiUrl: apiUrl,
        apiKey: apiKey,
    };
};

const setCanvasCredentials = async (
    nextCredentials: CanvasCredentials,
): Promise<void> => {
    await setEnvValue(CANVAS_API_URL_SECRET_NAME, nextCredentials.apiUrl);
    await setEnvValue(CANVAS_API_KEY_SECRET_NAME, nextCredentials.apiKey);
};

export const handleGetCanvasCredentials = async (): Promise<
    EndpointData<CanvasCredentials>
> => {
    try {
        const canvasCredentials = await getCanvasCredentials();
        return {
            value: canvasCredentials,
            error: undefined,
        };
    } catch (error) {
        return {
            value: undefined,
            error: error instanceof Error ? error.message : String(error),
        };
    }
};

export const handleSaveCanvasCredentials = async (
    _: IpcMainInvokeEvent,
    nextCredentials: CanvasCredentials,
): Promise<string | undefined> => {
    try {
        await setCanvasCredentials(nextCredentials);
    } catch (error) {
        return error instanceof Error ? error.message : String(error);
    }
};

export const callEndpoint = async <E>(
    endpoint: string,
    fallback?: E,
): Promise<EndpointData<E | undefined>> => {
    try {
        const { apiUrl, apiKey } = await getCanvasCredentials();
        if (!apiUrl || !apiKey) {
            return {
                value: fallback ?? undefined,
                error: "Missing Canvas credentials.",
            };
        }

        const url = `${apiUrl}/api/v1/${endpoint}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            return {
                value: fallback ?? undefined,
                error: `Canvas API error: ${response.status} ${response.statusText}`,
            };
        }

        const nextData = await response.json();

        return {
            value: nextData,
        };
    } catch (error) {
        return {
            value: fallback ?? undefined,
            error: `Runtime error: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
};
