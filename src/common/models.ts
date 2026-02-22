export type EndpointData<E> = {
    value: E;
    error?: string;
};

export type HookData<E> = EndpointData<E> & {
    loading: boolean;
};

export type FetchableHookData<E> = HookData<E> & {
    fetchData: () => Promise<void>;
};

export type AttendanceOption = "present" | "absent" | "excused";
