import { Alert, LinearProgress } from "@mui/material";
import {
    RichTreeView,
    RichTreeViewProps,
    TreeViewDefaultItemModelProperties,
} from "@mui/x-tree-view";
import { CanvasCourse } from "src/api/canvas/courses";
import { useCanvasCourses } from "src/hooks/canvas/courses";
import { useScope } from "src/hooks/scope";

type CoursesTreeViewProps = {
    onCourseSelect: (courseId: number) => void;
} & Omit<
    RichTreeViewProps<TreeViewDefaultItemModelProperties, false>,
    "items" | "defaultExpandedItems" | "onItemSelectionToggle"
>;

export const CoursesTreeView = ({
    onCourseSelect,
    ...props
}: CoursesTreeViewProps) => {
    const {
        value: courses,
        error: coursesError,
        loading: coursesLoading,
    } = useCanvasCourses();

    const {
        value: scope,
        error: scopeError,
        loading: scopeLoading,
    } = useScope();

    const filteredCourses =
        courses?.filter((course: CanvasCourse): boolean =>
            scope?.canvasCourses.includes(course.id),
        ) ?? [];

    const loading = coursesLoading || scopeLoading;
    const error = coursesError || scopeError;

    const courseTreeItems: TreeViewDefaultItemModelProperties[] = [
        {
            id: "canvas",
            label: "Canvas",
            children: filteredCourses.map(
                (course: CanvasCourse): TreeViewDefaultItemModelProperties => ({
                    id: String(course.id),
                    label: course.name,
                }),
            ),
        },
    ];

    return error ? (
        <Alert severity="error">{error}</Alert>
    ) : loading ? (
        <LinearProgress />
    ) : (
        <RichTreeView
            items={courseTreeItems}
            defaultExpandedItems={["canvas"]}
            onItemSelectionToggle={(
                _,
                itemId: string,
                isSelected: boolean,
            ): void => {
                if (!isSelected || !Number(itemId)) {
                    return;
                }
                onCourseSelect(Number(itemId));
            }}
            {...props}
        />
    );
};
