import {
    Box,
    CircularProgress,
    Stack,
    Table,
    TableCell,
    TableContainer,
    TableRow,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { RichTreeView } from "@mui/x-tree-view";
import { useState } from "react";
import { CanvasCourse } from "src/api/courses";
import { useCanvasCourses } from "src/hooks/courses";
import { useCanvasStudents } from "src/hooks/students";

export interface StudentsGridProps {
    courseId: number;
}

const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "sis_user_id", headerName: "Liberty ID", flex: 1 },
];

export const StudentsGrid = () => {
    const [courseId, setCourseId] = useState<number>();
    const [selectedStudentId, setSelectedStudentId] = useState<number>();
    const {
        value: students,
        error: studentsError,
        loading: studentsLoading,
    } = useCanvasStudents(courseId, courseId === undefined);
    const {
        value: courses,
        error: coursesError,
        loading: coursesLoading,
    } = useCanvasCourses();
    const courseTreeItems = [
        {
            id: "canvas",
            label: "Canvas",
            children: courses.map((course) => ({
                id: course.id,
                label: course.name,
            })),
        },
    ];
    const selectedStudent =
        selectedStudentId &&
        students.find((student) => student.id == selectedStudentId);

    const handleRowClick = (params: GridRowParams<CanvasCourse>) => {
        setSelectedStudentId(params.row.id);
    };

    return (
        <>
            <Stack direction="row" height="100vh" width="100vw">
                <Box sx={{ height: "100%", width: "20%" }}>
                    {coursesError ? (
                        <Alert severity="error">{coursesError}</Alert>
                    ) : null}
                    {!coursesLoading ? (
                        <RichTreeView
                            items={courseTreeItems}
                            expandedItems={["canvas"]}
                            onItemSelectionToggle={(_, itemId, isSelected) => {
                                if (!isSelected || !Number(itemId)) {
                                    return;
                                }
                                setCourseId(Number(itemId));
                            }}
                        />
                    ) : (
                        <CircularProgress />
                    )}
                </Box>
                <Box sx={{ height: "100%", width: "50%" }}>
                    {studentsError ? (
                        <Alert severity="error">{studentsError}</Alert>
                    ) : null}
                    <DataGrid
                        rows={students}
                        columns={columns}
                        loading={studentsLoading}
                        density="compact"
                        onRowClick={handleRowClick}
                    />
                </Box>
                <Stack sx={{ width: "30%" }}>
                    {selectedStudent ? (
                        <TableContainer sx={{ width: "100%" }}>
                            <Table size="small">
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>
                                        {selectedStudent.name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>
                                        {selectedStudent.email}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>LU ID</TableCell>
                                    <TableCell>
                                        {selectedStudent.sis_user_id}
                                    </TableCell>
                                </TableRow>
                            </Table>
                        </TableContainer>
                    ) : null}
                </Stack>
            </Stack>
        </>
    );
};
