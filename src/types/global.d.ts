import { CanvasCourse } from "src/hooks/courses";
import { CanvasStudent } from "src/hooks/students";

declare global {
    interface Window {
        api: {
            getCanvasCourses: () => Promise<CanvasCourse[]>;
            getCanvasStudents: (courseId) => Promise<CanvasStudent[]>;
        };
    }
}
