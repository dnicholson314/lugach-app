import { IpcMainInvokeEvent } from "electron";
import { EndpointData } from "src/common/models";

export interface Assignment {
    id: number;
    name: string;
    description: string;
    points_possible: number;
    is_quiz_assignment: boolean;
    due_at?: string;
    lock_at?: string;
    html_url?: string;
}

export interface Submission {
    id: number;
    user_id: number;
    score: number;
    url?: string;
    submitted_at?: string;
}

export const handleGetAssignments =
    (apiUrl: string, apiKey: string) =>
    async (
        _: IpcMainInvokeEvent,
        courseId: number,
    ): Promise<EndpointData<Assignment[]>> => {
        if (!apiUrl || !apiKey) {
            return {
                value: [],
                error: "Missing Canvas credentials.",
            };
        }

        const endpoint = `${apiUrl}/api/v1/courses/${courseId}/assignments`;

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

export const handleGetSubmission =
    (apiUrl: string, apiKey: string) =>
    async (
        _: IpcMainInvokeEvent,
        courseId: number,
        assignmentId: number,
        studentId: number,
    ): Promise<EndpointData<Submission>> => {
        if (!apiUrl || !apiKey) {
            return {
                value: null,
                error: "Missing Canvas credentials.",
            };
        }

        const endpoint = `${apiUrl}/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/${studentId ?? ""}`;

        const response = await fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            return {
                value: null,
                error: `Canvas API error: ${response.status} ${response.statusText}`,
            };
        }

        const nextData = await response.json();

        return {
            value: nextData,
        };
    };
