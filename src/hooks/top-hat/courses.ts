import { useEffect, useState } from "react";
import { TopHatCourse } from "src/api/top-hat/courses";
import { HookData } from "src/common/models";

export const useTopHatCourses = (): HookData<TopHatCourse[]> => {
    const [courses, setCourses] = useState<TopHatCourse[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(undefined);

            try {
                const data = await window.api.getTopHatCourses();
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
