
"use client"
export default function Button(props) {

    return (
      <>
        <button className={styles.button} onClick={props.onClick}>{props.text}</button>
      </>
    );
  }
  