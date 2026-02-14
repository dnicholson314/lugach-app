import { CanvasCourseData } from "src/hooks/courses";
import { CanvasStudentData } from "src/hooks/students";

declare global {
    interface Window {
        api: {
            getCanvasCourses: () => Promise<CanvasCourseData>;
            getCanvasStudents: (courseId) => Promise<CanvasStudentData>;
        };
    }
}
