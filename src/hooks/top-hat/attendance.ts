import { useEffect, useState } from "react";
import { AttendanceItem, AttendanceRecord } from "src/api/top-hat/attendance";
import { HookData } from "src/common/models";

interface Attendance {
    id: number;
    date_taken: string;
    attended: boolean;
    excused: boolean;
}

export const useAttendance = (
    courseId: number,
    studentId: number,
): HookData<Attendance[]> => {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchAttendances = async () => {
            setLoading(true);
            setError(undefined);

            try {
                const attendanceItemsData =
                    await window.api.getAttendanceItems(courseId);
                const attendanceRecordsData =
                    await window.api.getAttendanceRecords(courseId, studentId);

                if (attendanceItemsData.error || attendanceRecordsData.error) {
                    const nextError = [
                        attendanceItemsData.error,
                        attendanceRecordsData.error,
                    ].join(" | ");
                    setAttendances([]);
                    setError(nextError);
                    return;
                }

                const nextAttendances: Attendance[] = [];
                attendanceItemsData.value.forEach((item: AttendanceItem) => {
                    const match: AttendanceRecord | undefined =
                        attendanceRecordsData.value.find(
                            (record: AttendanceRecord) =>
                                record.item_id === item.id,
                        );
                    if (!match) {
                        return;
                    }

                    nextAttendances.push({
                        id: match.id,
                        date_taken: item.last_activated_at.slice(0, 10),
                        attended: match.weighted_correctness === 1,
                        excused: match.grade_type === "excused",
                    });
                });

                setAttendances(nextAttendances);
                setError(undefined);
            } catch (err) {
                setAttendances([]);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchAttendances();
    }, [courseId, studentId]);

    return {
        value: attendances,
        error: error,
        loading: loading,
    };
};
