import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AppShell from './Components/AppShell/AppShell.tsx';
import WorkoutsPage from './Pages/Workouts/WorkoutsPage.tsx';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/workouts" element={
            <AppShell>
              <WorkoutsPage />
            </AppShell>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
