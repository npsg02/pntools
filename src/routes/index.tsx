import LearnPage, { lessionsRouters } from '@/lessions';
import HomePage from '@/pages';
import { Outlet, RouteObject } from 'react-router-dom';
import Root from './root';
import LessionDoc from '@/lessions/components/LessionDoc';
import DictionaryPage from '@/modules/dictionary';
import { MenuProps, Spin } from 'antd';
import TauriModule from '@/modules/tauri';
import ToolsModule from '@/modules/tools';
import BlockchainModule from '@/modules/blockchain';
import ErrorPage from '@/pages/error';
import SQLPlayground from '@/modules/sql';

export const routers: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      ToolsModule,
      TauriModule,
      BlockchainModule,
      {
        path: 'dictionary',
        element: <DictionaryPage />,
      },
      {
        path: 'sql-playground',
        element: <SQLPlayground />,
      },
    ],
  },
];

const convertToMenu = (routers: RouteObject[], parrentPath = ''): MenuProps['items'] => {
  return routers.map((item) => {
    if (item.children) {
      let children = convertToMenu(item.children, item.path);
      return {
        key: (parrentPath + '/' + item.path) as string,
        label: item.path as string,
        children,
      };
    }
    return {
      key: (parrentPath + '/' + item.path) as string,
      label: item.path as string,
    };
  });
};

export const menus: MenuProps['items'] = convertToMenu(routers[0].children!);
