import { IpcMainInvokeEvent } from "electron";
import { EndpointData } from "src/common/models";

export interface CanvasStudent {
    id: number;
    name: string;
    sis_user_id: string;
    email: string;
}

export const handleGetCanvasStudents =
    (apiUrl: string, apiKey: string) =>
    async (
        _: IpcMainInvokeEvent,
        courseId: number,
    ): Promise<EndpointData<CanvasStudent>> => {
        if (!apiUrl || !apiKey) {
            return {
                value: [],
                error: "Missing Canvas credentials.",
            };
        }

        const endpoint = `${apiUrl}/api/v1/courses/${courseId}/users?enrollment_type=student`;

        const response = await fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            return {
                value: [],
                error: `Canvas API error: ${response.status} ${response.statusText}`,
            };
        }

        const nextData = await response.json();

        return {
            value: nextData,
        };
    };
