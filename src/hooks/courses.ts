import { useEffect, useState } from "react";
import { CanvasCourse } from "src/api/courses";
import { HookData } from "src/common/models";

export const useCanvasCourses = (): HookData<CanvasCourse> => {
    const [courses, setCourses] = useState<CanvasCourse[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(undefined);

            try {
                const data = await window.api.getCanvasCourses();
                setCourses(data.value);
                setError(data.error);
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
        value: courses,
        error: error,
        loading: loading,
    };
};
