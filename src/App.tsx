import { createRoot } from "react-dom/client";
import React from "react";
import { StudentsPage } from "src/pages/students/StudentsPage";

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <StudentsPage />
    </React.StrictMode>,
);
