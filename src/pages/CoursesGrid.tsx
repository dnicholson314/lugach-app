import Alert from "@mui/material/Alert";
import { useCanvasCourses } from "src/hooks/courses";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "course_code", headerName: "Course Code", width: 200 },
];

export const CoursesGrid = () => {
    const { value: courses, error, loading } = useCanvasCourses();

    return (
        <>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {courses.length ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <DataGrid
                        rows={courses}
                        columns={columns}
                        loading={loading}
                    />
                </div>
            ) : null}
        </>
    );
};
