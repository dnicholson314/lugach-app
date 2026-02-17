import { EndpointData } from "src/common/models";
import { callEndpoint } from "./base";
import { IpcMainInvokeEvent } from "electron";

export interface AttendanceItem {
    id: string;
    type: string;
    name: string;
    last_activated_at: string;
    last_deactivated_at: string;
}

export interface AttendanceRecord {
    id: number;
    item_id: string;
    student_id: number;
    correctness_weight: number;
    participation_weight: number;
    weighted_correctness: number;
    weighted_participation: number;
    grade_type: "regular" | "excused";
}

interface AttendanceRecordEndpointStructure {
    count: number;
    results: AttendanceRecord[];
}

export const handleGetAttendanceItems = async (
    _: IpcMainInvokeEvent,
    courseId: number,
): Promise<EndpointData<AttendanceItem[]>> => {
    const data = await callEndpoint<AttendanceItem[]>(
        `v3/course/${courseId}/gradeable_course_items_aggregated/`,
    );

    return {
        value:
            data.value?.filter(
                (item: AttendanceItem): boolean => item.type === "attendance",
            ) ?? [],
        error: data.error,
    };
};

export const handleGetAttendanceRecords = async (
    _: IpcMainInvokeEvent,
    courseId: number,
    studentId: number,
): Promise<EndpointData<AttendanceRecord[]>> => {
    const data = await callEndpoint<AttendanceRecordEndpointStructure>(
        `gradebook/v1/gradeable_items/${courseId}/?limit=2000&student_ids=${studentId}`,
    );

    return {
        value: data.value?.results ?? [],
        error: data.error,
    };
};
