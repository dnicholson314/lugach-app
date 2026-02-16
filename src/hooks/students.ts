import { useEffect, useState } from "react";
import { CanvasStudent } from "src/api/canvas/students";
import { HookData } from "src/common/models";

export const useCanvasStudents = (
    courseId: number,
    skipToken?: boolean,
): HookData<CanvasStudent[]> => {
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
