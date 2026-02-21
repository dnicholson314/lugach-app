import {
    Autocomplete,
    AutocompleteRenderInputParams,
    SxProps,
    TextField,
} from "@mui/material";
import { TopHatCourse } from "src/api/top-hat/courses";
import { useTopHatCourses } from "src/hooks/top-hat/courses";

interface TopHatCourseSelectProps {
    onChange?: (course?: TopHatCourse) => void;
    sx?: SxProps;
}

export const TopHatCourseSelect = ({
    onChange,
    sx,
}: TopHatCourseSelectProps) => {
    const { value: courses, loading } = useTopHatCourses();

    return (
        <Autocomplete
            disablePortal
            options={courses}
            sx={sx}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} label="Top Hat course" />
            )}
            getOptionLabel={(option: TopHatCourse) => option.course_name}
            loading={loading}
            onChange={(_, value) => onChange?.(value)}
        />
    );
};
