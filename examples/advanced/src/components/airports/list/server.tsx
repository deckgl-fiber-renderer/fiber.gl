import 'server-only';
import { airports } from '@/dal/airports';
import { AirportsListClient } from './client';
import styles from './styles.module.css';

export async function AirportsListServer() {
  const data = await airports();

  return (
    <div className={styles.scroll}>
      <ul className={styles.list}>
        <AirportsListClient data={data} />
      </ul>
    </div>
  );
}
