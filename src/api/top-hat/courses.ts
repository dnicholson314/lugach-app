import { EndpointData } from "src/common/models";
import { callEndpoint } from "./base";

export interface TopHatCourse {
    course_id: number;
    course_name: string;
    course_code: string;
}

interface TopHatCourseEndpointStructure {
    objects: TopHatCourse[];
}

export const handleGetTopHatCourses = async (): Promise<
    EndpointData<TopHatCourse[]>
> => {
    const data = await callEndpoint<TopHatCourseEndpointStructure>(
        "v2/courses",
        { objects: [] },
    );
    return {
        value: data.value.objects,
        error: data.error,
    };
};
