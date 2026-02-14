// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { CanvasStudentData } from "./hooks/students";
import { CanvasCourseData } from "./hooks/courses";

contextBridge.exposeInMainWorld("api", {
    getCanvasCourses: (): Promise<CanvasCourseData> =>
        ipcRenderer.invoke("canvas:get-courses"),
    getCanvasStudents: (courseId: number): Promise<CanvasStudentData> =>
        ipcRenderer.invoke("canvas:get-students", courseId),
});
