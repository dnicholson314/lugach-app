import { ArrowBack } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Divider,
    Snackbar,
    Stack,
    Typography,
} from "@mui/material";
import { useView } from "../ViewContext";
import { CanvasCredentialsForm } from "./CanvasCredentialsForm";
import { LibertyCredentialsForm } from "./LibertyCredentialsForm";
import { IntegrationsForm } from "./IntegrationsForm";
import { CanvasCourseSelect } from "src/components/CanvasCourseSelect";
import { SubmitEvent, useEffect, useState } from "react";
import { CanvasCourse } from "src/api/canvas/courses";
import { useScope } from "src/hooks/scope";
import { useCanvasCourses } from "src/hooks/canvas/courses";

const TOAST_DURATION_MS = 2000;

export const SettingsPage = () => {
    const { setCurrentView } = useView();
    const {
        value: scope,
        error,
        loading: scopeLoading,
        fetchData,
    } = useScope();
    const { value: courses, loading: coursesLoading } = useCanvasCourses();
    const [selectedCanvasCourses, setSelectedCanvasCourses] = useState<
        CanvasCourse[]
    >([]);
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>();

    const loading = scopeLoading || coursesLoading;

    useEffect(() => {
        if (!scope?.canvasCourses.length || !courses) {
            return;
        }

        const preselectedCourses = courses.filter((course) =>
            scope.canvasCourses.includes(course.id),
        );
        setSelectedCanvasCourses(preselectedCourses);
    }, [scope?.canvasCourses, courses]);

    const handleToastClose = () => {
        setToastOpen(false);
    };

    const handleSubmitForm = async (
        event: SubmitEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const nextSaveError = await window.api.saveScopedCanvasCourseIds(
            selectedCanvasCourses.map((course) => course.id),
        );

        await fetchData();
        setSaveError(nextSaveError);
        setToastOpen(true);
    };

    return (
        <>
            <Button color="inherit" onClick={() => setCurrentView("main")}>
                <ArrowBack />
                <Typography>Back</Typography>
            </Button>
            <Stack gap="25px">
                <Stack gap="10px">
                    <Typography>Canvas settings</Typography>
                    <Divider />
                    <Typography>Canvas credentials</Typography>
                    <CanvasCredentialsForm />
                    <Typography>Selected Canvas courses</Typography>
                    {error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <Box>
                            <form onSubmit={handleSubmitForm}>
                                <CanvasCourseSelect
                                    multiple
                                    sx={{ width: "300px" }}
                                    value={selectedCanvasCourses}
                                    isOptionEqualToValue={(
                                        option: CanvasCourse,
                                        value: CanvasCourse,
                                    ): boolean => option.id === value.id}
                                    onChange={(_, value: CanvasCourse[]) => {
                                        setSelectedCanvasCourses(value);
                                    }}
                                />
                                <Button type="submit" loading={loading}>
                                    Update
                                </Button>
                            </form>
                        </Box>
                    )}
                </Stack>
                <Stack gap="10px">
                    <Typography>Top Hat settings</Typography>
                    <Divider />
                    <LibertyCredentialsForm />
                </Stack>
                <Stack gap="10px">
                    <Typography>Canvas and Top Hat integration</Typography>
                    <Divider />
                    <IntegrationsForm />
                </Stack>
            </Stack>
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
        </>
    );
};
