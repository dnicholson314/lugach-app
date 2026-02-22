import os from "os";
import path from "path";

export const ROOT_DIR = path.join(os.homedir(), ".lugach", "app");

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
