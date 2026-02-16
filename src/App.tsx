import { createRoot } from "react-dom/client";
import React from "react";
import { StudentsGrid } from "src/pages/StudentsGrid";

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <StudentsGrid />
    </React.StrictMode>,
);
