import { createRoot } from "react-dom/client";
import React from "react";
import { CoursesGrid } from "src/pages/CoursesGrid";

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
        <CoursesGrid />
    </React.StrictMode>,
);
