import { useEffect, useState } from "react";
import { Assignment } from "src/api/canvas/grades";
import { HookData } from "src/common/models";

export interface Grade {
    id: number;
    assignmentId: number;
    name: string;
    html_url: string;
    published: boolean;
    due_at?: Date;
    points_possible?: number;
    submitted_at?: string;
    score?: number;
}

export const useGrades = (
    courseId: number,
    studentId: number,
    skipToken?: boolean,
): HookData<Grade[]> => {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchGrades = async () => {
            if (skipToken) {
                setGrades([]);
                setError(undefined);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(undefined);
            try {
                const assignmentsData =
                    await window.api.getAssignments(courseId);

                if (!assignmentsData.value.length) {
                    setGrades([]);
                    setError(assignmentsData.error);
                    return;
                }

                const nextError: string | undefined = undefined;
                const nextGrades: Grade[] = await Promise.all(
                    assignmentsData.value.map(
                        async (assignment: Assignment): Promise<Grade> => {
                            const submissionData =
                                await window.api.getSubmission(
                                    courseId,
                                    assignment.id,
                                    studentId,
                                );
                            if (!submissionData.value) {
                                throw new Error(
                                    "An error occurred while retrieving assignment data.",
                                );
                            }

                            const submission = submissionData.value;
                            return {
                                id: submission.id,
                                assignmentId: assignment.id,
                                name: assignment.name,
                                html_url: assignment.html_url,
                                published: assignment.published,
                                due_at:
                                    assignment.due_at &&
                                    new Date(Date.parse(assignment.due_at)),
                                points_possible: assignment.points_possible,
                                submitted_at: submission.submitted_at,
                                score: submission.score,
                            };
                        },
                    ),
                );

                setGrades(nextGrades);
                setError(nextError);
            } catch (err) {
                setGrades([]);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, [courseId, studentId, skipToken]);

    return {
        value: grades,
        error: error,
        loading: loading,
    };
};
