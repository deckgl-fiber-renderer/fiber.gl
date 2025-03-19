'use client';
import 'client-only';
import { ErrorBoundary } from 'react-error-boundary';

function logError(error, info) {
  console.error(error);
  console.error(info.componentStack);
}

export function AirportsLayerError(props) {
  const { children } = props;

  return (
    <ErrorBoundary fallback={null} onError={logError}>
      {children}
    </ErrorBoundary>
  );
}
