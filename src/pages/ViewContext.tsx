import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";

export type View = "main" | "settings";

interface ViewContextType {
    currentView: View;
    setCurrentView: (view: View) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider = ({ children }: PropsWithChildren) => {
    const [currentView, setCurrentView] = useState<View>("main");

    useEffect(() => {
        window.api.onUpdateView(setCurrentView);
    }, []);

    return (
        <ViewContext value={{ currentView, setCurrentView }}>
            {children}
        </ViewContext>
    );
};

export const useView = () => {
    const context = useContext(ViewContext);
    if (!context) throw new Error("useView must be used within a ViewProvider");
    return context;
};
