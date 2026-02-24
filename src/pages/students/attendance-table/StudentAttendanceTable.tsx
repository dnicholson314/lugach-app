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
    Box,
} from "@mui/material";
import { pink } from "@mui/material/colors";
import { CanvasStudent } from "src/api/canvas/students";
import { TopHatStudent } from "src/api/top-hat/students";
import { useCanvasStudents } from "src/hooks/canvas/students";
import { useIntegrations } from "src/hooks/integrations";
import { Attendance, useAttendance } from "src/hooks/top-hat/attendance";
import { useTopHatStudents } from "src/hooks/top-hat/students";
import { AttendanceEditButton } from "./AttendanceEditButton";
import { useState } from "react";
import { AttendanceOption } from "src/common/models";

interface StudentAttendanceTableProps {
    canvasCourseId: number;
    canvasStudentId: number;
}

type OptimisticUpdates = Record<number, AttendanceOption>;

export const StudentAttendanceTable = ({
    canvasCourseId,
    canvasStudentId,
}: StudentAttendanceTableProps) => {
    const [optimisticUpdates, setOptimisticUpdates] =
        useState<OptimisticUpdates>({});

    const {
        value: integrations,
        error: integrationsError,
        loading: integrationsLoading,
    } = useIntegrations();
    const topHatCourseId = integrations?.[canvasCourseId];

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
    } = useTopHatStudents(topHatCourseId);
    const topHatStudent = topHatStudents.find(
        (student: TopHatStudent): boolean =>
            student.email === canvasStudent?.email,
    );

    const {
        value: attendances,
        error: attendancesError,
        loading: attendancesLoading,
    } = useAttendance(topHatCourseId, topHatStudent?.id);

    const error =
        integrationsError ||
        canvasStudentsError ||
        topHatStudentsError ||
        attendancesError;

    let errorText = error;
    if (!error) {
        errorText = "";
    } else if (error.includes("404") || error.includes("500")) {
        errorText = "Could not retrieve attendance records for this student.";
    } else if (error.includes("Unable to obtain JWT token")) {
        errorText = "The provided Top Hat credentials were invalid.";
    }

    const loading =
        integrationsLoading ||
        canvasStudentsLoading ||
        topHatStudentsLoading ||
        attendancesLoading;

    const handleAttendanceUpdated = (
        updatedAttendance: Attendance,
        newStatus: AttendanceOption,
    ): void => {
        setOptimisticUpdates(
            (previous: OptimisticUpdates): OptimisticUpdates => ({
                ...previous,
                [updatedAttendance.id]: newStatus,
            }),
        );
    };

    const displayAttendances = attendances.map((attendance) => {
        const localStatus = optimisticUpdates[attendance.id];
        if (!localStatus) return attendance;

        return {
            ...attendance,
            attended: localStatus === "present",
            excused: localStatus === "excused",
        };
    });

    return (
        <Box>
            {error ? (
                <Alert severity="error">{errorText}</Alert>
            ) : loading ? (
                <LinearProgress />
            ) : !topHatStudent || !attendances.length ? (
                <Typography>No attendance history found.</Typography>
            ) : (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                    Edit
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayAttendances.map(
                                (attendance: Attendance) => (
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
                                        <TableCell sx={{ textAlign: "center" }}>
                                            <AttendanceEditButton
                                                courseId={topHatCourseId}
                                                studentId={topHatStudent.id}
                                                attendance={attendance}
                                                onAttendanceUpdated={
                                                    handleAttendanceUpdated
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ),
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};
