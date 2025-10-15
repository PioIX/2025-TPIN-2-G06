"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";


export default function Login() {
  const [email, setMail] = useState("");
  const [password, setContraseña] = useState("");
  const [popup, setPopup] = useState({ open: false, title: "", message: "" });
  const router = useRouter();

  const showPopup = (title, message) => {
    setPopup({ open: true, title, message });
  };

  const closePopup = () => {
    setPopup({ ...popup, open: false });
  };

  async function ingresar() {
    const datosLogin = { mail: email, contraseña: password };

    try {
      const response = await fetch("http://localhost:4000/usuariosLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosLogin),
      });

      const result = await response.json();

      if (result.res === true) {
        showPopup("Éxito", "Login completado");
        localStorage.setItem("email", result.correo);
        localStorage.setItem("id", result.id);

        setTimeout(() => {
          closePopup();
          router.replace(`/menuGeneral?idUsuario=${result.id}&`);
        }, 800);
      } else {
        showPopup("Error", "La contraseña o el mail es incorrecto");
      }
    } catch (error) {
      console.error("Error al hacer la petición:", error);
      showPopup("Error", "No se pudo conectar con el servidor");
    }
  }

  return (
    <div className="loginWrapper">
      <div className="loginContainer">
        <h1>Iniciar Sesión</h1>
        <form>
          <div className="inputGroup">
            <label htmlFor="mail">Correo electrónico</label>
            <Input
              type="text"
              placeholder="ejemplo@mail.com"
              onChange={(e) => setMail(e.target.value)}
              className="inputStyled"
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="contraseña">Contraseña</label>
            <Input
              type="password"
              placeholder="********"
              onChange={(e) => setContraseña(e.target.value)}
              className="inputStyled"
            />
          </div>

          <Button type="button" onClick={ingresar}>
            Ingresar
          </Button>

          <div className="registroRedirect">
            <p>
              ¿No tienes cuenta?{" "}
              <span
                className="registroLink"
                onClick={() => router.push("/registro")}
              >
                Registrarse
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
