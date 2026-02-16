import { CanvasCourse } from "src/api/courses";
import { EndpointData } from "src/common/models";
import { Assignment } from "src/api/grades";
import { CanvasStudent } from "src/hooks/students";

declare global {
    interface Window {
        api: {
            getCanvasCourses: () => Promise<EndpointData<CanvasCourse[]>>;
            getCanvasStudents: (
                courseId: number,
            ) => Promise<EndpointData<CanvasStudent[]>>;
            getAssignments: (
                courseId: number,
            ) => Promise<EndpointData<Assignment[]>>;
            getSubmission(
                courseId: number,
                assignmentId: number,
                studentId: number,
            );
        };
    }
}
