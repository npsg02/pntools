import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, message } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, ReloadOutlined, HomeOutlined, CloseOutlined } from '@ant-design/icons';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

const TauriBrowser = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [isOpen, setIsOpen] = useState(false);
  const webviewRef = useRef<WebviewWindow | null>(null);
  const webviewCounterRef = useRef(0);

  const createWebview = async (targetUrl: string) => {
    try {
      // Close existing webview if open
      if (webviewRef.current) {
        await webviewRef.current.close();
        webviewRef.current = null;
      }

      // Create unique label for the webview
      const label = `browser-window-${webviewCounterRef.current++}`;
      
      // Create new webview window
      const webview = new WebviewWindow(label, {
        url: targetUrl,
        title: 'Browser',
        width: 1200,
        height: 800,
      });

      // Wait for webview to be ready
      await webview.once('tauri://created', () => {
        console.log('Webview created successfully');
      });

      await webview.once('tauri://error', (e) => {
        console.error('Error creating webview:', e);
        message.error('Failed to open browser window');
      });

      webviewRef.current = webview;
      setIsOpen(true);
      message.success('Browser window opened');
    } catch (error) {
      console.error('Error creating webview:', error);
      message.error('Failed to create browser window');
    }
  };

  const handleNavigate = () => {
    if (!url) {
      message.warning('Please enter a URL');
      return;
    }
    
    // Ensure URL has protocol
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = 'https://' + url;
    }
    
    createWebview(fullUrl);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  const handleHome = () => {
    const homeUrl = 'https://www.google.com';
    setUrl(homeUrl);
    createWebview(homeUrl);
  };

  const handleRefresh = async () => {
    if (webviewRef.current) {
      try {
        // Recreate the webview with the same URL to refresh
        const urlToRefresh = url;
        await webviewRef.current.close();
        webviewRef.current = null;
        await createWebview(urlToRefresh);
      } catch (error) {
        console.error('Error refreshing webview:', error);
        message.error('Failed to refresh browser window');
      }
    } else {
      message.info('No browser window is currently open');
    }
  };

  const handleClose = async () => {
    if (webviewRef.current) {
      try {
        await webviewRef.current.close();
        webviewRef.current = null;
        setIsOpen(false);
        message.success('Browser window closed');
      } catch (error) {
        console.error('Error closing webview:', error);
        message.error('Failed to close browser window');
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (webviewRef.current) {
        webviewRef.current.close().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-4">
        <h1 className="text-2xl font-bold">Web Browser</h1>
        <p className="text-gray-600">
          Enter a URL below to open a browser window. The browser runs in a separate Tauri webview window
          without iframe restrictions.
        </p>
        
        <div className="flex items-center space-x-2 rounded-lg border bg-white p-4 shadow">
          <Button 
            icon={<ArrowLeftOutlined />} 
            disabled 
            title="Back (not yet implemented)"
          />
          <Button 
            icon={<ArrowRightOutlined />} 
            disabled 
            title="Forward (not yet implemented)"
          />
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            disabled={!isOpen}
            title="Refresh current page"
          />
          <Button 
            icon={<HomeOutlined />} 
            onClick={handleHome}
            title="Go to home page"
          />
          <Input
            placeholder="Enter URL (e.g., google.com or https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            size="large"
          />
          <Button 
            type="primary" 
            onClick={handleNavigate}
            size="large"
          >
            Go
          </Button>
          {isOpen && (
            <Button 
              danger
              icon={<CloseOutlined />} 
              onClick={handleClose}
              title="Close browser window"
            >
              Close
            </Button>
          )}
        </div>

        <div className="rounded-lg border bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold">Status</h3>
          <p className={isOpen ? 'text-green-600' : 'text-gray-500'}>
            Browser window: {isOpen ? 'Open' : 'Closed'}
          </p>
          {isOpen && (
            <p className="mt-1 text-sm text-gray-600">
              Current URL: {url}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold text-blue-800">Features</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-blue-700">
            <li>Opens websites in a separate Tauri webview window</li>
            <li>No iframe restrictions - works with any website</li>
            <li>Full browser functionality with proper rendering</li>
            <li>Automatic URL protocol handling (adds https:// if needed)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TauriBrowser;
