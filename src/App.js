import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import AppShell from './Layout/AppShell.tsx';
import WorkoutsPage from './Pages/Workouts/WorkoutsPage.tsx';
import ExercisesPage from './Pages/Exercises/ExercisesPage.tsx';
import EditExercisePage from './Pages/Exercises/EditExercisePage.tsx';

function App() {

  const apolloClient = 
    new ApolloClient
    (
      {
        uri: "https://tgh-workout-tracker.hasura.app/v1/graphql",
        headers:
        {
          "x-hasura-admin-secret": "D6xzOMKVqwe6RbBXCNhw4XXD6kNOPeziq0pDqbtdxlxLQ8RT7rGbBLSe0CNVzsmw"
        },
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
              path="/exercises/add"
              element=
              {
                <AppShell pageTitle="Add Exercise" pageIndex={2}>
                  <EditExercisePage />
                </AppShell>
              }
            />
            <Route 
              path="/exercises/edit/:exerciseId"
              element=
              {
                <AppShell pageTitle="Edit Exercise" pageIndex={2}>
                  <EditExercisePage />
                </AppShell>
              }
            />
            <Route 
              path="/exercises" 
              element=
              {
                <AppShell pageTitle="Exercises" pageIndex={2}>
                  <ExercisesPage />
                </AppShell>
              } >
            </Route>
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
