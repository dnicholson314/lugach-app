import { CheckBox, CheckBoxOutlined, Clear } from "@mui/icons-material";
import {
    Alert,
    LinearProgress,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { pink } from "@mui/material/colors";
import { CanvasCourse } from "src/api/canvas/courses";
import { CanvasStudent } from "src/api/canvas/students";
import { TopHatCourse } from "src/api/top-hat/courses";
import { TopHatStudent } from "src/api/top-hat/students";
import { useCanvasCourses } from "src/hooks/courses";
import { useCanvasStudents } from "src/hooks/students";
import { Attendance, useAttendance } from "src/hooks/top-hat/attendance";
import { useTopHatCourses } from "src/hooks/top-hat/courses";
import { useTopHatStudents } from "src/hooks/top-hat/students";

interface StudentAttendanceTableProps {
    canvasCourseId: number;
    canvasStudentId: number;
}

export const StudentAttendanceTable = ({
    canvasCourseId,
    canvasStudentId,
}: StudentAttendanceTableProps) => {
    const {
        value: canvasCourses,
        error: canvasCoursesError,
        loading: canvasCoursesLoading,
    } = useCanvasCourses();
    const canvasCourse = canvasCourses.find(
        (course: CanvasCourse): boolean => course.id === canvasCourseId,
    );

    const {
        value: topHatCourses,
        error: topHatCoursesError,
        loading: topHatCoursesLoading,
    } = useTopHatCourses();
    const topHatCourse = topHatCourses.find(
        (course: TopHatCourse): boolean =>
            course.course_name === canvasCourse?.name,
    );

    const {
        value: canvasStudents,
        error: canvasStudentsError,
        loading: canvasStudentsLoading,
    } = useCanvasStudents(canvasCourseId);
    const canvasStudent = canvasStudents.find(
        (student: CanvasStudent): boolean => student.id === canvasStudentId,
    );

    const {
        value: topHatStudents,
        error: topHatStudentsError,
        loading: topHatStudentsLoading,
    } = useTopHatStudents(topHatCourse?.course_id);
    const topHatStudent = topHatStudents.find(
        (student: TopHatStudent): boolean =>
            student.email === canvasStudent?.email,
    );

    const {
        value: attendances,
        error: attendancesError,
        loading: attendancesLoading,
    } = useAttendance(topHatCourse?.course_id, topHatStudent?.id);

    const error =
        canvasCoursesError ||
        canvasStudentsError ||
        topHatCoursesError ||
        topHatStudentsError ||
        attendancesError;
    let errorText: string;
    if (!error) {
        errorText = "";
    } else if (error.includes("404")) {
        errorText = "Could not retrieve Top Hat course.";
    } else if (error.includes("500")) {
        errorText = "Could not retrieve attendance records for this student.";
    } else {
        errorText = "An error occurred.";
    }

    const loading =
        canvasCoursesLoading ||
        canvasStudentsLoading ||
        topHatCoursesLoading ||
        topHatStudentsLoading ||
        attendancesLoading;

    return (
        <>
            {error ? (
                <Alert severity="error">{errorText}</Alert>
            ) : loading ? (
                <LinearProgress />
            ) : !attendances.length ? (
                <Typography>No attendance history found.</Typography>
            ) : (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attendances.map((attendance: Attendance) => (
                                <>
                                    <TableRow
                                        key={`submission-${attendance.id}`}
                                    >
                                        <TableCell>
                                            {attendance.date_taken}
                                        </TableCell>
                                        <TableCell>
                                            {attendance.excused ? (
                                                <CheckBoxOutlined color="primary" />
                                            ) : attendance.attended ? (
                                                <CheckBox color="success" />
                                            ) : (
                                                <Clear
                                                    sx={{ color: pink[500] }}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
};
