import {
    Autocomplete,
    AutocompleteRenderInputParams,
    SxProps,
    TextField,
} from "@mui/material";
import { CanvasCourse, useCanvasCourses } from "src/hooks/courses";

interface CourseSelectProps {
    onChange(course?: CanvasCourse): void;
    sx?: SxProps;
}

export const CourseSelect = ({ onChange, sx }: CourseSelectProps) => {
    const { value: courses, loading } = useCanvasCourses();

    return (
        <Autocomplete
            disablePortal
            options={courses}
            sx={sx}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} label="Course" />
            )}
            getOptionLabel={(option: CanvasCourse) => option.name}
            loading={loading}
            onChange={(_, value) => onChange(value)}
        />
    );
};
