import { ArrowBack } from "@mui/icons-material";
import {
    Alert,
    Button,
    CircularProgress,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useView } from "../ViewContext";
import { useCanvasCredentials } from "src/hooks/secrets";
import { SubmitEvent, useState } from "react";

const TOAST_DURATION_MS = 2000;

export const SettingsPage = () => {
    const { setCurrentView } = useView();
    const {
        value: credentials,
        error,
        loading: credentialsLoading,
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

        setSaveError(nextSaveError);
        setToastOpen(true);
    };

    return (
        <>
            <Button color="inherit" onClick={() => setCurrentView("main")}>
                <ArrowBack />
                <Typography> Back</Typography>
            </Button>
            <Stack>
                {error ? (
                    <Alert severity="error">{error}</Alert>
                ) : credentialsLoading ? (
                    <CircularProgress />
                ) : (
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
                )}
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
