import { useEffect, useState } from "react";

export interface CanvasStudent {
    id: number;
    name: string;
    sis_user_id: string;
    email: string;
}

export interface CanvasStudentData {
    data: CanvasStudent[];
    error?: string;
    loading: boolean;
}

export const useCanvasStudents = (courseId: number): CanvasStudentData => {
    const [students, setStudents] = useState<CanvasStudent[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(undefined);

            try {
                const data = await window.api.getCanvasStudents(courseId);
                setStudents(data);
            } catch (err) {
                setStudents([]);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return {
        data: students,
        error: error,
        loading: loading,
    };
};
