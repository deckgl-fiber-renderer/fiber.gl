'use client';
import { useCallback } from 'react';
import { selectors, useStore } from './_store';

const styles = {
  container: {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'auto',
    maxWidth: 340,
    listStyle: 'none',
    padding: 16,
    margin: 0,
    background: 'rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },

  item: {},

  itemActive: {
    background: '#fff',
    color: '#000',
  },
};

export function Sidebar(props) {
  const { data } = props;

  const setIndex = useStore(selectors.setIndex);
  const index = useStore(selectors.index);

  const onEnter = useCallback((e) => {
    const i = e.target.dataset.index;
    setIndex(parseInt(i));
  }, []);

  const onLeave = useCallback(() => {
    setIndex(-1);
  }, []);

  return (
    <ul style={styles.container}>
      {data.features.map((feature, i) => {
        return (
          <li
            data-index={i}
            key={feature.id}
            style={i === index ? styles.itemActive : styles.item}
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
          >
            {feature.properties.NAME}
          </li>
        );
      })}
    </ul>
  );
}
