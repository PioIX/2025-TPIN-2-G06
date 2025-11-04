"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./tutorial.module.css";
import Button from "@/components/Button";
import MenuPelea from "@/components/MenuPelea";
import Personaje from "@/components/Personaje";


export default function Tutorial() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [personaje, setPersonaje] = useState(null);
    const [loading, setLoading] = useState(true);
    const [empieza, setEmpieza] = useState(true); // MenuPelea empieza activo

    // Cargar personaje del backend
    useEffect(() => {
        const fetchPersonaje = async () => {
            try {
                const res = await fetch("http://localhost:4000/encontrarPersonaje", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idHabilidad: 1 }),
                });
                const data = await res.json();
                setPersonaje(data.res);
            } catch (err) {
                console.error("Error al cargar personaje:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPersonaje();
    }, []);

    const siguiente = () => { if (step < 6) setStep(step + 1); };
    const anterior = () => { if (step > 1) setStep(step - 1); };

    // Función para defensa en MenuPelea
    const manejarDefensa = (opciones) => {
        console.log("Defender activado", opciones);
    };

    if (loading) {
        return (
            <div className={styles.cargando}>
                <p>Cargando personaje...</p>
            </div>
        );
    }

    return (
        <div className={styles.contenedor}>
            <div className={styles.card}>
                {/* Paso 1: Bienvenida */}
                {step === 1 && (
                    <div className={styles.paso}>
                        <h2>¡Bienvenido al tutorial!</h2>
                        <p>
                            Aquí aprenderás todo sobre tu personaje y cómo funciona el sistema
                            de combate. Podrás moverte entre los pasos con los botones de abajo.
                        </p>
                    </div>
                )}

                {/* Paso 2: Mostrar personaje con barras */}
                {step === 2 && personaje && (
                    <div className={styles.paso}>
                        <h2>Tu personaje</h2>
                        <Personaje
                            nombre={personaje.nombre}
                            imagen={personaje.fotoPersonaje}
                            saludMax={personaje.saludMax}
                            saludActual={personaje.saludActual}
                            energiaMax={personaje.energiaMax}
                            energiaActual={personaje.energiaActual}
                        />
                        <p className={styles.textoExplicacion}>
                            Este es tu luchador. Cada personaje tiene un estilo y un rol únicos.
                        </p>
                    </div>
                )}

                {/* Paso 3: Estadísticas */}
                {step === 3 && personaje && (
                    <div className={styles.paso}>
                        <h2>Estadísticas principales</h2>
                        <ul className={styles.listaStats}>
                            <li><strong>Tipo:</strong> {personaje.tipo}</li>
                            <li><strong>Salud máxima:</strong> {personaje.saludMax}</li>
                            <li><strong>Energía máxima:</strong> {personaje.energiaMax}</li>
                            <li><strong>Fuerza:</strong> {personaje.fuerza}</li>
                            <li><strong>Velocidad:</strong> {personaje.velocidad}</li>
                        </ul>
                        <p className={styles.textoExplicacion}>
                            Las estadísticas determinan tu desempeño en combate. La velocidad
                            determina la probabilidad de esquivar un ataque, la fuerza cuánto daño haces, y la
                            energía cuántas habilidades podés usar.
                        </p>
                    </div>
                )}

                {/* Paso 4: Habilidades */}
                {step === 4 && personaje && (
                    <div className={styles.paso}>
                        <h2>Habilidades</h2>
                        <ul className={styles.listaHabilidades}>
                            {personaje.habilidades.map((h, i) => (
                                <li key={i}>
                                    <strong>{h.nombre}</strong> — {h.daño ? `${h.daño} de daño` : "Defensiva"}{" "}
                                    {h.es_especial ? "(Especial)" : ""}
                                </li>
                            ))}
                        </ul>
                        <p className={styles.textoExplicacion}>
                            Las habilidades ofensivas causan daño, las defensivas reducen el
                            impacto enemigo, y las especiales consumen más energía pero cambian
                            el rumbo del combate.
                        </p>
                    </div>
                )}

                {/* Paso 5: Menú de pelea */}
                {step === 5 && personaje && (
                    <div className={styles.paso}>
                        <h2>Menú de pelea</h2>
                        <MenuPelea
                            empieza={empieza}
                            ataques={personaje.habilidades}
                            probabilidadEsquivar={personaje.velocidad}
                            onClick={manejarDefensa}
                        />
                    </div>
                )}

                {/* Paso 6: Final */}
                {step === 6 && (
                    <div className={styles.paso}>
                        <h2>¡Tutorial completado!</h2>
                        <p>
                            Ya conocés a tu personaje y sus habilidades. Estás listo para
                            combatir. ¡Buena suerte!
                        </p>
                        <Button text="Ir al menú principal" onClick={() => router.push(`/menuGeneral?idUsuario=${searchParams.get("idUsuario")}`)} />
                    </div>
                )}

                {/* Navegación */}
                <div className={styles.navegacion}>
                    {step > 1 && <Button text="← Anterior" onClick={anterior} />}
                    {step < 6 && <Button text="Siguiente →" onClick={siguiente} />}
                </div>
            </div>
        </div>
    );
}
