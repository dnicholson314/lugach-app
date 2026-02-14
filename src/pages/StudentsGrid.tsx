import Alert from "@mui/material/Alert";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useCanvasStudents } from "src/hooks/students";

const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "sis_user_id", headerName: "Liberty ID", width: 100 },
    { field: "email", headerName: "Email", width: 200 },
];

export interface StudentsGridProps {
    courseId: number;
}

export const StudentsGrid = ({ courseId }: StudentsGridProps) => {
    const { data: students, error, loading } = useCanvasStudents(courseId);
    console.log(students);

    return (
        <>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {students.length ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <DataGrid
                        rows={students}
                        columns={columns}
                        loading={loading}
                    />
                </div>
            ) : null}
        </>
    );
};
