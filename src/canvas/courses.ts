import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useState } from "react";

export interface Course {
    id: number;
    name: string;
    course_code: string;
}

interface UseCoursesReturn {
    courses: Course[];
    error: string | null;
    loading: boolean;
    refetch: () => Promise<void>;
}

export const useCourses = (): UseCoursesReturn => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchCourses = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const result: Course[] = await invoke<Course[]>("get_courses");
            setCourses(result);

            // Clear selection if it no longer exists.
            // setSelectedCourseId(
            //     (previous: number | undefined): number | undefined =>
            //         result.find((course) => course.id === previous)?.id,
            // );
        } catch (err) {
            setCourses([]);
            setError(typeof err === "string" ? err : "Failed to load courses.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return {
        courses,
        error,
        loading,
        refetch: fetchCourses,
    };
};
