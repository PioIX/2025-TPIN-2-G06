"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const [email, setMail] = useState("");
  const [password, setContraseña] = useState("");
  const [popup, setPopup] = useState({ open: false, title: "", message: "" });
  const router = useRouter();


  useEffect(() => {
    console.log("popup: ", popup);

  }, [popup])


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
        
        console.log("result: ", result)
        // Redirigir inmediatamente sin setTimeout
        router.replace(`/menuGeneral?idUsuario=${result.id}`);
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

          <button
          className={styles.botonLogin}
          onClick={ingresar}
        >
          Ingresar
        </button>

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
  );
}
