import { IpcMainInvokeEvent } from "electron";
import { EndpointData } from "src/common/models";
import { callEndpoint } from "./base";

export interface Assignment {
    id: number;
    name: string;
    description: string;
    points_possible: number;
    is_quiz_assignment: boolean;
    published: boolean;
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

export interface SubmissionPostData {
    submission: {
        posted_grade: string;
    };
}

export type Score = number | "pass" | "fail";

export const handleGetAssignments = async (
    _: IpcMainInvokeEvent,
    courseId: number,
): Promise<EndpointData<Assignment[]>> => {
    const endpoint = `courses/${courseId}/assignments`;
    const data = await callEndpoint<Assignment[]>(endpoint, { fallback: [] });
    return data;
};

export const handleGetSubmission = async (
    _: IpcMainInvokeEvent,
    courseId: number,
    assignmentId: number,
    studentId: number,
): Promise<EndpointData<Submission>> => {
    const endpoint = `courses/${courseId}/assignments/${assignmentId}/submissions/${studentId}`;
    const data = await callEndpoint<Submission>(endpoint);
    return data;
};

export const handleGradeSubmission = async (
    _: IpcMainInvokeEvent,
    courseId: number,
    assignmentId: number,
    studentId: number,
    score: Score,
): Promise<EndpointData<undefined>> => {
    const endpoint = `courses/${courseId}/assignments/${assignmentId}/submissions/${studentId}`;
    const postData = {
        submission: {
            posted_grade: String(score),
        },
    };

    const { error } = await callEndpoint<Submission, SubmissionPostData>(
        endpoint,
        { method: "PUT", data: postData },
    );
    return {
        value: undefined,
        error,
    };
};
