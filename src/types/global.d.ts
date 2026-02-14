import { CanvasCourse } from "src/hooks/courses";
import { CanvasStudentData } from "src/hooks/students";

declare global {
    interface Window {
        api: {
            getCanvasCourses: () => Promise<CanvasCourse[]>;
            getCanvasStudents: (courseId) => Promise<CanvasStudentData>;
        };
    }
}
