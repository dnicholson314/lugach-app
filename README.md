# LUGACH (Liberty University GA Canvas Helps)

LUGACH is an [Electron](https://www.electronjs.org/) application that makes
Liberty GAs lives easier.

See [the CLI/TUI version of LUGACH](https://github.com/dnicholson314/lugach)
that spawned the idea for this application.

## To-dos

- ~~**Add encryption for secrets**~~
- ~~**Add settings page**~~
- ~~**Add manual linking of Top Hat courses to Canvas courses**~~
- Add attendance editing
- Add grade and due date editing
- Port over applications from TUI
  - Flag Absent Students (--> `identify_absent_students`)
  - ~~Flag Quiz Concerns~~ (--> `identify_quiz_concerns`)
    - Handled by color-coding late assignments
  - ~~Modify Due Dates~~ (--> `modify_due_dates`)
    - Handled in `StudentGradesTable`
  - Apply Time Extensions (--> `modify_time_limits`)
  - ~~Search Student by Name~~ (--> `search_student_by_name`)
    - Handled in `StudentsDataGrid`
  - ~~Modify Attendance~~ (--> `modify_attendance`)
    - Handled in `StudentAttendanceTable`
  - Take Attendance (--> `take_attendance`)
  - ~~Get Grades~~ (--> `get_grades`)
    - Handled in `StudentGradesTable`
- Add dark mode
- Add copy and paste shortcuts
- Tweak styles of app
- Put all app styles in separate files
- Clean up and organize main process API code
- Add letter grades to grades table
- Color-code late assignments
- Review formatting standards for Prettier Markdown
- Add error boundaries around components
- Add setup wizard
