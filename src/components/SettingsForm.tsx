import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

type SettingsFormParams = {
    onSubmit: (e: React.SubmitEvent) => void;
};

export const SettingsForm = ({
    onSubmit,
}: SettingsFormParams): React.JSX.Element => {
    const [apiKey, setApiKey] = useState("");
    const [apiUrl, setApiUrl] = useState("");
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            invoke<string | null>("get_api_key"),
            invoke<string | null>("get_api_url"),
        ]).then(([storedKey, storedUrl]) => {
            if (storedKey) setApiKey(storedKey);
            if (storedUrl) setApiUrl(storedUrl);
            setLoading(false);
        });
    }, []);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        await Promise.all([
            invoke("save_api_key", { apiKey }),
            invoke("save_api_url", { apiUrl }),
        ]);
        setSaved(true);
        onSubmit(e);
    };

    if (loading) return <CircularProgress sx={{ m: 3 }} />;

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
            <Typography variant="h6">Canvas Settings</Typography>

            <TextField
                label="Canvas URL"
                type="url"
                placeholder="https://canvas.instructure.com"
                value={apiUrl}
                onChange={(e) => {
                    setApiUrl(e.target.value);
                    setSaved(false);
                }}
                required
                fullWidth
            />

            <TextField
                label="API Key"
                type="password"
                value={apiKey}
                onChange={(e) => {
                    setApiKey(e.target.value);
                    setSaved(false);
                }}
                required
                fullWidth
            />

            <Button
                type="submit"
                variant="contained"
                disabled={!apiKey || !apiUrl}
            >
                {saved ? "Saved!" : "Save"}
            </Button>
        </Box>
    );
};
