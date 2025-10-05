import { invoke } from '@tauri-apps/api/core';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { Button, Form, Input, InputNumber, message, Table } from 'antd';
import { useEffect, useState } from 'react';
import { DownloadOutlined, PlayCircleOutlined } from '@ant-design/icons';

interface QueryResult {
  columns: string[];
  rows: string[][];
  row_count: number;
  error?: string;
}

interface ConnectionConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

const SQLPlayground = () => {
  const [form] = Form.useForm();
  const [query, setQuery] = useState('SELECT 1 as test;');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // Load saved connection config from storage
    const savedConfig = localStorage.getItem('sql_connection_config');
    if (savedConfig) {
      form.setFieldsValue(JSON.parse(savedConfig));
    }
  }, []);

  const handleExecuteQuery = async () => {
    const values = await form.validateFields();
    
    // Save connection config
    localStorage.setItem('sql_connection_config', JSON.stringify(values));
    
    setIsLoading(true);
    try {
      const queryResult: QueryResult = await invoke('execute_sql_query', {
        host: values.host,
        port: values.port,
        database: values.database,
        user: values.user,
        password: values.password,
        query,
      });

      if (queryResult.error) {
        messageApi.error(`Error: ${queryResult.error}`);
      } else {
        messageApi.success(`Query executed successfully. ${queryResult.row_count} rows returned.`);
      }
      
      setResult(queryResult);
    } catch (error) {
      messageApi.error(`Error executing query: ${error}`);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!result || result.error) {
      messageApi.warning('No valid result to export');
      return;
    }

    try {
      const csv: string = await invoke('export_to_csv', { result });
      const filePath = await save({
        defaultPath: 'query_result.csv',
        filters: [{ name: 'CSV', extensions: ['csv'] }],
      });

      if (filePath) {
        await writeTextFile(filePath, csv);
        messageApi.success('CSV file saved successfully');
      }
    } catch (error) {
      messageApi.error(`Error exporting CSV: ${error}`);
    }
  };

  const handleExportJSON = async () => {
    if (!result || result.error) {
      messageApi.warning('No valid result to export');
      return;
    }

    try {
      const json: string = await invoke('export_to_json', { result });
      const filePath = await save({
        defaultPath: 'query_result.json',
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });

      if (filePath) {
        await writeTextFile(filePath, json);
        messageApi.success('JSON file saved successfully');
      }
    } catch (error) {
      messageApi.error(`Error exporting JSON: ${error}`);
    }
  };

  const columns = result
    ? result.columns.map((col, index) => ({
        title: col,
        dataIndex: index.toString(),
        key: col,
      }))
    : [];

  const dataSource = result
    ? result.rows.map((row, rowIndex) => {
        const rowData: any = { key: rowIndex };
        row.forEach((cell, cellIndex) => {
          rowData[cellIndex.toString()] = cell;
        });
        return rowData;
      })
    : [];

  return (
    <div className="flex h-full min-h-0 flex-col space-y-3 p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold">SQL Playground</h2>

      <Form
        form={form}
        layout="inline"
        initialValues={{
          host: 'localhost',
          port: 5432,
          database: 'postgres',
          user: 'postgres',
          password: '',
        }}
      >
        <Form.Item name="host" label="Host" rules={[{ required: true }]}>
          <Input placeholder="localhost" />
        </Form.Item>
        <Form.Item name="port" label="Port" rules={[{ required: true }]}>
          <InputNumber placeholder="5432" min={1} max={65535} />
        </Form.Item>
        <Form.Item name="database" label="Database" rules={[{ required: true }]}>
          <Input placeholder="postgres" />
        </Form.Item>
        <Form.Item name="user" label="User" rules={[{ required: true }]}>
          <Input placeholder="postgres" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password placeholder="password" />
        </Form.Item>
      </Form>

      <div className="flex flex-col space-y-2">
        <label className="font-semibold">SQL Query:</label>
        <Input.TextArea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          rows={6}
          className="font-mono"
        />
      </div>

      <div className="flex space-x-2">
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleExecuteQuery}
          loading={isLoading}
        >
          Execute Query
        </Button>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleExportCSV}
          disabled={!result || !!result.error}
        >
          Export CSV
        </Button>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleExportJSON}
          disabled={!result || !!result.error}
        >
          Export JSON
        </Button>
      </div>

      {result && !result.error && (
        <div className="flex-1 overflow-auto">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 20 }}
            scroll={{ x: true, y: 'calc(100vh - 500px)' }}
            size="small"
          />
        </div>
      )}

      {result && result.error && (
        <div className="rounded-md bg-red-50 p-4 text-red-600">
          <p className="font-semibold">Error:</p>
          <p>{result.error}</p>
        </div>
      )}
    </div>
  );
};

export default SQLPlayground;
