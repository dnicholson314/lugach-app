# LUGACH (Liberty University GA Canvas Helps)

LUGACH is an [Electron](https://www.electronjs.org/) application that makes
Liberty GAs' lives easier.

See [the CLI/TUI version of LUGACH](https://github.com/dnicholson314/lugach)
that spawned the idea for this application.

## User installation

Coming soon... 🔜

## Development

Welcome all contributors! Feel free to open an issue or submit a pull request
if you have issues with the application. For those who would like to contribute
to code, follow these steps.

### Prerequisites

- `git`
- `node` v25 and `npm` v11
  - Other versions probably work, but I haven't tested them.
- A system with GUI-rendering capabilities.
  - If you're using WSL, you need a version that supports
    [WSLg](https://github.com/microsoft/wslg).

### Development installation

Clone the repository into a directory and run the following commands there.

```bash
npm ci
npx playwright install chromium
npm start
```

You should now have a working Electron development environment for LUGACH.

## Upcoming functionality

### Flagship features

- Add setting to filter Canvas courses
- Port over applications from TUI
  - Flag Absent Students (--> `identify_absent_students`)
  - Take Attendance (--> `take_attendance`)
  - Apply Time Extensions (--> `modify_time_limits`)
  - ~~Flag Quiz Concerns~~ (--> `identify_quiz_concerns`)
    - Handled by color-coding late assignments
  - ~~Modify Due Dates~~ (--> `modify_due_dates`)
    - Handled in `StudentGradesTable`
  - ~~Search Student by Name~~ (--> `search_student_by_name`)
    - Handled in `StudentsDataGrid`
  - ~~Modify Attendance~~ (--> `modify_attendance`)
    - Handled in `StudentAttendanceTable`
  - ~~Get Grades~~ (--> `get_grades`)
    - Handled in `StudentGradesTable`
- ~~**Add encryption for secrets**~~
- ~~**Add settings page**~~
- ~~**Add manual linking of Top Hat courses to Canvas courses**~~
- ~~Add attendance editing to `StudentAttendanceTable`~~
- ~~Add grade editing to `StudentGradesTable`~~
- ~~Add due date editing to `StudentGradesTable`~~

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
- Fix `AttendanceEditPopover` changing the default value of its `RadioGroup`
- Add verifying scopes for API calls
- ~~Review formatting standards for Prettier Markdown~~
- Add `@playwright/browser-chromium` to `devDependencies` in `package.json` and
  check that existing Playwright code works without needing to install browsers

> Dedicated to Jorge, Joseph, Elyse, Colton, and all the other GSAs in Liberty
> Theological Seminary. Your labor is not in vain!
