import {
    Alert,
    LinearProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { Grade, useGrades } from "src/hooks/canvas/grades";
import { GradeEditButton } from "./GradeEditButton";
import { useEffect, useState } from "react";
import { formatDate } from "src/common/functions";
import { DueDateEditButton } from "./DueDateEditButton";

interface UpdateableFields {
    score?: number;
    dueAt?: Date;
}

interface StudentGradesTableProps {
    courseId: number;
    studentId: number;
}

type OptimisticUpdates = Record<number, UpdateableFields>;

export const StudentGradesTable = ({
    courseId,
    studentId,
}: StudentGradesTableProps) => {
    const [optimisticUpdates, setOptimisticUpdates] =
        useState<OptimisticUpdates>({});

    const { value: grades, error, loading } = useGrades(courseId, studentId);

    const displayGrades: Grade[] = grades.map((grade: Grade) => {
        const localGrade = grade;
        const localScore = optimisticUpdates[grade.id]?.score;
        if (localScore) {
            localGrade.score = localScore;
        }

        const localDueAt = optimisticUpdates[grade.id]?.dueAt;
        if (localDueAt) {
            localGrade.due_at = localDueAt;
        }

        return grade;
    });

    useEffect(() => {
        setOptimisticUpdates({});
    }, [studentId]);

    const handleGradeUpdated = (
        updatedGrade: Grade,
        newScore: number,
    ): void => {
        setOptimisticUpdates(
            (previous: OptimisticUpdates): OptimisticUpdates => {
                const next = { ...previous };
                if (next[updatedGrade.id]) {
                    next[updatedGrade.id].score = newScore;
                } else {
                    next[updatedGrade.id] = {
                        score: newScore,
                    };
                }
                return next;
            },
        );
    };

    const handleDueDateUpdated = (
        updatedGrade: Grade,
        newDueDate: Date,
    ): void => {
        setOptimisticUpdates(
            (previous: OptimisticUpdates): OptimisticUpdates => {
                const next = { ...previous };
                if (next[updatedGrade.id]) {
                    next[updatedGrade.id].dueAt = newDueDate;
                } else {
                    next[updatedGrade.id] = {
                        dueAt: newDueDate,
                    };
                }
                return next;
            },
        );
    };

    return (
        <>
            {error ? (
                <Alert severity="error">{error}</Alert>
            ) : loading ? (
                <LinearProgress />
            ) : !grades.length ? (
                <Typography>No assignments found.</Typography>
            ) : (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Assignment</TableCell>
                                <TableCell>Due date</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayGrades.map((grade: Grade) => (
                                <TableRow key={`submission-${grade.id}`}>
                                    <TableCell>
                                        <a
                                            href={grade.html_url}
                                            target="_blank"
                                        >
                                            {grade.name}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {!grade.due_at ? null : (
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                            >
                                                {formatDate(grade.due_at)}
                                                <DueDateEditButton
                                                    courseId={courseId}
                                                    studentId={studentId}
                                                    grade={grade}
                                                    onDueDateUpdated={
                                                        handleDueDateUpdated
                                                    }
                                                />
                                            </Stack>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {!grade.published ? (
                                            <Tooltip title="Assignment is unpublished.">
                                                <span>N/A</span>
                                            </Tooltip>
                                        ) : (
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                            >
                                                {grade.score}
                                                <GradeEditButton
                                                    courseId={courseId}
                                                    studentId={studentId}
                                                    grade={grade}
                                                    onGradeUpdated={
                                                        handleGradeUpdated
                                                    }
                                                />
                                            </Stack>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {grade.points_possible}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
};
