import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import WebFont from 'webfontloader';
import { BrowserRouter } from 'react-router-dom';
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
