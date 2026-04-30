import { Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function RouteShell({ children }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
