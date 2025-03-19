'use client';
import 'client-only';
import { useEffect } from 'react';
import { useSelected } from '@/hooks/use-selected';
import styles from './styles.module.css';

function Item(props) {
  function handleSelected() {
    props.setSelected(props.attributes.GLOBAL_ID);
  }

  return (
    <li
      className={`${styles.itemContainer} list-item`}
      onClick={handleSelected}
      data-active={props.isActive}
    >
      <div className={styles.item}>
        <div className={styles.label}>{props.attributes.NAME}</div>
        <div className={styles.subLabel}>Type: {props.attributes.MIL_CODE}</div>
      </div>
    </li>
  );
}

export function AirportsListClient(props) {
  const { data } = props;
  const [selected, setSelected] = useSelected();

  useEffect(() => {
    const el = document.querySelector('.list-item[data-active="true"]');

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [selected]);

  return data.map((item) => {
    const isActive = item.attributes.GLOBAL_ID === selected;

    return (
      <Item
        key={item.attributes.GLOBAL_ID}
        isActive={isActive}
        setSelected={setSelected}
        {...item}
      />
    );
  });
}
