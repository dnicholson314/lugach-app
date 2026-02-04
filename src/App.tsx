import React from "react";
import { createRoot } from "react-dom/client";
import Button from "@mui/material/Button";

const root = createRoot(document.body);
root.render(<Button variant="contained">Hello</Button>);
