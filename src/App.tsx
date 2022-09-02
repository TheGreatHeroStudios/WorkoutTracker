import './App.css';
import React, { ReactNode, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import AppShell, { AppShellAction } from './Layout/AppShell';
import WorkoutsPage from './Pages/Workouts/WorkoutsPage';
import ExercisesPage from './Pages/Exercises/ExercisesPage';

const App = 
  () =>
  {
    const [pageTitleOverride, SetPageTitle] = useState<String>(null);
    
    const [appShellActions, SetAppShellActions] = 
      useState<Map<AppShellAction, () => void>>(null);

    const HandleNavigate =
      (prevRoute: string, prevPage: ReactNode) =>
      {
        SetPageTitle(null);
        SetAppShellActions(null);
      }

    return (
        <div className="App">
          <Router>
            <Routes>
              <Route 
                path="/profile" 
                element=
                {
                  <AppShell pageTitle="Profile" pageIndex={0} onNavigate={HandleNavigate}>
                    <WorkoutsPage />
                  </AppShell>
                } 
              />
              <Route 
                path="/workouts" 
                element=
                {
                  <AppShell pageTitle="Workouts" pageIndex={1} onNavigate={HandleNavigate}>
                    <WorkoutsPage />
                  </AppShell>
                } 
              />
              <Route 
                path="/exercises" 
                element=
                {
                  <AppShell 
                    pageTitle={pageTitleOverride ?? "Exercises"} 
                    pageIndex={2}
                    onNavigate={HandleNavigate}
                    actions={appShellActions} >
                    <ExercisesPage 
                      SetPageTitle={SetPageTitle}
                      appShellActionState={[appShellActions, SetAppShellActions]} />
                  </AppShell>
                } >
              </Route>
              <Route 
                path="/weigh-in" 
                element=
                {
                  <AppShell pageTitle="Weigh-In" pageIndex={3} onNavigate={HandleNavigate}>
                    <WorkoutsPage />
                  </AppShell>
                } 
              />
              <Route
                path="*"
                element={<Navigate to="/profile" replace />}
              />
            </Routes>
          </Router>
        </div>
    );
}

export default App;
