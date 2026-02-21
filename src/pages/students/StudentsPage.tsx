import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { CoursesTreeView } from "src/components/CoursesTreeView";
import { StudentsDataGrid } from "src/components/StudentsDataGrid";
import { StudentDetailsStack } from "./StudentDetailsStack";

export interface StudentsGridProps {
    courseId: number;
}

export const StudentsPage = () => {
    const [courseId, setCourseId] = useState<number>();
    const [studentId, setStudentId] = useState<number>();

    return (
        <Stack direction="row" height="100vh" width="100vw">
            <Box sx={{ height: "100%", width: "20%" }}>
                <CoursesTreeView
                    onCourseSelect={(nextCourseId: number) => {
                        setCourseId(nextCourseId);
                        setStudentId(undefined);
                    }}
                />
            </Box>
            <Box sx={{ height: "100%", width: "50%" }}>
                <StudentsDataGrid
                    courseId={courseId}
                    onStudentSelect={(nextStudentId: number) =>
                        setStudentId(nextStudentId)
                    }
                />
            </Box>
            <Box sx={{ width: "30%" }}>
                {!courseId || !studentId ? (
                    <Typography>Select a student.</Typography>
                ) : (
                    <StudentDetailsStack
                        courseId={courseId}
                        studentId={studentId}
                    />
                )}
            </Box>
        </Stack>
    );
};
