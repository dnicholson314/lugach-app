import { AttendanceOption, EndpointData } from "src/common/models";
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
    correctness_weight: 0 | 1;
    participation_weight: 0 | 1;
    weighted_correctness: 0 | 1;
    weighted_participation: 0 | 1;
    grade_type: "regular" | "excused";
}

interface AttendanceRecordGetData {
    count: number;
    results: AttendanceRecord[];
}

interface AttendanceRecordPostData {
    student_id: number;
    correctness_weight: 0 | 1;
    participation_weight: 0;
    weighted_correctness: 0 | 1;
    weighted_participation: 0;
    is_excused: boolean;
    is_manual_entry: false;
    return_tree_type: "selective";
}

export const handleGetAttendanceItems = async (
    _: IpcMainInvokeEvent,
    courseId: number,
): Promise<EndpointData<AttendanceItem[]>> => {
    const data = await callEndpoint<AttendanceItem[]>(
        `v3/course/${courseId}/gradeable_course_items_aggregated/`,
        { fallback: [] },
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
    const data = await callEndpoint<AttendanceRecordGetData>(
        `gradebook/v1/gradeable_items/${courseId}/?limit=2000&student_ids=${studentId}`,
        { fallback: { count: 0, results: [] } },
    );

    return {
        value: data.value?.results ?? [],
        error: data.error,
    };
};

export const handleEditAttendance = async (
    _: IpcMainInvokeEvent,
    courseId: number,
    studentId: number,
    attendanceItemId: string,
    newAttendance: AttendanceOption,
): Promise<EndpointData<undefined>> => {
    let attended = false;
    let excused = true;
    if (newAttendance === "present") {
        attended = true;
        excused = false;
    } else if (newAttendance == "absent") {
        attended = false;
        excused = false;
    }

    const postData: AttendanceRecordPostData = {
        student_id: studentId,
        weighted_correctness: attended ? 1 : 0,
        correctness_weight: excused ? 0 : 1,
        weighted_participation: 0,
        participation_weight: 0,
        is_excused: excused,
        is_manual_entry: false,
        return_tree_type: "selective",
    };
    const { error } = await callEndpoint<undefined, AttendanceRecordPostData>(
        `gradebook/v1/gradeable_items/${courseId}/edit/${attendanceItemId}/`,
        { method: "POST", data: postData },
    );

    return { value: undefined, error };
};
