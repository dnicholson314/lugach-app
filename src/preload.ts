// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { CanvasStudent } from "./hooks/students";
import { CanvasCourse } from "./hooks/courses";

contextBridge.exposeInMainWorld("api", {
    getCanvasCourses: (): Promise<CanvasCourse> =>
        ipcRenderer.invoke("canvas:get-courses"),
    getCanvasStudents: (courseId: number): Promise<CanvasStudent> =>
        ipcRenderer.invoke("canvas:get-students", courseId),
});
