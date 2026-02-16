import { EndpointData } from "src/common/models";

export interface CanvasCourse {
    id: number;
    name: string;
    course_code: string;
}

export const handleGetCanvasCourses =
    (apiUrl: string, apiKey: string) =>
    async (): Promise<EndpointData<CanvasCourse[]>> => {
        if (!apiUrl || !apiKey) {
            return {
                value: [],
                error: "Missing Canvas credentials.",
            };
        }

        const response = await fetch(`${apiUrl}/api/v1/courses`, {
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
