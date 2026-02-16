import {
    Alert,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@mui/material";
import { CanvasStudent } from "src/api/canvas/students";
import { useCanvasStudents } from "src/hooks/students";

interface StudentInfoTableProps {
    courseId: number;
    studentId: number;
}

export const StudentInfoTable = ({
    courseId,
    studentId,
}: StudentInfoTableProps) => {
    const { value: students, error, loading } = useCanvasStudents(courseId);
    const selectedStudent = students.find(
        (student: CanvasStudent): boolean => student.id == studentId,
    );

    return (
        <>
            {error ? (
                <Alert severity="error">{error}</Alert>
            ) : !selectedStudent || loading ? (
                <LinearProgress />
            ) : (
                <TableContainer sx={{ width: "100%" }}>
                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{selectedStudent.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>{selectedStudent.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>LU ID</TableCell>
                                <TableCell>
                                    {selectedStudent.sis_user_id}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
};
