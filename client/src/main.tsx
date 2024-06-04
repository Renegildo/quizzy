import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import App from './pages/app';
import Home from './pages/home';
import Quiz from './pages/quiz';
import NewQuiz from './pages/new-quiz';
import Login from './pages/auth/login';
import User from './pages/user';
import Register from './pages/auth/register';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/app/q/:id",
    element: <Quiz />,
  },
  {
    path: "/app/u/:id",
    element: <User />,
  },
  {
    path: "/app/newQuiz",
    element: <NewQuiz />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

