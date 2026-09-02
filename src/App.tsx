import { Box, Button, CircularProgress, Divider } from "@mui/material";
import { useCourses } from "./canvas/courses";
import { StudentsDataGrid } from "./components/StudentsDataGrid";
import { useStudents } from "./canvas/students";
import { SettingsForm } from "./components/SettingsForm";

export const App = (): React.JSX.Element => {
    const {
        courses,
        loading: coursesLoading,
        error: coursesError,
        refetch: fetchCourses,
    } = useCourses();

    const {
        students,
        loading: studentsLoading,
        error: studentsError,
    } = useStudents(courses);

    const loading = coursesLoading || studentsLoading;
    const error = coursesError ?? studentsError;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
            <SettingsForm
                onSubmit={() => {
                    fetchCourses();
                }}
            />

            <Divider />

            <Box sx={{ display: "flex", alignItems: "right" }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={fetchCourses}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={16} /> : "Refresh"}
                </Button>
            </Box>

            <StudentsDataGrid
                courses={courses}
                students={students}
                loading={loading}
                error={error}
            />
            <Divider />
        </Box>
    );
};

export default App;
