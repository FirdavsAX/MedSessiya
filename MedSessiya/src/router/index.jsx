import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import RouteShell from './RouteShell.jsx';

const HomePage      = lazy(() => import('../pages/HomePage.jsx'));
const ExamSetupPage = lazy(() => import('../pages/ExamSetupPage.jsx'));
const ExamPage      = lazy(() => import('../pages/ExamPage.jsx'));
const PracticePage  = lazy(() => import('../pages/PracticePage.jsx'));
const ReviewPage    = lazy(() => import('../pages/ReviewPage.jsx'));
const StatsPage     = lazy(() => import('../pages/StatsPage.jsx'));

export const router = createBrowserRouter([
  { path: '/',                   element: <RouteShell><HomePage      /></RouteShell> },
  { path: '/exam/setup/:courseId', element: <RouteShell><ExamSetupPage /></RouteShell> },
  { path: '/exam',               element: <RouteShell><ExamPage      /></RouteShell> },
  { path: '/practice',           element: <RouteShell><PracticePage  /></RouteShell> },
  { path: '/exam/review',        element: <RouteShell><ReviewPage    /></RouteShell> },
  { path: '/stats',              element: <RouteShell><StatsPage     /></RouteShell> },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Sahifa topilmadi
      </div>
    ),
  },
]);
