"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import styles from "./registro.module.css";
import { useIp } from "@/hooks/useIp";  // Importa el hook useIp


export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [popup, setPopup] = useState({ open: false, title: "", message: "" });
  const router = useRouter();

  // Llama al hook useIp y desestructura la IP
  const { ip } = useIp();  // Ahora obtenemos la IP del hook

  const showPopup = (title, message) => {
    setPopup({ open: true, title, message });
  };

  const closePopup = () => {
    setPopup({ ...popup, open: false });
  };

  async function registroBack() {
    if (!mail || !contraseña || !nombre) {
      showPopup("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      // Verifica si la IP está definida antes de hacer la petición
      if (!ip) {
        throw new Error("IP no definida");
      }

      const response = await fetch(`http://${ip}:4000/usuariosRegistro`, {  // Usamos la IP dinámica aquí
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mail,
          contraseña,
          nombre,
        }),
      });

      const data = await response.json();

      if (data.validar) {
        setTimeout(() => {
          closePopup();
          router.replace("/login");
        }, 800);
      } else {
        showPopup(
          "Error",
          "El email ya está registrado o la contraseña no es válida"
        );
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      showPopup("Error", "Hubo un problema en el servidor");
    }
  }

  return (
    <div className="loginWrapper">
      <div className="loginContainer">
        <h1>Registro</h1>
        <div className="inputGroup">
          <label htmlFor="nombre">Nombre</label>
          <Input
            type="text"
            placeholder="Juan Pérez"
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="mail">Correo electrónico</label>
          <Input
            type="email"
            placeholder="ejemplo@mail.com"
            onChange={(e) => setMail(e.target.value)}
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="contraseña">Contraseña</label>
          <Input
            type="password"
            placeholder="********"
            onChange={(e) => setContraseña(e.target.value)}
          />
        </div>

        <button
          className={styles.botonLogin}
          onClick={registroBack}
        >
          Registro
        </button>
        <div className="registroRedirect">
          <p>
            ¿Ya tienes cuenta?{" "}
            <span
              className="registroLink"
              onClick={() => router.push("/login")}
            >
              Iniciar sesión
            </span>
          </p>
        </div>

        {/* Modal Popup */}
        {popup.open && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h2>{popup.title}</h2>
              <p>{popup.message}</p>
              <Button text="Cerrar" onClick={closePopup}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
