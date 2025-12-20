import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainPage from './components/MainPage';
import ModulePage from './components/ModulePage';
import FinalSummary from './components/FinalSummary';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/module/:moduleNumber" element={<ModulePage />} />
          <Route path="/summary" element={<FinalSummary />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

