import {
    Autocomplete,
    AutocompleteProps,
    AutocompleteRenderInputParams,
    TextField,
} from "@mui/material";
import { CanvasCourse } from "src/api/canvas/courses";
import { useCanvasCourses } from "src/hooks/canvas/courses";

export const CanvasCourseSelect = <
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false,
>(
    props: Omit<
        AutocompleteProps<CanvasCourse, Multiple, DisableClearable, FreeSolo>,
        "options" | "renderInput" | "loading" | "getOptionLabel"
    >,
) => {
    const { value: courses, loading } = useCanvasCourses();

    return (
        <Autocomplete
            options={courses}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} label="Canvas course" />
            )}
            getOptionLabel={(option: CanvasCourse) => option.name}
            loading={loading}
            {...props}
        />
    );
};
