import {
    Autocomplete,
    AutocompleteRenderInputParams,
    TextField,
} from "@mui/material";
import { CanvasCourse, useCanvasCourses } from "src/hooks/courses";

interface CourseSelectProps {
    onChange(course?: CanvasCourse): void;
}

export const CourseSelect = ({ onChange }: CourseSelectProps) => {
    const { data: courses, loading } = useCanvasCourses();

    return (
        <Autocomplete
            disablePortal
            options={courses}
            sx={{ width: 300 }}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} label="Course" />
            )}
            getOptionLabel={(option: CanvasCourse) => option.name}
            loading={loading}
            onChange={(_, value) => onChange(value)}
        />
    );
};
