"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import Personaje from "@/components/PersonajeLuqui";
import { useRouter } from "next/navigation";

export default function Login() {
    const [personajes, setPersonajes] = useState([]);
    const router = useRouter();

    useEffect(() => {
        obtenerPersonajes();
    }, []);

    async function obtenerPersonajes() {
        try {
            const response = await fetch("http://localhost:4000/obtenerPersonajes", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            setPersonajes(data);
        } catch (error) {
            console.error("Error al obtener los personajes:", error);
        }
    }


    return (
        <>
            <h1>Seleccione un personaje:</h1>
            {personajes.map((personaje) => (
                <div key={personaje.idPersonaje}>
                    <Personaje
                        nombre={personaje.nombre}
                        tipo={personaje.tipo}
                        velocidad={personaje.velocidad}
                        salud={personaje.salud}
                        energia={personaje.energia}
                        foto={personaje.foto}
                    />
                    <Button
                        text="Seleccionar"
                        onClick={() => router.push('/elegirMapa')}
                    />
                </div>
            ))}

        </>
    );
}