import { useEffect, useState } from "react";
import { Scope } from "src/api/scope";
import { FetchableHookData } from "src/common/models";

export const useScope = (): FetchableHookData<Scope> => {
    const [scope, setScope] = useState<Scope>();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchScope = async () => {
        setLoading(true);
        setError(undefined);

        try {
            const data = await window.api.getScope();
            setScope(data.value);
            setError(data.error);
        } catch (err) {
            setScope(undefined);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScope();
    }, []);

    return {
        value: scope,
        error: error,
        loading: loading,
        fetchData: fetchScope,
    };
};
