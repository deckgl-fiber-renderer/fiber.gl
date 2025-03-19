import styles from './styles.module.css';

export function Layout({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export function LayoutMap({ children }) {
  return <div className={styles.map}>{children}</div>;
}

export function LayoutRight({ children }) {
  return <div className={styles.right}>{children}</div>;
}

export function LayoutFooter({ children }) {
  return <div className={styles.footer}>{children}</div>;
}
