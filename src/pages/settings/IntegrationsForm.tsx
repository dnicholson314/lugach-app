import { SwapHoriz } from "@mui/icons-material";
import {
    Alert,
    CircularProgress,
    Box,
    Typography,
    Stack,
    Button,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Snackbar,
} from "@mui/material";
import { SubmitEvent, useState } from "react";
import { CanvasCourse } from "src/api/canvas/courses";
import { Integrations } from "src/api/integrations";
import { TopHatCourse } from "src/api/top-hat/courses";
import { CanvasCourseSelect } from "src/components/CanvasCourseSelect";
import { TopHatCourseSelect } from "src/components/TopHatCourseSelect";
import { useCanvasCourses } from "src/hooks/canvas/courses";
import { useIntegrations } from "src/hooks/integrations";
import { useTopHatCourses } from "src/hooks/top-hat/courses";

const TOAST_DURATION_MS = 2000;

const getTopHatCourseFromCanvasCourseId = (
    canvasCourseId: number,
    integrations: Integrations,
    topHatCourses: TopHatCourse[],
): TopHatCourse | undefined => {
    if (!(canvasCourseId in integrations)) {
        return;
    }

    const topHatCourseId = integrations[canvasCourseId];
    const topHatCourse = topHatCourses.find(
        (course: TopHatCourse) => course.course_id === topHatCourseId,
    );

    return topHatCourse;
};

export const IntegrationsForm = () => {
    const [selectedCanvasCourseId, setSelectedCanvasCourseId] =
        useState<number>();
    const [selectedTopHatCourseId, setSelectedTopHatCourseId] =
        useState<number>();
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>();

    const {
        value: canvasCourses,
        error: canvasCoursesError,
        loading: canvasCoursesLoading,
    } = useCanvasCourses();

    const {
        value: topHatCourses,
        error: topHatCoursesError,
        loading: topHatCoursesLoading,
    } = useTopHatCourses();

    const {
        value: integrations,
        error: integrationsError,
        loading: integrationsLoading,
        fetchData,
    } = useIntegrations();

    const error = canvasCoursesError || topHatCoursesError || integrationsError;
    const loading =
        canvasCoursesLoading || topHatCoursesLoading || integrationsLoading;

    const handleToastClose = () => {
        setToastOpen(false);
    };

    const handleSubmitForm = async (
        event: SubmitEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        let nextSaveError = undefined;
        if (!selectedCanvasCourseId) {
            nextSaveError = "Please select a Canvas course.";
            return;
        } else {
            nextSaveError = await window.api.saveIntegration(
                selectedCanvasCourseId,
                selectedTopHatCourseId,
            );
        }

        setSaveError(nextSaveError);
        setToastOpen(true);
        fetchData();
    };
    return error ? (
        <Alert severity="error">{error}</Alert>
    ) : loading ? (
        <CircularProgress />
    ) : (
        <Box>
            <Typography>
                Select a Canvas course below to link it to a Top Hat course.
            </Typography>
            <Stack
                component="form"
                direction="row"
                gap="10px"
                alignItems="center"
                onSubmit={handleSubmitForm}
            >
                <CanvasCourseSelect
                    sx={{ width: "200px" }}
                    onChange={(course: CanvasCourse) =>
                        setSelectedCanvasCourseId(course.id)
                    }
                />
                <SwapHoriz />
                <TopHatCourseSelect
                    sx={{ width: "200px" }}
                    onChange={(course: TopHatCourse) =>
                        setSelectedTopHatCourseId(course.course_id)
                    }
                />
                <Button type="submit">Update</Button>
            </Stack>
            <TableContainer>
                <Table size="small" sx={{ width: "500px" }}>
                    <TableBody>
                        {canvasCourses.map((course: CanvasCourse) => (
                            <TableRow key={course.id}>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>
                                    {getTopHatCourseFromCanvasCourseId(
                                        course.id,
                                        integrations,
                                        topHatCourses,
                                    )?.course_name ?? "None"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar
                open={toastOpen}
                onClose={handleToastClose}
                autoHideDuration={TOAST_DURATION_MS}
            >
                <Alert
                    onClose={handleToastClose}
                    severity={saveError ? "error" : "success"}
                    sx={{ width: "100%" }}
                >
                    {saveError ?? "Canvas credentials saved"}
                </Alert>
            </Snackbar>
        </Box>
    );
};
