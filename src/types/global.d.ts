import { CanvasCourse } from "src/api/canvas/courses";
import { EndpointData } from "src/common/models";
import { Assignment, Score } from "src/api/canvas/grades";
import { CanvasStudent } from "src/hooks/canvas/students";
import { TopHatCourse } from "src/api/top-hat/courses";
import { IpcRenderer } from "electron";
import { CanvasCredentials } from "src/api/canvas/base";
import { Integrations } from "src/api/integrations";
import { AttendanceOption } from "src/api/top-hat/attendance";

declare global {
    interface Window {
        api: {
            onUpdateView: (
                handleUpdateView: (view: View) => void,
            ) => IpcRenderer;

            getCanvasCredentials: () => Promise<
                EndpointData<CanvasCredentials>
            >;

            saveCanvasCredentials: (
                nextCredentials: CanvasCredentials,
            ) => Promise<string | undefined>;

            getCanvasCourses: () => Promise<EndpointData<CanvasCourse[]>>;

            getCanvasStudents: (
                courseId: number,
            ) => Promise<EndpointData<CanvasStudent[]>>;

            getAssignments: (
                courseId: number,
            ) => Promise<EndpointData<Assignment[]>>;

            getSubmission: (
                courseId: number,
                assignmentId: number,
                studentId: number,
            ) => Promise<EndpointData<Submission>>;

            gradeSubmission: (
                courseId: number,
                assignmentId: number,
                studentId: number,
                score: Score,
            ) => Promise<EndpointData<undefined>>;

            editAssignmentDueDate: (
                courseId: number,
                assignmentId: number,
                studentId: number,
                dates: {
                    dueAt: Date;
                    lockAt?: Date;
                },
            ) => Promise<EndpointData<undefined>>;

            getLibertyCredentials: () => Promise<
                EndpointData<LibertyCredentials>
            >;

            saveLibertyCredentials: (
                nextCredentials: LibertyCredentials,
            ) => Promise<string | undefined>;

            getTopHatCourses: () => Promise<EndpointData<TopHatCourse[]>>;

            getTopHatStudents: (
                courseId: number,
            ) => Promise<EndpointData<TopHatStudent[]>>;

            getAttendanceItems: (
                courseId: number,
            ) => Promise<EndpointData<AttendanceItem[]>>;

            getAttendanceRecords: (
                courseId: number,
                studentId: number,
            ) => Promise<EndpointData<AttendanceRecord[]>>;

            editAttendance: (
                courseId: number,
                studentId: number,
                attendanceItemId: string,
                newAttendance: AttendanceOption,
            ) => Promise<EndpointData<undefined>>;

            getIntegrations: () => Promise<EndpointData<Integrations>>;

            saveIntegration: (
                canvasCourseId: number,
                topHatCourseId: number | undefined,
            ) => Promise<string | undefined>;
        };
    }
}
