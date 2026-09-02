import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { Course } from "../canvas/courses";
import { Student } from "../canvas/students";

interface StudentRow {
    /** Unique row key for DataGrid (course_id + user_id to handle cross-course duplicates). */
    rowId: string;
    id: number;
    name: string;
    email: string;
    sis_user_id: string | null;
    course_id: number;
    course_name: string;
}

type StudentsDataGridParams = {
    courses: Course[];
    students: Student[];
    loading: boolean;
    error: string | null;
};

const STUDENT_COLUMNS: GridColDef<StudentRow>[] = [
    { field: "name", headerName: "Name", flex: 1.5, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 2, minWidth: 180 },
    { field: "sis_user_id", headerName: "SIS User ID", flex: 1, minWidth: 120 },
    { field: "course_name", headerName: "Course", flex: 2, minWidth: 160 },
];

export const StudentsDataGrid = ({
    courses,
    students,
    loading,
    error,
}: StudentsDataGridParams): React.JSX.Element => {
    const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");

    const visibleStudents: StudentRow[] = useMemo((): StudentRow[] => {
        const filteredStudents =
            selectedCourseId !== ""
                ? students.filter(
                      (student) => student.course_id === selectedCourseId,
                  )
                : students;

        return filteredStudents.map((student): StudentRow => ({
            ...student,
            rowId: `${student.course_id}-${student.id}`,
        }));
    }, [students, selectedCourseId]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControl fullWidth disabled={courses.length === 0}>
                <InputLabel id="course-filter-label">
                    {courses.length === 0
                        ? "No courses found"
                        : "Filter by course"}
                </InputLabel>
                <Select
                    labelId="course-filter-label"
                    value={selectedCourseId}
                    label={
                        courses.length === 0
                            ? "No courses found"
                            : "Filter by course"
                    }
                    onChange={(e) =>
                        setSelectedCourseId((e.target.value as number) || "")
                    }
                >
                    <MenuItem value="">
                        <em>All courses</em>
                    </MenuItem>
                    {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                            {course.course_code} – {course.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Typography variant="h6">
                Students
                {selectedCourseId !== "" && courses.length > 0
                    ? ` — ${courses.find((course) => course.id === selectedCourseId)?.course_code ?? ""}`
                    : " — All Courses"}
            </Typography>

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}

            <Box sx={{ height: 500 }}>
                <DataGrid<StudentRow>
                    rows={visibleStudents}
                    columns={STUDENT_COLUMNS}
                    getRowId={(row) => row.rowId}
                    loading={loading}
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnSelector
                    showToolbar
                    slotProps={{
                        toolbar: {
                            csvOptions: {
                                disableToolbarButton: true,
                            },
                            printOptions: {
                                disableToolbarButton: true,
                            },
                            showQuickFilter: true,
                        },
                    }}
                    disableRowSelectionOnClick
                />
            </Box>
        </Box>
    );
};
