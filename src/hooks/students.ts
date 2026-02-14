import { useEffect, useState } from "react";

export interface CanvasStudent {
    id: number;
    name: string;
    sis_user_id: string;
    email: string;
}

export interface CanvasStudentData {
    value: CanvasStudent[];
    error?: string;
    loading?: boolean;
}

export const useCanvasStudents = (
    courseId: number,
    skipToken?: boolean,
): CanvasStudentData => {
    const [students, setStudents] = useState<CanvasStudent[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchStudents = async () => {
            if (skipToken) {
                setStudents([]);
                setError(undefined);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(undefined);
            try {
                const data = await window.api.getCanvasStudents(courseId);
                setStudents(data.value);
                setError(data.error);
            } catch (err) {
                setStudents([]);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [courseId, skipToken]);

    return {
        value: students,
        error: error,
        loading: loading,
    };
};
