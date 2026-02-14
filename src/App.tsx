import { createRoot } from "react-dom/client";
import React from "react";
import { StudentsGrid } from "./pages/StudentsGrid";

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <StudentsGrid courseId={1} />
    </React.StrictMode>,
);
