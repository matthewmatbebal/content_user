import './App.css';
import SearchPage from './SearchPage';
import ContentPage from './ContentPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {


  return (
    <Router basename='/content_user'>
      <div className="App">
        <header className="App-header">
          <h2>ContentPay</h2>
        </header>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/content/:id" element={<ContentPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
