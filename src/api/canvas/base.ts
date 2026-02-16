import { EndpointData } from "src/common/models";
import { getEnvValue } from "../secrets";

const CANVAS_API_URL_SECRET_NAME = "CANVAS_API_URL";
const CANVAS_API_KEY_SECRET_NAME = "CANVAS_API_KEY";

interface CanvasCredentials {
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

export const callEndpoint = async <E>(
    endpoint: string,
): Promise<EndpointData<E | undefined>> => {
    try {
        const { apiUrl, apiKey } = await getCanvasCredentials();
        if (!apiUrl || !apiKey) {
            return {
                value: undefined,
                error: "Missing Canvas credentials.",
            };
        }

        const url = `${apiUrl}/api/v1/${endpoint}`;
        console.log(url);
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            return {
                value: undefined,
                error: `Canvas API error: ${response.status} ${response.statusText}`,
            };
        }

        const nextData = await response.json();

        return {
            value: nextData,
        };
    } catch (error) {
        return {
            value: undefined,
            error: `Runtime error: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
};
