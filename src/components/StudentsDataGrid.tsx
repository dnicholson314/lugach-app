import { Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { CanvasStudent } from "src/api/students";
import { useCanvasStudents } from "src/hooks/students";

interface StudentsDataGridProps {
    courseId?: number;
    onStudentSelect?: (studentId: number) => void;
}

const STUDENTS_DATA_GRID_COLS: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "sis_user_id", headerName: "Liberty ID", flex: 1 },
];

export const StudentsDataGrid = ({
    courseId,
    onStudentSelect,
}: StudentsDataGridProps) => {
    const {
        value: students,
        error: studentsError,
        loading: studentsLoading,
    } = useCanvasStudents(courseId, courseId === undefined);

    const handleRowClick = (params: GridRowParams<CanvasStudent>) => {
        onStudentSelect(params.row.id);
    };

    return (
        <>
            {studentsError ? (
                <Alert severity="error">{studentsError}</Alert>
            ) : null}
            <DataGrid
                rows={students}
                columns={STUDENTS_DATA_GRID_COLS}
                loading={studentsLoading}
                density="compact"
                onRowClick={handleRowClick}
                disableColumnSelector
                disableColumnMenu
                showToolbar
                slotProps={{
                    toolbar: {
                        csvOptions: { disableToolbarButton: true },
                        printOptions: { disableToolbarButton: true },
                    },
                }}
            />
        </>
    );
};
