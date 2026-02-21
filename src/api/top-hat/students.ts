import { EndpointData } from "src/common/models";
import { callEndpoint } from "./base";
import { IpcMainInvokeEvent } from "electron";

export interface TopHatStudent {
    id: number;
    name: string;
    email: string;
    student_id: string;
    username: string;
    enrolled: boolean;
}

export const handleGetTopHatStudents = async (
    _: IpcMainInvokeEvent,
    courseId: number,
): Promise<EndpointData<TopHatStudent[]>> => {
    const data = await callEndpoint<TopHatStudent[]>(
        `v3/course/${courseId}/students/`,
        [],
    );
    return data;
};
