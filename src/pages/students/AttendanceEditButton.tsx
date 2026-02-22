import { Edit } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Popover,
    Radio,
    RadioGroup,
    Snackbar,
    Stack,
} from "@mui/material";
import { SubmitEvent, useState } from "react";
import { AttendanceOption } from "src/common/models";
import { Attendance } from "src/hooks/top-hat/attendance";

interface AttendanceEditButtonProps {
    studentId: number;
    courseId: number;
    attendance: Attendance;
    onAttendanceUpdated?: (
        attendance: Attendance,
        nextOption: AttendanceOption,
    ) => void;
}

const TOAST_DURATION_MS = 2000;

export const AttendanceEditButton = ({
    studentId,
    courseId,
    attendance,
    onAttendanceUpdated,
}: AttendanceEditButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleToastClose = () => {
        setToastOpen(false);
    };

    const handleSubmitForm = async (
        event: SubmitEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const newAttendance = formData.get("attendance") as AttendanceOption;

        const { error: nextSaveError } = await window.api.editAttendance(
            courseId,
            studentId,
            attendance.item_id,
            newAttendance,
        );
        setLoading(false);
        setSaveError(nextSaveError);
        setToastOpen(true);

        if (!nextSaveError) {
            onAttendanceUpdated?.(attendance, newAttendance);
            handlePopoverClose();
        }
    };

    const open = Boolean(anchorEl);
    return (
        <Box>
            <Button onClick={handleButtonClick}>
                <Edit />
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
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
                    <FormControl>
                        <FormLabel>Status</FormLabel>
                        <RadioGroup defaultValue="present" name="attendance">
                            <FormControlLabel
                                value="present"
                                control={<Radio size="small" />}
                                label="Present"
                            />
                            <FormControlLabel
                                value="absent"
                                control={<Radio size="small" />}
                                label="Absent"
                            />
                            <FormControlLabel
                                value="excused"
                                control={<Radio size="small" />}
                                label="Excused"
                            />
                        </RadioGroup>
                    </FormControl>
                    <Button loading={loading} type="submit">
                        Update
                    </Button>
                </Stack>
            </Popover>
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
        </Box>
    );
};
