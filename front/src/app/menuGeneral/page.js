"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function menuGeneral() {
      const router = useRouter();
    return (
        <>
            <h1>Menú</h1>
            <h2>Seleccione una opcion:</h2>
            <Button onClick={() => router.push("/ranking")}>
                Ver Ranking
            </Button>

            <Button onClick={() => router.push("/historial")}>
                Ver Historial de Partidas
            </Button>

            <Button onClick={() => router.push("/elegirPersonaje")}>
                Jugar
            </Button>
        </>
    )

}
