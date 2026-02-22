// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, IpcRenderer, ipcRenderer } from "electron";
import { AttendanceOption, EndpointData } from "./common/models";
import { CanvasStudent } from "./api/canvas/students";
import { CanvasCourse } from "./api/canvas/courses";
import { Assignment, Submission } from "./api/canvas/grades";
import { TopHatCourse } from "./api/top-hat/courses";
import { AttendanceItem, AttendanceRecord } from "./api/top-hat/attendance";
import { TopHatStudent } from "./api/top-hat/students";
import { View } from "./pages/ViewContext";
import { CanvasCredentials } from "./api/canvas/base";
import { LibertyCredentials } from "./api/top-hat/base";
import { Integrations } from "./api/integrations";

contextBridge.exposeInMainWorld("api", {
    onUpdateView: (handleUpdateView: (view: View) => void): IpcRenderer =>
        ipcRenderer.on("update-view", (_event, view: View) => {
            handleUpdateView(view);
        }),

    getCanvasCredentials: (): Promise<EndpointData<CanvasCredentials>> =>
        ipcRenderer.invoke("canvas:get-credentials"),

    saveCanvasCredentials: (
        nextCredentials: CanvasCredentials,
    ): Promise<string | undefined> =>
        ipcRenderer.invoke("canvas:save-credentials", nextCredentials),

    getCanvasCourses: (): Promise<EndpointData<CanvasCourse[]>> =>
        ipcRenderer.invoke("canvas:get-courses"),

    getCanvasStudents: (
        courseId: number,
    ): Promise<EndpointData<CanvasStudent[]>> =>
        ipcRenderer.invoke("canvas:get-students", courseId),

    getAssignments: (courseId: number): Promise<EndpointData<Assignment[]>> =>
        ipcRenderer.invoke("canvas:get-assignments", courseId),

    getSubmission: (
        courseId: number,
        assignmentId: number,
        studentId: number,
    ): Promise<EndpointData<Submission>> =>
        ipcRenderer.invoke(
            "canvas:get-submission",
            courseId,
            assignmentId,
            studentId,
        ),

    getLibertyCredentials: (): Promise<EndpointData<LibertyCredentials>> =>
        ipcRenderer.invoke("liberty:get-credentials"),

    saveLibertyCredentials: (
        nextCredentials: LibertyCredentials,
    ): Promise<string | undefined> =>
        ipcRenderer.invoke("liberty:save-credentials", nextCredentials),

    getTopHatCourses: (): Promise<EndpointData<TopHatCourse[]>> =>
        ipcRenderer.invoke("top-hat:get-courses"),

    getTopHatStudents: (
        courseId: number,
    ): Promise<EndpointData<TopHatStudent[]>> =>
        ipcRenderer.invoke("top-hat:get-students", courseId),

    getAttendanceItems: (
        courseId: number,
    ): Promise<EndpointData<AttendanceItem[]>> =>
        ipcRenderer.invoke("top-hat:get-attendance-items", courseId),

    getAttendanceRecords: (
        courseId: number,
        studentId: number,
    ): Promise<EndpointData<AttendanceRecord[]>> =>
        ipcRenderer.invoke(
            "top-hat:get-attendance-records",
            courseId,
            studentId,
        ),

    editAttendance: (
        courseId: number,
        studentId: number,
        attendanceItemId: string,
        newAttendance: AttendanceOption,
    ): Promise<EndpointData<undefined>> =>
        ipcRenderer.invoke(
            "top-hat:edit-attendance",
            courseId,
            studentId,
            attendanceItemId,
            newAttendance,
        ),

    getIntegrations: (): Promise<EndpointData<Integrations>> =>
        ipcRenderer.invoke("integrations:get-integrations"),

    saveIntegration: (
        canvasCourseId: number,
        topHatCourseId: number | undefined,
    ): Promise<string | undefined> =>
        ipcRenderer.invoke(
            "integrations:save-integration",
            canvasCourseId,
            topHatCourseId,
        ),
});
