import { Edit } from "@mui/icons-material";
import { Alert, Box, Button, Popover, Snackbar, Stack } from "@mui/material";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { SubmitEvent, useState } from "react";
import { Grade } from "src/hooks/canvas/grades";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface DueDateEditButtonProps {
    courseId: number;
    studentId: number;
    grade: Grade;
    onDueDateUpdated?: (grade: Grade, nextDate: Date) => void;
}

interface DueDateEditPopoverProps extends DueDateEditButtonProps {
    anchorEl: HTMLButtonElement | null;
    onClose: () => void;
}

const TOAST_DURATION_MS = 2000;

const DueDateEditPopover = ({
    courseId,
    studentId,
    grade,
    anchorEl,
    onClose,
    onDueDateUpdated,
}: DueDateEditPopoverProps) => {
    const [dateValue, setDateValue] = useState<Dayjs | undefined>(
        grade.due_at && dayjs(grade.due_at),
    );
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
        if (!dateValue) {
            setSaveError("Specify a date.");
            return;
        }

        const dueAt = dateValue.toDate();

        const { error: nextSaveError } = await window.api.editAssignmentDueDate(
            courseId,
            grade.assignmentId,
            studentId,
            { dueAt },
        );
        setLoading(false);
        setSaveError(nextSaveError);
        setToastOpen(true);

        if (!nextSaveError) {
            onDueDateUpdated?.(grade, dueAt);
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
                    {saveError ?? "Due date updated!"}
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateField
                                value={dateValue}
                                onChange={(newValue) => setDateValue(newValue)}
                                label="New due date"
                            />
                        </LocalizationProvider>
                        <Button loading={loading} type="submit">
                            Update
                        </Button>
                    </Stack>
                </Popover>
            )}
        </>
    );
};

export const DueDateEditButton = (props: DueDateEditButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    return (
        <Box display="flex" alignItems="center">
            <Button
                sx={{ p: 0, minWidth: 0 }}
                onClick={(event) => setAnchorEl(event.currentTarget)}
            >
                <Edit fontSize="inherit" />
            </Button>
            <DueDateEditPopover
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                {...props}
            />
        </Box>
    );
};
