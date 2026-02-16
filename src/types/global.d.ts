import { CanvasCourse } from "src/api/courses";
import { EndpointData } from "src/common/models";
import { CanvasStudent } from "src/hooks/students";

declare global {
    interface Window {
        api: {
            getCanvasCourses: () => Promise<EndpointData<CanvasCourse>>;
            getCanvasStudents: (
                courseId,
            ) => Promise<EndpointData<CanvasStudent>>;
        };
    }
}
