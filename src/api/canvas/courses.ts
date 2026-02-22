import { EndpointData } from "src/common/models";
import { callEndpoint } from "./base";

export interface CanvasCourse {
    id: number;
    name: string;
    course_code: string;
}

export const handleGetCanvasCourses = async (): Promise<
    EndpointData<CanvasCourse[]>
> => {
    const nextData = await callEndpoint<CanvasCourse[]>("courses", {
        fallback: [],
    });
    return nextData;
};
