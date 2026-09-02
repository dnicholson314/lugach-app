import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Course } from "./courses";

interface RawStudent {
    /** Human-readable course label, joined in from the courses list. */
    id: number;
    name: string;
    email: string;
    sis_user_id: string | null;
    course_id: number;
}

export type Student = RawStudent & {
    course_name: string;
};

interface UseStudentsReturn {
    students: Student[];
    error: string | null;
    loading: boolean;
}

export const useStudents = (courses: Course[]): UseStudentsReturn => {
    const [students, setStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async (): Promise<void> => {
            if (courses.length === 0) {
                setStudents([]);
            }

            setLoading(true);
            setError(null);

            try {
                const results = await Promise.all(
                    courses.map((course: Course): Promise<Student[]> =>
                        invoke<RawStudent[]>("get_students", {
                            courseId: course.id,
                        }).then((rawStudents: RawStudent[]): Student[] =>
                            rawStudents.map(
                                (rawStudent: RawStudent): Student => ({
                                    ...rawStudent,
                                    course_name: `${course.course_code} – ${course.name}`,
                                }),
                            ),
                        ),
                    ),
                );
                setStudents(results.flat());
            } catch (err) {
                setStudents([]);
                setError(
                    typeof err === "string" ? err : "Failed to load students.",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [courses]);

    return {
        students,
        error,
        loading,
    };
};
