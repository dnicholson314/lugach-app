import { useState, useEffect } from "react";
import { TopHatStudent } from "src/api/top-hat/students";
import { HookData } from "src/common/models";

export const useTopHatStudents = (
    courseId: number,
): HookData<TopHatStudent[]> => {
    const [students, setStudents] = useState<TopHatStudent[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let isCurrent = true;

        const fetchStudents = async () => {
            setLoading(true);

            try {
                const data = await window.api.getTopHatStudents(courseId);
                if (isCurrent) {
                    setStudents(data.value);
                    setError(data.error);
                }
            } catch (err) {
                if (isCurrent) {
                    setStudents([]);
                    setError(err instanceof Error ? err.message : String(err));
                }
            } finally {
                if (isCurrent) {
                    setLoading(false);
                }
            }
        };

        fetchStudents();

        return () => {
            isCurrent = false;
        };
    }, [courseId]);

    return {
        value: students,
        error: error,
        loading: loading,
    };
};
