"use client";
import styles from './button.module.css';

export default function Button(props) {
  return (
    <button onClick={props.onClick} value={props.value} className={styles.boton}>
      {props.text}
    </button>
  );
}
