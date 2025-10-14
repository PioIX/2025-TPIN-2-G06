"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function menuGeneral() {
      const router = useRouter();
    return (
        <>
            <h1>Menú</h1>
            <h2>Seleccione una opcion:</h2>
            <Button text = "Ver Ranking" onClick={() => router.push("/ranking")}>
            </Button>

            <Button text = "Ver Historial de Partidas" onClick={() => router.push("/historial")}> 
            </Button>

            <Button text = "Jugar" onClick={() => router.push("/elegirPersonaje")}>
            </Button>
        </>
    )

}
