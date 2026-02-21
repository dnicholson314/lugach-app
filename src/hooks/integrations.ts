import { useState, useEffect } from "react";
import { Integrations } from "src/api/integrations";
import { FetchableHookData } from "src/common/models";

export const useIntegrations = (): FetchableHookData<Integrations> => {
    const [integrations, setIntegrations] = useState<Integrations>();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchIntegrations = async () => {
        setLoading(true);
        setError(undefined);

        try {
            const data = await window.api.getIntegrations();
            setIntegrations(data.value);
            setError(data.error);
        } catch (err) {
            setIntegrations(undefined);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntegrations();
    }, []);

    return {
        value: integrations,
        error: error,
        loading: loading,
        fetchData: fetchIntegrations,
    };
};
