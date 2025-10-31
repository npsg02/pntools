# SQL Playground Module

## Overview
The SQL Playground is a module that allows you to connect to a PostgreSQL database, execute SQL queries, and export results to JSON or CSV formats.

## Features
- Connect to PostgreSQL databases
- Execute SQL queries
- View results in a table format
- Export results to CSV
- Export results to JSON
- Save connection configuration for reuse

## Usage

### Connection Configuration
1. Navigate to the SQL Playground page
2. Fill in the connection details:
   - **Host**: PostgreSQL server host (default: localhost)
   - **Port**: PostgreSQL server port (default: 5432)
   - **Database**: Database name (default: postgres)
   - **User**: Database user (default: postgres)
   - **Password**: Database password

### Executing Queries
1. Enter your SQL query in the text area
2. Click "Execute Query" to run the query
3. Results will be displayed in a table below

### Exporting Results
- Click "Export CSV" to save results as a CSV file
- Click "Export JSON" to save results as a JSON file

## Technical Implementation

### Backend (Rust)
The backend is implemented using:
- `tokio-postgres`: Async PostgreSQL client
- `tokio`: Async runtime
- `csv`: CSV serialization
- `serde_json`: JSON serialization

Key files:
- `src-tauri/src/modules/sql/mod.rs`: Core SQL module with connection and query logic
- `src-tauri/src/commands/sql.rs`: Tauri commands exposed to frontend

### Frontend (React)
The frontend is built with:
- React + TypeScript
- Ant Design components
- Tauri API for file system operations

Key files:
- `src/modules/sql/index.tsx`: Main SQL Playground component

## Dependencies

### Rust Dependencies
```toml
tokio-postgres = "0.7"
tokio = { version = "1", features = ["full"] }
csv = "1.3"
```

### Tauri Commands
- `execute_sql_query`: Execute a SQL query and return results
- `export_to_csv`: Convert query results to CSV format
- `export_to_json`: Convert query results to JSON format

## Error Handling
- Connection errors are displayed in the UI
- Query execution errors are caught and shown to the user
- Export errors are handled gracefully with user notifications
