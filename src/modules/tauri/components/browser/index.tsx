import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';

const TauriBrowser = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');

  const handleNavigate = () => {
    setCurrentUrl(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  const handleHome = () => {
    const homeUrl = 'https://www.google.com';
    setUrl(homeUrl);
    setCurrentUrl(homeUrl);
  };

  const handleRefresh = () => {
    setCurrentUrl(currentUrl + '#' + Date.now());
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center space-x-2 border-b p-2">
        <Button icon={<ArrowLeftOutlined />} disabled />
        <Button icon={<ArrowRightOutlined />} disabled />
        <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
        <Button icon={<HomeOutlined />} onClick={handleHome} />
        <Input
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button type="primary" onClick={handleNavigate}>
          Go
        </Button>
      </div>
      <div className="flex flex-1">
        <iframe src={currentUrl} className="flex-1 border-0" title="Web Browser"></iframe>
      </div>
    </div>
  );
};

export default TauriBrowser;
