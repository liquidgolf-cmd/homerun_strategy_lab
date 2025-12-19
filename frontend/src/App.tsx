import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage';
import ModulePage from './components/ModulePage';
import FinalSummary from './components/FinalSummary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/module/:moduleNumber" element={<ModulePage />} />
        <Route path="/summary" element={<FinalSummary />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

