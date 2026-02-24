# LUGACH (Liberty University GA Canvas Helps)

LUGACH is an [Electron](https://www.electronjs.org/) application that makes
Liberty GAs lives easier.

See [the CLI/TUI version of LUGACH](https://github.com/dnicholson314/lugach)
that spawned the idea for this application.

## Upcoming functionality

### Flagship features

- Add setting to filter out Canvas courses
- Add due date editing to `StudentAttendanceTable`
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
- ~~**Add encryption for secrets**~~
- ~~**Add settings page**~~
- ~~**Add manual linking of Top Hat courses to Canvas courses**~~
- ~~Add attendance editing~~
- ~~Add grade editing~~

### QoL features

- Add option to see all students in one view
- Add letter grades to grades table
- Add error boundaries around components
- Add setup wizard
- Color-code late assignments
- Add copy and paste shortcuts

### CSS changes

- Add dark mode
- Tweak styles of app
- Put all app styles in separate files

### Code cleanup and bug fixes

- Clean up and organize main process API code
- Review general formatting standards for Prettier
- Review linting standards for ESLint
- Optimize hooks so that they don't call the API for undefined values
- Fix where `AttendanceEditPopover` changes the default value of its `RadioGroup`
- Add verifying scopes for API calls
- ~~Review formatting standards for Prettier Markdown~~
