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
import { useState } from "react";
import { formatDate } from "src/common/functions";

interface StudentGradesTableProps {
    courseId: number;
    studentId: number;
}

type OptimisticUpdates = Record<number, number>;

export const StudentGradesTable = ({
    courseId,
    studentId,
}: StudentGradesTableProps) => {
    const [optimisticUpdates, setOptimisticUpdates] =
        useState<OptimisticUpdates>({});

    const { value: grades, error, loading } = useGrades(courseId, studentId);

    const displayGrades = grades.map((grade) => {
        const localScore = optimisticUpdates[grade.id];
        if (!localScore) return grade;

        return {
            ...grade,
            score: localScore,
        };
    });

    const handleGradeUpdated = (
        updatedGrade: Grade,
        newScore: number,
    ): void => {
        setOptimisticUpdates(
            (previous: OptimisticUpdates): OptimisticUpdates => ({
                ...previous,
                [updatedGrade.id]: newScore,
            }),
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
                                        {grade.due_at &&
                                            formatDate(grade.due_at)}
                                    </TableCell>
                                    <TableCell>
                                        {!grade.published ? (
                                            <Tooltip title="Assignment is unpublished.">
                                                <span>N/A</span>
                                            </Tooltip>
                                        ) : (
                                            <Stack direction="row" gap="5px">
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
