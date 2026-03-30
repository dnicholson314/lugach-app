import { Alert, Box, Button, Snackbar } from "@mui/material";
import { useState, useEffect, SubmitEvent } from "react";
import { CanvasCourse } from "src/api/canvas/courses";
import { CanvasCourseSelect } from "src/components/CanvasCourseSelect";
import { useCanvasCourses } from "src/hooks/canvas/courses";
import { useScope } from "src/hooks/scope";

const TOAST_DURATION_MS = 2000;

export const ScopedCanvasCoursesForm = () => {
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
                    {saveError ?? "Selected Canvas courses updated"}
                </Alert>
            </Snackbar>
        </>
    );
};
