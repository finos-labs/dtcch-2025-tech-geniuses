import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import View from './views/View';
import Analyze from './views/Analyze';
import Extract from './views/Extract';
import Discover from './views/Discover';
import Report from './views/Report';
import Layout from './layouts/dashboard';

const router = createBrowserRouter([
  {
    Component: App, // root layout route
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '',
            Component: View,
          },
          {
            path: 'view',
            Component: View,
          },
          {
            path: 'discover',
            Component: Discover,
          },
          {
            path: 'extract',
            Component: Extract,
          },
          {
            path: 'analyze',
            Component: Analyze,
          },
          {
            path: 'report',
            Component: Report,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
