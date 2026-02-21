import {
    Alert,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Grade, useGrades } from "src/hooks/grades";

interface StudentGradesTableProps {
    courseId: number;
    studentId: number;
}

export const StudentGradesTable = ({
    courseId,
    studentId,
}: StudentGradesTableProps) => {
    const { value: grades, error, loading } = useGrades(courseId, studentId);
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
                            {grades.map((grade: Grade) => (
                                <TableRow key={`submission-${grade.id}`}>
                                    <TableCell>
                                        <a
                                            href={grade.html_url}
                                            target="_blank"
                                        >
                                            {grade.name}
                                        </a>
                                    </TableCell>
                                    <TableCell>{grade.due_at}</TableCell>
                                    <TableCell>{grade.score}</TableCell>
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
