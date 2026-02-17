import { useState, useEffect } from "react";
import { TopHatStudent } from "src/api/top-hat/students";
import { HookData } from "src/common/models";

export const useTopHatStudents = (): HookData<TopHatStudent[]> => {
    const [students, setStudents] = useState<TopHatStudent[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(undefined);

            try {
                const data = await window.api.getTopHatStudents();
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
    }, []);

    return {
        value: students,
        error: error,
        loading: loading,
    };
};
