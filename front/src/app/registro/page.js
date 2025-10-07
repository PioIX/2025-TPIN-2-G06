"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import styles from "./registro.module.css";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [modal, setModal] = useState({ open: false, title: "", message: "" });
  const router = useRouter();

  const showModal = (title, message) => {
    setModal({ open: true, title, message });
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
  };

  async function registroBack() {
    if (!mail || !contraseña || !nombre) {
      showModal("Error", "Todos los campos son obligatorios");
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
        router.replace("/login");
      } else {
        showModal(
          "Error",
          "El email ya está registrado o la contraseña no es válida"
        );
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      showModal("Error", "Hubo un problema en el servidor");
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1>Registro</h1>
        <form>
          <div className={styles.field}>
            <label htmlFor="mail">Correo electrónico</label>
            <Input
              type="email"
              placeholder="ejemplo@mail.com"
              onChange={(e) => setMail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="contraseña">Contraseña</label>
            <Input
              type="password"
              placeholder="********"
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="nombre">Nombre</label>
            <Input
              type="text"
              placeholder="Juan Pérez"
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <button type="button" onClick={registroBack}>
            Registrarse
          </button>

          <div className={styles.loginRedirect}>
            <p>
              ¿Ya tienes cuenta?{" "}
              <span
                className={styles.loginLink}
                onClick={() => router.push("/login")}
              >
                Iniciar sesión
              </span>
            </p>
          </div>
        </form>

        {modal.open && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>{modal.title}</h2>
              <p>{modal.message}</p>
              <button onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
