import {
    Alert,
    CircularProgress,
    TextField,
    Button,
    Snackbar,
    Box,
} from "@mui/material";
import { SubmitEvent, useState } from "react";
import { useCanvasCredentials } from "src/hooks/secrets";

const TOAST_DURATION_MS = 2000;

export const CanvasCredentialsForm = () => {
    const {
        value: credentials,
        error,
        loading: credentialsLoading,
        fetchData,
    } = useCanvasCredentials();
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>();

    const handleToastClose = () => {
        setToastOpen(false);
    };

    const handleSaveCanvasCredentials = async (
        event: SubmitEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const apiUrl = formData.get("apiUrl") as string;
        const apiKey = formData.get("apiKey") as string;

        const nextSaveError = await window.api.saveCanvasCredentials({
            apiUrl,
            apiKey,
        });

        await fetchData();
        setSaveError(nextSaveError);
        setToastOpen(true);
    };
    return error ? (
        <Alert severity="error">{error}</Alert>
    ) : credentialsLoading ? (
        <CircularProgress />
    ) : (
        <Box mt="5px">
            <form onSubmit={handleSaveCanvasCredentials}>
                <TextField
                    defaultValue={credentials?.apiUrl}
                    required
                    name="apiUrl"
                    label="Canvas API URL"
                />
                <TextField
                    defaultValue={credentials?.apiKey}
                    required
                    type="password"
                    name="apiKey"
                    label="Canvas API key"
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
                    {saveError ?? "Canvas credentials saved"}
                </Alert>
            </Snackbar>
        </Box>
    );
};
