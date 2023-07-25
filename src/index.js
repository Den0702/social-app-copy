import React from 'react';
import ReactDOM from 'react-dom';
/* import {BrowserRouter} from 'react-router-dom' */
import { HashRouter } from 'react-router-dom';

import './index.css';
import './normalize.css';

import App from './components/App';


/* Setting Infographics */
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>
  ,
  document.getElementById('root')
);


