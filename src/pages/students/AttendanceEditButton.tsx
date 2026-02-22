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
import { SubmitEvent, useMemo, useState } from "react";
import { AttendanceOption } from "src/common/models";
import { Attendance } from "src/hooks/top-hat/attendance";

interface AttendanceEditButtonProps {
    courseId: number;
    studentId: number;
    attendance: Attendance;
    onAttendanceUpdated?: (
        attendance: Attendance,
        nextOption: AttendanceOption,
    ) => void;
}

interface AttendanceEditPopoverProps extends AttendanceEditButtonProps {
    anchorEl: HTMLButtonElement | null;
    onClose: () => void;
}

const TOAST_DURATION_MS = 2000;

const AttendanceEditPopover = ({
    courseId,
    studentId,
    attendance,
    anchorEl,
    onClose,
    onAttendanceUpdated,
}: AttendanceEditPopoverProps) => {
    const [saveError, setSaveError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [toastOpen, setToastOpen] = useState<boolean>(false);

    const defaultStatus = useMemo((): AttendanceOption => {
        if (attendance.excused) {
            return "excused";
        } else if (attendance.attended) {
            return "present";
        } else {
            return "absent";
        }
    }, [attendance]);

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
                        <FormControl>
                            <FormLabel>Status</FormLabel>
                            <RadioGroup
                                defaultValue={defaultStatus}
                                name="attendance"
                            >
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
            )}
        </>
    );
};

export const AttendanceEditButton = (props: AttendanceEditButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    return (
        <Box>
            <Button onClick={(event) => setAnchorEl(event.currentTarget)}>
                <Edit />
            </Button>
            <AttendanceEditPopover
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                {...props}
            />
        </Box>
    );
};
