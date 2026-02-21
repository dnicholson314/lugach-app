import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useView } from "../ViewContext";
import { CanvasCredentialsForm } from "./CanvasCredentialsForm";
import { LibertyCredentialsForm } from "./LibertyCredentialsForm";

export const SettingsPage = () => {
    const { setCurrentView } = useView();

    return (
        <>
            <Button color="inherit" onClick={() => setCurrentView("main")}>
                <ArrowBack />
                <Typography>Back</Typography>
            </Button>
            <Stack gap="25px">
                <Box display="flex" flexDirection="column" gap="10px">
                    <Typography>Canvas settings</Typography>
                    <Divider />
                    <CanvasCredentialsForm />
                </Box>
                <Box display="flex" flexDirection="column" gap="10px">
                    <Typography>Top Hat settings</Typography>
                    <Divider />
                    <LibertyCredentialsForm />
                </Box>
            </Stack>
        </>
    );
};
