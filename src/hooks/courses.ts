import { useEffect, useState } from "react";

export interface CanvasCourse {
    id: number;
    name: string;
    course_code: string;
}

export interface CanvasCourseData {
    data: CanvasCourse[];
    error?: string;
    loading: boolean;
}

export const useCanvasCourses = (): CanvasCourseData => {
    const [courses, setCourses] = useState<CanvasCourse[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(undefined);

            try {
                const data = await window.api.getCanvasCourses();
                setCourses(data);
            } catch (err) {
                setCourses([]);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return {
        data: courses,
        error: error,
        loading: loading,
    };
};
