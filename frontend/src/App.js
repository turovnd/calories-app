import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import { store } from './redux/store';
import { ViewMap } from './routes';

import { NotFound } from './components/NotFound';

function App() {
  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ReduxProvider store={store}>
          <BrowserRouter>
            <Routes>
              {Object.keys(ViewMap).map((path) => {
                const Page = ViewMap[path];
                return (
                  <Route key={path} path={path} element={<Page />} />
                );
              })}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ReduxProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export { App };
