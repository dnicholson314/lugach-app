import MoreVert from "@mui/icons-material/MoreVert";
import Alert from "@mui/material/Alert";
import {
    DataGrid,
    GridActionsCell,
    GridActionsCellItem,
    GridColDef,
    GridRenderCellParams,
} from "@mui/x-data-grid";
import { useState } from "react";
import { CourseSelect } from "src/components/CourseSelect";
import { CanvasCourse } from "src/hooks/courses";
import { useCanvasStudents } from "src/hooks/students";

const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "sis_user_id", headerName: "Liberty ID", width: 100 },
    { field: "email", headerName: "Email", width: 200 },
    {
        field: "actions",
        type: "actions",
        width: 40,
        headerAlign: "right",
        renderCell: (params: GridRenderCellParams) => (
            <GridActionsCell {...params}>
                <GridActionsCellItem
                    icon={<MoreVert />}
                    label="Details"
                    onClick={() => console.log(params.id)}
                />
            </GridActionsCell>
        ),
    },
];

export interface StudentsGridProps {
    courseId: number;
}

export const StudentsGrid = () => {
    const [courseId, setCourseId] = useState<number | undefined>();
    const {
        value: students,
        error,
        loading,
    } = useCanvasStudents(courseId, courseId === undefined);

    return (
        <>
            <CourseSelect
                onChange={(course?: CanvasCourse) => {
                    if (!course) {
                        setCourseId(undefined);
                        return;
                    }
                    setCourseId(course.id);
                }}
            />
            {error ? <Alert severity="error">{error}</Alert> : null}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <DataGrid rows={students} columns={columns} loading={loading} />
            </div>
        </>
    );
};
