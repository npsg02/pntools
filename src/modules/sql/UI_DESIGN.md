# SQL Playground UI Structure

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ SQL Playground                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Connection Form (Inline):                                  │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Host: [localhost] Port: [5432] Database: [postgres]   │ │
│ │ User: [postgres] Password: [••••••••]                 │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│ SQL Query:                                                  │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ SELECT 1 as test;                                      │ │
│ │                                                         │ │
│ │                                                         │ │
│ │                                                         │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│ [▶ Execute Query] [⬇ Export CSV] [⬇ Export JSON]          │
│                                                             │
│ Results:                                                    │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ ┌──────┬──────┬──────┬──────┐                         │ │
│ │ │ col1 │ col2 │ col3 │ col4 │                         │ │
│ │ ├──────┼──────┼──────┼──────┤                         │ │
│ │ │ val1 │ val2 │ val3 │ val4 │                         │ │
│ │ │ ...  │ ...  │ ...  │ ...  │                         │ │
│ │ └──────┴──────┴──────┴──────┘                         │ │
│ │                                      [< 1 2 3 4 5 >]   │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Page Header
- Title: "SQL Playground"
- Font: 2xl, bold
- Spacing: 3 units

### 2. Connection Form
- Layout: Inline form (horizontal)
- Fields:
  - **Host**: Text input, default "localhost"
  - **Port**: Number input, range 1-65535, default 5432
  - **Database**: Text input, default "postgres"
  - **User**: Text input, default "postgres"
  - **Password**: Password input (masked), required
- All fields required with validation
- Configuration saved to localStorage

### 3. Query Input
- Label: "SQL Query:" (font-semibold)
- Component: TextArea
- Rows: 6
- Font: Monospace
- Placeholder: "Enter your SQL query here..."
- Default value: "SELECT 1 as test;"

### 4. Action Buttons
- **Execute Query**
  - Type: Primary
  - Icon: PlayCircleOutlined
  - Shows loading spinner during execution
  - Triggers query execution

- **Export CSV**
  - Icon: DownloadOutlined
  - Disabled when no valid results
  - Opens file save dialog
  - Saves results as CSV

- **Export JSON**
  - Icon: DownloadOutlined
  - Disabled when no valid results
  - Opens file save dialog
  - Saves results as JSON

### 5. Results Table
- Component: Ant Design Table
- Features:
  - Dynamic columns based on query results
  - Pagination: 20 rows per page
  - Scrollable: Horizontal and vertical
  - Size: Small (compact)
  - Responsive design
- Shows only when query succeeds

### 6. Error Display
- Background: Red-50
- Text color: Red-600
- Rounded corners
- Padding: 4 units
- Shows:
  - "Error:" label (font-semibold)
  - Error message from backend
- Appears only when query fails

### 7. Notifications (Toasts)
- Success: Green notification
  - "Query executed successfully. X rows returned."
- Error: Red notification
  - "Error: [error message]"
  - "Error executing query: [details]"
- Warning: Orange notification
  - "No valid result to export"

## User Flow

### First-Time Connection
1. User opens SQL Playground page
2. Default values populated in connection form
3. User modifies connection details (especially password)
4. User enters SQL query
5. Clicks "Execute Query"
6. Results appear in table below

### Subsequent Uses
1. Connection details remembered from localStorage
2. User only needs to enter/modify query
3. Can export previous results before running new query

### Export Workflow
1. After successful query execution
2. Export buttons become enabled
3. Click desired export format (CSV or JSON)
4. File save dialog appears
5. Choose location and filename
6. File saved with success notification

## Responsive Behavior
- Form fields wrap on smaller screens
- Table scrolls horizontally for many columns
- Table height adjusts to viewport
- Buttons stack on mobile devices
- All elements properly spaced

## Accessibility
- All form fields have labels
- Required fields marked
- Password input properly masked
- Buttons have descriptive text and icons
- Table supports keyboard navigation
- Error messages clearly visible
- Loading states indicated

## Color Scheme
- Follows Ant Design defaults
- Primary color for main action button
- Red for errors
- Gray backgrounds for inputs
- White for content areas
