import { StudentsPage } from "src/pages/students/StudentsPage";
import { useView, ViewProvider } from "./pages/ViewContext";
import { SettingsPage } from "./pages/settings/SettingsPage";

export const AppRouter = () => {
    const { currentView } = useView();

    switch (currentView) {
        case "settings":
            return <SettingsPage />;
        default:
            return <StudentsPage />;
    }
};

export const App = () => (
    <ViewProvider>
        <AppRouter />
    </ViewProvider>
);
