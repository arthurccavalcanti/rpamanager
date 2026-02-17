import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from '@emotion/react';
import theme from './styles/theme';
import LogoutHandler from './api/LogoutHandler';
import { LangWrapper } from './contexts/LangWrapper';

const root = ReactDOM.createRoot(document.getElementById('root'));

// For development only: <React.StrictMode> 
root.render(
  <React.StrictMode>
    <AuthProvider>
        <BrowserRouter>
          <LogoutHandler />
          <ThemeProvider theme={theme}>
            <LangWrapper>
              <App />
            </LangWrapper>
          </ThemeProvider>
        </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);