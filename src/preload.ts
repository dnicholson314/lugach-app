// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { EndpointData } from "./common/models";
import { CanvasStudent } from "./api/students";
import { CanvasCourse } from "./api/courses";
import { Assignment } from "./api/grades";

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
});
