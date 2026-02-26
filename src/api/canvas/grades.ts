import { IpcMainInvokeEvent } from "electron";
import { EndpointData } from "src/common/models";
import { callEndpoint } from "./base";

export interface AssignmentOverride {
    id: number;
    assignment_id?: number;
    quiz_id?: number;
    student_ids: number[];
    title: string;
    due_at?: string;
    lock_at?: string;
    unlock_at?: string;
}

export interface AssignmentDate {
    id?: number;
    base?: boolean;
    title: string;
    due_at?: string;
    lock_at?: string;
    unlock_at?: string;
}

export interface Assignment {
    id: number;
    name: string;
    description: string;
    points_possible: number;
    is_quiz_assignment: boolean;
    published: boolean;
    all_dates: AssignmentDate[];
    due_at?: string;
    lock_at?: string;
    html_url?: string;
    overrides?: AssignmentOverride[];
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

export interface OverridePostData {
    assignment_override: {
        student_ids: number[];
        title: string;
        due_at: string;
        lock_at: string;
    };
}

export type Score = number | "pass" | "fail";

export const handleGetAssignments = async (
    _: IpcMainInvokeEvent,
    courseId: number,
): Promise<EndpointData<Assignment[]>> => {
    const endpoint = `courses/${courseId}/assignments?include[]=overrides&include[]=all_dates`;
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

    const { error } = await callEndpoint<undefined, SubmissionPostData>(
        endpoint,
        { method: "PUT", data: postData },
    );
    return {
        value: undefined,
        error,
    };
};

export const handleEditAssignmentDueDate = async (
    _: IpcMainInvokeEvent,
    courseId: number,
    assignmentId: number,
    studentId: number,
    dates: {
        dueAt: Date;
        lockAt?: Date;
    },
): Promise<EndpointData<undefined>> => {
    const endpoint = `courses/${courseId}/assignments/${assignmentId}/overrides`;
    const postData = {
        assignment_override: {
            student_ids: [studentId],
            title: `Override for student ID ${studentId}`,
            due_at: dates.dueAt.toISOString(),
            lock_at: dates.lockAt?.toISOString(),
        },
    };

    const { value: overrides, error: getError } =
        await callEndpoint<AssignmentOverride[]>(endpoint);
    if (getError) {
        return {
            value: undefined,
            error: getError,
        };
    }

    const existingOverride = overrides.find((override: AssignmentOverride) =>
        override.student_ids.includes(studentId),
    );
    if (existingOverride) {
        const { error: putError } = await callEndpoint<
            undefined,
            OverridePostData
        >(`${endpoint}/${existingOverride.id}`, {
            method: "PUT",
            data: postData,
        });

        return {
            value: undefined,
            error: putError,
        };
    }

    const { error: postError } = await callEndpoint<
        undefined,
        OverridePostData
    >(endpoint, { method: "POST", data: postData });
    return {
        value: undefined,
        error: postError,
    };
};
