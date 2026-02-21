import { useState, useEffect } from "react";
import { LibertyCredentials } from "src/api/top-hat/base";
import { HookData } from "src/common/models";

export const useLibertyCredentials = (): HookData<LibertyCredentials> => {
    const [credentials, setCredentials] = useState<LibertyCredentials>();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchCredentials = async () => {
        setLoading(true);
        setError(undefined);

        try {
            const data = await window.api.getLibertyCredentials();
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
    };
};
