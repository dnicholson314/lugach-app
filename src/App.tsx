import React, { useCallback, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Course {
    id: number;
    name: string;
    course_code: string;
}

interface Student {
    /** Human-readable course label, joined in from the courses list. */
    id: number;
    name: string;
    email: string;
    sis_user_id: string | null;
    course_id: number;
}

interface StudentRow {
    /** Unique row key for DataGrid (course_id + user_id to handle cross-course duplicates). */
    rowId: string;
    id: number;
    name: string;
    email: string;
    sis_user_id: string | null;
    course_id: number;
    course_name: string;
}

// ── Column definitions ────────────────────────────────────────────────────────

const STUDENT_COLUMNS: GridColDef<StudentRow>[] = [
    { field: "name", headerName: "Name", flex: 1.5, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 2, minWidth: 180 },
    { field: "sis_user_id", headerName: "SIS User ID", flex: 1, minWidth: 120 },
    { field: "course_name", headerName: "Course", flex: 2, minWidth: 160 },
];

// ── App ───────────────────────────────────────────────────────────────────────

export const App = (): React.JSX.Element => {
    // Settings
    const [apiKey, setApiKey] = useState("");
    const [apiUrl, setApiUrl] = useState("");
    const [saved, setSaved] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState(true);

    // Courses
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<
        number | undefined
    >();
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [coursesError, setCoursesError] = useState<string | null>(null);

    // Students
    const [allStudents, setAllStudents] = useState<StudentRow[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [studentsError, setStudentsError] = useState<string | null>(null);

    // ── On mount: load stored credentials ──────────────────────────────────────

    useEffect(() => {
        Promise.all([
            invoke<string | null>("get_api_key"),
            invoke<string | null>("get_api_url"),
        ]).then(([storedKey, storedUrl]) => {
            if (storedKey) setApiKey(storedKey);
            if (storedUrl) setApiUrl(storedUrl);
            setSettingsLoading(false);
        });
    }, []);

    // ── Fetch courses ───────────────────────────────────────────────────────────

    const fetchCourses = useCallback(async (): Promise<Course[]> => {
        setCoursesLoading(true);
        setCoursesError(null);
        try {
            const result: Course[] = await invoke<Course[]>("get_courses");
            setCourses(result);

            // Clear selection if it no longer exists.
            setSelectedCourseId(
                (previous: number | undefined): number | undefined =>
                    result.find((course) => course.id === previous)?.id,
            );

            return result;
        } catch (err) {
            setCoursesError(
                typeof err === "string" ? err : "Failed to load courses.",
            );
            return [];
        } finally {
            setCoursesLoading(false);
        }
    }, []);

    // ── Fetch students for all courses in parallel ──────────────────────────────

    const fetchAllStudents = useCallback(async (courseList: Course[]) => {
        if (courseList.length === 0) return;
        setStudentsLoading(true);
        setStudentsError(null);
        try {
            const results = await Promise.all(
                courseList.map((course: Course) =>
                    invoke<Student[]>("get_students", {
                        courseId: course.id,
                    }).then((students: Student[]) =>
                        students.map((student): StudentRow => ({
                            ...student,
                            rowId: `${student.course_id}-${student.id}`,
                            course_name: `${course.course_code} – ${course.name}`,
                        })),
                    ),
                ),
            );
            setAllStudents(results.flat());
        } catch (err) {
            setStudentsError(
                typeof err === "string" ? err : "Failed to load students.",
            );
        } finally {
            setStudentsLoading(false);
        }
    }, []);

    // ── Bootstrap: fetch courses + students once credentials are loaded ─────────

    useEffect(() => {
        if (!settingsLoading && apiKey && apiUrl) {
            fetchCourses().then((loadedCourses) =>
                fetchAllStudents(loadedCourses),
            );
        }
        // eslint-disable-next-line @eslint-react/exhaustive-deps
    }, [settingsLoading]);

    // ── Settings form submit ────────────────────────────────────────────────────

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        await Promise.all([
            invoke("save_api_key", { apiKey }),
            invoke("save_api_url", { apiUrl }),
        ]);
        setSaved(true);
        // Re-fetch everything with the new credentials.
        const loadedCourses = await fetchCourses();
        await fetchAllStudents(loadedCourses);
    };

    // ── Refresh handler ─────────────────────────────────────────────────────────

    const handleRefresh = async () => {
        const loadedCourses = await fetchCourses();
        await fetchAllStudents(loadedCourses);
    };

    // ── Filter students by selected course (client-side) ───────────────────────

    const visibleStudents = useMemo(
        () =>
            selectedCourseId === undefined
                ? allStudents
                : allStudents.filter((s) => s.course_id === selectedCourseId),
        [allStudents, selectedCourseId],
    );

    // ── Render ──────────────────────────────────────────────────────────────────

    if (settingsLoading) return <CircularProgress sx={{ m: 3 }} />;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
            {/* ── Settings ──────────────────────────────────────────────────────── */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <Typography variant="h6">Canvas Settings</Typography>

                <TextField
                    label="Canvas URL"
                    type="url"
                    placeholder="https://canvas.instructure.com"
                    value={apiUrl}
                    onChange={(e) => {
                        setApiUrl(e.target.value);
                        setSaved(false);
                    }}
                    required
                    fullWidth
                />

                <TextField
                    label="API Key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => {
                        setApiKey(e.target.value);
                        setSaved(false);
                    }}
                    required
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={!apiKey || !apiUrl}
                >
                    {saved ? "Saved!" : "Save"}
                </Button>
            </Box>

            <Divider />

            {/* ── Courses dropdown ───────────────────────────────────────────────── */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="h6">Designer Courses</Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleRefresh}
                        disabled={
                            coursesLoading ||
                            studentsLoading ||
                            !apiKey ||
                            !apiUrl
                        }
                    >
                        {coursesLoading || studentsLoading ? (
                            <CircularProgress size={16} />
                        ) : (
                            "Refresh"
                        )}
                    </Button>
                </Box>

                {coursesError && (
                    <Typography color="error" variant="body2">
                        {coursesError}
                    </Typography>
                )}

                <FormControl fullWidth disabled={courses.length === 0}>
                    <InputLabel id="course-filter-label">
                        {courses.length === 0
                            ? "No courses found"
                            : "Filter by course"}
                    </InputLabel>
                    <Select
                        labelId="course-filter-label"
                        value={selectedCourseId}
                        label={
                            courses.length === 0
                                ? "No courses found"
                                : "Filter by course"
                        }
                        onChange={(e) =>
                            setSelectedCourseId(
                                (e.target.value as number) || undefined,
                            )
                        }
                    >
                        <MenuItem value="">
                            <em>All courses</em>
                        </MenuItem>
                        {courses.map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                                {course.course_code} – {course.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Divider />

            {/* ── Students DataGrid ──────────────────────────────────────────────── */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h6">
                    Students
                    {selectedCourseId !== undefined && courses.length > 0
                        ? ` — ${courses.find((c) => c.id === selectedCourseId)?.course_code ?? ""}`
                        : " — All Courses"}
                </Typography>

                {studentsError && (
                    <Typography color="error" variant="body2">
                        {studentsError}
                    </Typography>
                )}

                <Box sx={{ height: 500 }}>
                    <DataGrid<StudentRow>
                        rows={visibleStudents}
                        columns={STUDENT_COLUMNS}
                        getRowId={(row) => row.rowId}
                        loading={studentsLoading}
                        disableColumnFilter
                        disableColumnMenu
                        disableColumnSelector
                        showToolbar
                        slotProps={{
                            toolbar: {
                                csvOptions: {
                                    disableToolbarButton: true,
                                },
                                printOptions: {
                                    disableToolbarButton: true,
                                },
                                showQuickFilter: true,
                            },
                        }}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default App;
