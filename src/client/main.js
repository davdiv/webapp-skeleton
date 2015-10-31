import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';
import dataStore from './dataStore';

export default function(clientData) {
    dataStore.data = clientData;
    ReactDOM.render(<Router routes={ routes } history={ createBrowserHistory() } />, document.getElementById('root'));
}
