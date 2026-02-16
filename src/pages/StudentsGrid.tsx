import { ArrowDropDown, Grading, InfoOutline } from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Stack,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { CoursesTreeView } from "src/components/CoursesTreeView";
import { StudentGradesTable } from "src/components/StudentGradesTable";
import { StudentInfoTable } from "src/components/StudentInfoTable";
import { StudentsDataGrid } from "src/components/StudentsDataGrid";

export interface StudentsGridProps {
    courseId: number;
}

export const StudentsGrid = () => {
    const [courseId, setCourseId] = useState<number>();
    const [selectedStudentId, setSelectedStudentId] = useState<number>();

    return (
        <>
            <Stack direction="row" height="100vh" width="100vw">
                <Box sx={{ height: "100%", width: "20%" }}>
                    <CoursesTreeView
                        onCourseSelect={(nextCourseId: number) => {
                            setCourseId(nextCourseId);
                            setSelectedStudentId(undefined);
                        }}
                    />
                </Box>
                <Box sx={{ height: "100%", width: "50%" }}>
                    <StudentsDataGrid
                        courseId={courseId}
                        onStudentSelect={(nextStudentId: number) =>
                            setSelectedStudentId(nextStudentId)
                        }
                    />
                </Box>
                <Stack sx={{ width: "30%" }}>
                    {!courseId || !selectedStudentId ? (
                        <Typography>Select a student.</Typography>
                    ) : (
                        <>
                            <Accordion defaultExpanded disableGutters>
                                <AccordionSummary
                                    expandIcon={<ArrowDropDown />}
                                    sx={{
                                        ".MuiAccordionSummary-content": {
                                            gap: "4px",
                                        },
                                    }}
                                >
                                    <InfoOutline />
                                    <Typography>Info</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 0 }}>
                                    <StudentInfoTable
                                        courseId={courseId}
                                        studentId={selectedStudentId}
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion disableGutters>
                                <AccordionSummary
                                    expandIcon={<ArrowDropDown />}
                                    sx={{
                                        ".MuiAccordionSummary-content": {
                                            gap: "4px",
                                        },
                                    }}
                                >
                                    <Grading />
                                    <Typography>Grades</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 0 }}>
                                    <StudentGradesTable
                                        courseId={courseId}
                                        studentId={selectedStudentId}
                                    ></StudentGradesTable>
                                </AccordionDetails>
                            </Accordion>
                        </>
                    )}
                </Stack>
            </Stack>
        </>
    );
};
