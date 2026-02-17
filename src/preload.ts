// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { EndpointData } from "./common/models";
import { CanvasStudent } from "./api/canvas/students";
import { CanvasCourse } from "./api/canvas/courses";
import { Assignment } from "./api/canvas/grades";
import { TopHatCourse } from "./api/top-hat/courses";
import { AttendanceItem, AttendanceRecord } from "./api/top-hat/attendance";

contextBridge.exposeInMainWorld("api", {
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
    ) =>
        ipcRenderer.invoke(
            "canvas:get-submission",
            courseId,
            assignmentId,
            studentId,
        ),
    getTopHatCourses: (): Promise<EndpointData<TopHatCourse[]>> =>
        ipcRenderer.invoke("top-hat:get-courses"),
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
});
