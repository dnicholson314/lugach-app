import { CanvasCourse } from "../hooks/courses";

declare global {
    interface Window {
        api: {
            getCanvasCourses: () => Promise<CanvasCourse[]>;
        };
    }
}
