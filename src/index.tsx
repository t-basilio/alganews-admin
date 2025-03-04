import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import reportWebVitals from './reportWebVitals';
import { store } from './core/store';
import DefaultLayout from './app/layouts/Default';
import Routes from './app/routes';
import '../src/index.css';
import moment from 'moment';
import 'moment/locale/pt-br';

import './auth/httpConfig'

moment.locale('pt-br')

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ConfigProvider locale={ptBR}>
      <Provider store={store}>
        <BrowserRouter>
          <DefaultLayout>
            <Routes />
          </DefaultLayout>
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
