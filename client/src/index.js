import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
//import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';

//Material
import {
  StyledEngineProvider,
  ThemeProvider 
} from  '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'

// custom
import App from './App';
import Auth0ProviderWithHistory from './components/Auth/Auth0ProviderWithHistory';
import { store } from './redux/store/store';
import './index.css';
import theme from './features/theme/Theme';

ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <CssBaseline />
        <Provider store={store}>
          <Router>
            <Auth0ProviderWithHistory>
              <ThemeProvider theme={theme}>
              <App />
              </ThemeProvider>
            </Auth0ProviderWithHistory>
          </Router>
        </Provider>
    </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
