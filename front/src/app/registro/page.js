"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [popup, setPopup] = useState({ open: false, title: "", message: "" });
  const router = useRouter();

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
      const response = await fetch("http://localhost:4000/usuariosRegistro", {
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
        showPopup("Éxito", "Registro completado");
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
        <form>
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

          <button type="button" className="btnLogin" onClick={registroBack}>
            Registrarse
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
        </form>

        {popup.open && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>{popup.title}</h2>
              <p>{popup.message}</p>
              <button onClick={closePopup} className="popupCloseBtn">
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
