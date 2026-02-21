import {
    Autocomplete,
    AutocompleteRenderInputParams,
    SxProps,
    TextField,
} from "@mui/material";
import { CanvasCourse } from "src/api/canvas/courses";
import { useCanvasCourses } from "src/hooks/canvas/courses";

interface CourseSelectProps {
    onChange?: (course?: CanvasCourse) => void;
    sx?: SxProps;
}

export const CanvasCourseSelect = ({ onChange, sx }: CourseSelectProps) => {
    const { value: courses, loading } = useCanvasCourses();

    return (
        <Autocomplete
            disablePortal
            options={courses}
            sx={sx}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} label="Canvas course" />
            )}
            getOptionLabel={(option: CanvasCourse) => option.name}
            loading={loading}
            onChange={(_, value) => onChange?.(value)}
        />
    );
};
