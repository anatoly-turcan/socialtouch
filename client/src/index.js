import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import WebFont from 'webfontloader';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import 'remixicon/fonts/remixicon.css';

WebFont.load({
  google: {
    families: ['Roboto:400,500,900', 'sans-serif'],
  },
});

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
