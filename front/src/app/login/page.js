"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const [email, setMail] = useState("");
  const [password, setContraseña] = useState("");
  const [modal, setModal] = useState({ open: false, title: "", message: "" });
  const router = useRouter();

  const showModal = (title, message) => {
    setModal({ open: true, title, message });
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
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
        showModal("Éxito", "Login completado");
        localStorage.setItem("email", result.correo);
        localStorage.setItem("id", result.id);

        setTimeout(() => {
          closeModal(); // cerramos el modal primero
          router.replace("/contactos");
        }, 800);
      } else {
        showModal("Error", "La contraseña o el mail es incorrecto");
      }
    } catch (error) {
      console.error("Error al hacer la petición:", error);
      showModal("Error", "No se pudo conectar con el servidor");
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <h1>Iniciar Sesión</h1>
        <form>
          <div className={styles.inputGroup}>
            <label htmlFor="mail">Correo electrónico</label>
            <Input
              type="text"
              placeholder="ejemplo@mail.com"
              onChange={(e) => setMail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="contraseña">Contraseña</label>
            <Input
              type="password"
              placeholder="********"
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>

          <button type="button" className={styles.btnLogin} onClick={ingresar}>
            Ingresar
          </button>

          <div className={styles.registroRedirect}>
            <p>
              ¿No tienes cuenta?{" "}
              <span
                className={styles.registroLink}
                onClick={() => router.push("/registro")}
              >
                Registrarse
              </span>
            </p>
          </div>
        </form>

        {modal.open && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>{modal.title}</h2>
              <p>{modal.message}</p>
              <button onClick={closeModal} className={styles.modalBtn}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
