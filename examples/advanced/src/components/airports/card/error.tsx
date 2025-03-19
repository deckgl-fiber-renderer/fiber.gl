'use client';
import 'client-only';
import { ErrorBoundary } from 'react-error-boundary';
import styles from './styles.module.css';

function logError(error, info) {
  console.error(error);
  console.error(info.componentStack);
}

function ErrorContent() {
  return <div className={styles.container}>Error...</div>;
}

export function AirportsCardError(props) {
  const { children } = props;

  return (
    <ErrorBoundary fallback={<ErrorContent />} onError={logError}>
      {children}
    </ErrorBoundary>
  );
}
