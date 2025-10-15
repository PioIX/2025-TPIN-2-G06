"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useSearchParams } from "next/navigation";

export default function menuGeneral() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [idUsuario, setIsUsuario] = useState(null);

    useEffect(() => {
        obtenerIdUsuario();
    }, [])

    const obtenerIdUsuario = () => {
        setIsUsuario( searchParams.get("idUsuario"));
    };
    return (
        <>
            <h1>Menú</h1>
            <h2>Seleccione una opcion:</h2>
            <Button text="Ver Ranking" onClick={() => router.push("/ranking")}>
            </Button>

            <Button text="Ver Historial de Partidas" onClick={() => router.push(`/historial?idUsuario=${idUsuario}`)}>
            </Button>

            <Button text="Jugar" onClick={() => router.push(`/elegirPersonaje?idUsuario=${idUsuario}&`)}>
            </Button>
        </>
    )

}
