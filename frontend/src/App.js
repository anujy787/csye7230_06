import {BrowserRouter} from 'react-router-dom';
import Routes from './Routes';
import './App.css';
import RedirectComponent from './routes/RedirectComponent';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <RedirectComponent />
      </BrowserRouter>
    </div>
  );
}

export default App;
