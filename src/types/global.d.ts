import { CanvasCourse } from "src/hooks/courses";

declare global {
    interface Window {
        api: {
            getCanvasCourses: () => Promise<CanvasCourse[]>;
        };
    }
}
