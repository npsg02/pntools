use serde::{Deserialize, Serialize};
use tokio_postgres::{Error, NoTls, Row};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QueryResult {
    pub columns: Vec<String>,
    pub rows: Vec<Vec<String>>,
    pub row_count: usize,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectionConfig {
    pub host: String,
    pub port: u16,
    pub database: String,
    pub user: String,
    pub password: String,
}

pub async fn connect_and_query(
    config: ConnectionConfig,
    query: String,
) -> Result<QueryResult, Error> {
    let connection_string = format!(
        "host={} port={} dbname={} user={} password={}",
        config.host, config.port, config.database, config.user, config.password
    );

    let (client, connection) = tokio_postgres::connect(&connection_string, NoTls).await?;

    // Spawn the connection handler
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    let rows = client.query(&query, &[]).await?;

    let columns: Vec<String> = if !rows.is_empty() {
        rows[0]
            .columns()
            .iter()
            .map(|col| col.name().to_string())
            .collect()
    } else {
        Vec::new()
    };

    let row_data: Vec<Vec<String>> = rows
        .iter()
        .map(|row| {
            (0..row.len())
                .map(|i| {
                    row.try_get::<_, String>(i)
                        .or_else(|_| row.try_get::<_, i32>(i).map(|v| v.to_string()))
                        .or_else(|_| row.try_get::<_, i64>(i).map(|v| v.to_string()))
                        .or_else(|_| row.try_get::<_, f64>(i).map(|v| v.to_string()))
                        .or_else(|_| row.try_get::<_, bool>(i).map(|v| v.to_string()))
                        .unwrap_or_else(|_| "NULL".to_string())
                })
                .collect()
        })
        .collect();

    let row_count = row_data.len();

    Ok(QueryResult {
        columns,
        rows: row_data,
        row_count,
        error: None,
    })
}

pub fn convert_to_csv(result: &QueryResult) -> Result<String, String> {
    let mut wtr = csv::Writer::from_writer(vec![]);

    // Write headers
    wtr.write_record(&result.columns)
        .map_err(|e| e.to_string())?;

    // Write rows
    for row in &result.rows {
        wtr.write_record(row).map_err(|e| e.to_string())?;
    }

    wtr.flush().map_err(|e| e.to_string())?;
    let data = wtr.into_inner().map_err(|e| e.to_string())?;
    String::from_utf8(data).map_err(|e| e.to_string())
}

pub fn convert_to_json(result: &QueryResult) -> Result<String, String> {
    serde_json::to_string_pretty(result).map_err(|e| e.to_string())
}
