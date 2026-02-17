import {
    ArrowDropDown,
    Grading,
    GroupsOutlined,
    InfoOutline,
} from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Stack,
    Typography,
} from "@mui/material";
import { StudentAttendanceTable } from "src/components/StudentAttendanceTable";
import { StudentGradesTable } from "src/components/StudentGradesTable";
import { StudentInfoTable } from "src/components/StudentInfoTable";

interface StudentDetailsStackProps {
    courseId: number;
    studentId: number;
}

export const StudentDetailsStack = ({
    courseId,
    studentId,
}: StudentDetailsStackProps) => {
    return (
        <Stack>
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
                        studentId={studentId}
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
                        studentId={studentId}
                    ></StudentGradesTable>
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
                    <GroupsOutlined />
                    <Typography>Attendance</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                    <StudentAttendanceTable
                        canvasCourseId={courseId}
                        canvasStudentId={studentId}
                    />
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
};
