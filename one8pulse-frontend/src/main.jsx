// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { store } from './store/store';
import theme from './theme';
import App from './App';
import { AuthProvider } from 'react-oauth2-code-pkce';
import { authConfig } from './authConfig';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider 
            authConfig={authConfig}
            loadingComponent={<div>Loading...</div>}
        >
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </AuthProvider>
);
