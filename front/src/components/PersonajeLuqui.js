"use client"

export default function PersonajeLuqui(props) {
    return (
      <>
        <h3> Nombre = {props.nombre}</h3>
        <p> Tipo = {props.tipo}</p>
        <p> Velocidad = {props.velocidad}</p>
        <p> Salud = {props.salud}</p>
        <p> Energía = {props.energia}</p>
        <p> Foto = {props.foto}</p>
      </>
    );
  }
  