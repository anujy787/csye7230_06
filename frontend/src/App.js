import { BrowserRouter } from 'react-router-dom';
// import Routes from './Routes';
import RedirectComponent from './routes/RedirectComponent';

function App() {
  return (
    <div className="w-full h-full">
      <BrowserRouter>
        <RedirectComponent />
      </BrowserRouter>
    </div>
  );
}

export default App;
