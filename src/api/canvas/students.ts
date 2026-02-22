import { IpcMainInvokeEvent } from "electron";
import { EndpointData } from "src/common/models";
import { callEndpoint } from "./base";

export interface CanvasStudent {
    id: number;
    name: string;
    sis_user_id: string;
    email: string;
}

export const handleGetCanvasStudents = async (
    _: IpcMainInvokeEvent,
    courseId: number,
): Promise<EndpointData<CanvasStudent[]>> => {
    const endpoint = `courses/${courseId}/users?enrollment_type=student`;
    const data = callEndpoint<CanvasStudent[]>(endpoint, { fallback: [] });
    return data;
};
