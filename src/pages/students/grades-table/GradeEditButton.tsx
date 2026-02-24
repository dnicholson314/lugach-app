import { Edit } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Popover,
    Snackbar,
    Stack,
    TextField,
} from "@mui/material";
import { SubmitEvent, useState } from "react";
import { Score } from "src/api/canvas/grades";
import { Grade } from "src/hooks/canvas/grades";

interface AttendanceEditButtonProps {
    courseId: number;
    studentId: number;
    grade: Grade;
    onGradeUpdated?: (grade: Grade, nextScore: Score) => void;
}

interface AttendanceEditPopoverProps extends AttendanceEditButtonProps {
    anchorEl: HTMLButtonElement | null;
    onClose: () => void;
}

const TOAST_DURATION_MS = 2000;

const GradeEditPopover = ({
    courseId,
    studentId,
    grade,
    anchorEl,
    onClose,
    onGradeUpdated,
}: AttendanceEditPopoverProps) => {
    const [saveError, setSaveError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [toastOpen, setToastOpen] = useState<boolean>(false);

    const handleToastClose = () => {
        setToastOpen(false);
    };

    const handleSubmitForm = async (
        event: SubmitEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const newScore = formData.get("score") as Score;

        const { error: nextSaveError } = await window.api.gradeSubmission(
            courseId,
            grade.assignmentId,
            studentId,
            newScore,
        );
        setLoading(false);
        setSaveError(nextSaveError);
        setToastOpen(true);

        if (!nextSaveError) {
            onGradeUpdated?.(grade, newScore);
            onClose();
        }
    };

    return (
        <>
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
                    {saveError ?? "Attendance updated!"}
                </Alert>
            </Snackbar>
            {!anchorEl ? null : (
                <Popover
                    open
                    anchorEl={anchorEl}
                    onClose={onClose}
                    anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                    }}
                >
                    <Stack
                        component="form"
                        sx={{ p: 2 }}
                        onSubmit={handleSubmitForm}
                    >
                        <TextField
                            size="small"
                            defaultValue={grade.score}
                            required
                            name="score"
                            label="New score"
                        />
                        <Button loading={loading} type="submit">
                            Update
                        </Button>
                    </Stack>
                </Popover>
            )}
        </>
    );
};

export const GradeEditButton = (props: AttendanceEditButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    return (
        <Box display="flex" alignItems="center">
            <Button
                sx={{ p: 0, minWidth: 0 }}
                onClick={(event) => setAnchorEl(event.currentTarget)}
            >
                <Edit fontSize="inherit" />
            </Button>
            <GradeEditPopover
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                {...props}
            />
        </Box>
    );
};
