import { CallEndpointOptions, EndpointData } from "src/common/models";
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

export const callEndpoint = async <E, D = undefined>(
    endpoint: string,
    options?: CallEndpointOptions<E, D>,
): Promise<EndpointData<E | undefined>> => {
    let value: E, error: string;
    try {
        const { apiUrl, apiKey } = await getCanvasCredentials();
        if (!apiUrl || !apiKey) {
            throw "Missing Canvas credentials.";
        }

        const url = `${apiUrl}/api/v1/${endpoint}`;
        const body = options?.data ? JSON.stringify(options.data) : undefined;

        const response = await fetch(url, {
            method: options?.method ?? "GET",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body,
        });

        if (!response.ok) {
            value = options.fallback ?? undefined;
            error = `Canvas API error: ${response.status} ${response.statusText}`;
        } else {
            value = await response.json();
            error = undefined;
        }
    } catch (exception) {
        value = options.fallback ?? undefined;
        error = `Runtime error: ${exception instanceof Error ? exception.message : String(exception)}`;
    }

    return {
        value,
        error,
    };
};
