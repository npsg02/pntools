use crate::modules::sql::{self, ConnectionConfig, QueryResult};

#[tauri::command]
pub async fn execute_sql_query(
    host: String,
    port: u16,
    database: String,
    user: String,
    password: String,
    query: String,
) -> Result<QueryResult, String> {
    let config = ConnectionConfig {
        host,
        port,
        database,
        user,
        password,
    };

    match sql::connect_and_query(config, query).await {
        Ok(result) => Ok(result),
        Err(e) => Ok(QueryResult {
            columns: Vec::new(),
            rows: Vec::new(),
            row_count: 0,
            error: Some(e.to_string()),
        }),
    }
}

#[tauri::command]
pub fn export_to_csv(result: QueryResult) -> Result<String, String> {
    sql::convert_to_csv(&result)
}

#[tauri::command]
pub fn export_to_json(result: QueryResult) -> Result<String, String> {
    sql::convert_to_json(&result)
}
