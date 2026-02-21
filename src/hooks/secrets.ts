import { useState, useEffect } from "react";
import { CanvasCredentials } from "src/api/canvas/base";
import { FetchableHookData } from "src/common/models";

export const useCanvasCredentials =
    (): FetchableHookData<CanvasCredentials> => {
        const [credentials, setCredentials] = useState<CanvasCredentials>();
        const [error, setError] = useState<string>();
        const [loading, setLoading] = useState<boolean>(false);

        const fetchCredentials = async () => {
            setLoading(true);
            setError(undefined);

            try {
                const data = await window.api.getCanvasCredentials();
                setCredentials(data.value);
                setError(data.error);
            } catch (err) {
                setCredentials(undefined);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchCredentials();
        }, []);

        return {
            value: credentials,
            error: error,
            loading: loading,
            fetchData: fetchCredentials,
        };
    };
