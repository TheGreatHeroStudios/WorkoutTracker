import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import AppShell from './Components/AppShell/AppShell.tsx';
import WorkoutsPage from './Pages/Workouts/WorkoutsPage.tsx';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import AddExercisePage from './Pages/Exercises/AddExercisePage';

function App() {

  const apolloClient = 
    new ApolloClient
    (
      {
        uri: "",
        cache: new InMemoryCache(),
      }
    );

  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <Router>
          <Routes>
            <Route 
              path="/profile" 
              element=
              {
                <AppShell pageTitle="Profile" pageIndex={0}>
                  <WorkoutsPage />
                </AppShell>
              } 
            />
            <Route 
              path="/workouts" 
              element=
              {
                <AppShell pageTitle="Workouts" pageIndex={1}>
                  <WorkoutsPage />
                </AppShell>
              } 
            />
            <Route 
              path="/exercises" 
              element=
              {
                <AppShell pageTitle="Exercises" pageIndex={2}>
                  <AddExercisePage />
                </AppShell>
              } 
            />
            <Route 
              path="/weigh-in" 
              element=
              {
                <AppShell pageTitle="Weigh-In" pageIndex={3}>
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
    </ApolloProvider>
  );
}

export default App;
