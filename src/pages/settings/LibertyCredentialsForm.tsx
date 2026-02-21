import {
    Alert,
    CircularProgress,
    TextField,
    Button,
    Snackbar,
    Box,
} from "@mui/material";
import { SubmitEvent, useState } from "react";
import { useLibertyCredentials } from "src/hooks/top-hat/secrets";

const TOAST_DURATION_MS = 2000;

export const LibertyCredentialsForm = () => {
    const {
        value: credentials,
        error,
        loading: credentialsLoading,
    } = useLibertyCredentials();
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>();

    const handleToastClose = () => {
        setToastOpen(false);
    };

    const handleSaveLibertyCredentials = async (
        event: SubmitEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const libertyUsername = formData.get("libertyUsername") as string;
        const libertyPassword = formData.get("libertyPassword") as string;

        const nextSaveError = await window.api.saveLibertyCredentials({
            libertyUsername,
            libertyPassword,
        });

        setSaveError(nextSaveError);
        setToastOpen(true);
    };
    return error ? (
        <Alert severity="error">{error}</Alert>
    ) : credentialsLoading ? (
        <CircularProgress />
    ) : (
        <Box mt="5px">
            <form onSubmit={handleSaveLibertyCredentials}>
                <TextField
                    defaultValue={credentials?.libertyUsername}
                    required
                    name="libertyUsername"
                    label="Liberty email"
                />
                <TextField
                    defaultValue={credentials?.libertyPassword}
                    required
                    type="password"
                    name="libertyPassword"
                    label="Liberty password"
                />
                <Button type="submit">Update</Button>
            </form>
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
                    {saveError ?? "Liberty credentials saved"}
                </Alert>
            </Snackbar>
        </Box>
    );
};
