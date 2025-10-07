'use client';
import { useState } from 'react';
import Button from '@/components/Button';
import styles from './MenuPelea.module.css';

export default function MenuPelea(props) {
  const [menu, setMenu] = useState('inicio');
  const [ataqueSeleccionado, setAtaqueSeleccionado] = useState(false);

  const mostrarMenuAtaque = () => {
    setMenu('ataque');
    setAtaqueSeleccionado(true);  // Cambia el color del fondo al seleccionar "Atacar"
  };

  const mostrarMenuDefensa = () => alert('Defender activado');
  const volverAlInicio = () => {
    setMenu('inicio');
    setAtaqueSeleccionado(false);  // Vuelve al color original al regresar
  };

  return (
    <div className={styles.contenedor}>
      {menu === 'inicio' && (
        <div className={styles.menuInicio}>
          <div className={styles.columnaTexto}>
            <h2 className={styles.titulo}>¿Que vas a hacer?</h2>
            <p className={styles.subtitulo}>
              {props.probabilidadEsquivar}% de probabilidad de esquivar el próximo ataque
            </p>
          </div>
          <div className={styles.columnaBotones}>
            <Button onClick={mostrarMenuAtaque} text="Atacar"/>
            <Button onClick={mostrarMenuDefensa} text="Defender" />
          </div>
        </div>
      )}

      {menu === 'ataque' && (
        <div className={`${styles.menuAtaque} ${ataqueSeleccionado ? styles.menuAtaqueActivo : ''}`}>
          <div className={styles.columnaTexto}>
            <h2 className={styles.titulo}>Selecciona un ataque:</h2>
            <p className={styles.subtitulo}>
              Selecciona una habilidad ofensiva para atacar al enemigo
            </p>
          </div>
          <div className={styles.columnaBotones}>
            {props.ataques.map((ataque, i) => (
              <Button key={i} text={ataque}/>
            ))}
            <Button onClick={volverAlInicio} text="Volver"/>
          </div>
        </div>
      )}
    </div>
  );
}
