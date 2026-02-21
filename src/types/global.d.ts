import { CanvasCourse } from "src/api/canvas/courses";
import { EndpointData } from "src/common/models";
import { Assignment } from "src/api/canvas/grades";
import { CanvasStudent } from "src/hooks/students";
import { TopHatCourse } from "src/api/top-hat/courses";
import { IpcRenderer } from "electron";
import { CanvasCredentials } from "src/api/canvas/base";

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
        };
    }
}
