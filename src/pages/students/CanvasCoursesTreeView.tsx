import { Alert, LinearProgress } from "@mui/material";
import {
    RichTreeView,
    TreeViewDefaultItemModelProperties,
} from "@mui/x-tree-view";
import { CanvasCourse } from "src/api/canvas/courses";
import { useCanvasCourses } from "src/hooks/canvas/courses";

interface CoursesTreeViewProps {
    onCourseSelect: (courseId: number) => void;
}

export const CoursesTreeView = ({ onCourseSelect }: CoursesTreeViewProps) => {
    const {
        value: courses,
        error: coursesError,
        loading: coursesLoading,
    } = useCanvasCourses();

    const courseTreeItems = [
        {
            id: "canvas",
            label: "Canvas",
            children: courses.map(
                (course: CanvasCourse): TreeViewDefaultItemModelProperties => ({
                    id: String(course.id),
                    label: course.name,
                }),
            ),
        },
    ];

    return (
        <>
            {coursesError ? (
                <Alert severity="error">{coursesError}</Alert>
            ) : coursesLoading ? (
                <LinearProgress />
            ) : (
                <RichTreeView
                    items={courseTreeItems}
                    defaultExpandedItems={["canvas"]}
                    onItemSelectionToggle={(
                        _,
                        itemId: string,
                        isSelected: boolean,
                    ) => {
                        if (!isSelected || !Number(itemId)) {
                            return;
                        }
                        onCourseSelect(Number(itemId));
                    }}
                />
            )}
        </>
    );
};
