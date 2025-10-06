"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

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
    // VALIDACIÓN DE CAMPOS VACÍOS
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
        router.replace("/login"); // REDIRECCIÓN A LOGIN
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
    <div className={styles["registro-wrapper"]}>
      <div className={styles["registro-container"]}>
        <h1>Registro</h1>
        <form>
          <div className={styles["input-group"]}>
            <label htmlFor="mail">Correo electrónico</label>
            <Input
              type="mail"
              placeholder="ejemplo@mail.com"
              onChange={(e) => setMail(e.target.value)}
            />
          </div>

          <div className={styles["input-group"]}>
            <label htmlFor="contraseña">Contraseña</label>
            <Input
              type="password"
              placeholder="********"
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>
          <div className={styles["input-group"]}>
            <label htmlFor="nombre">Nombre</label>
            <Input
              type="text"
              placeholder="Juan Pérez"
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <button
            type="button"
            className={styles["btn-registro"]}
            onClick={registroBack}
          >
            Registrarse
          </button>

          {/* Texto para ir a login */}
          <div className={styles["login-redirect"]}>
            <p>
              ¿Ya tienes cuenta?{" "}
              <span
                className={styles["login-link"]}
                onClick={() => router.push("/login")}
              >
                Iniciar sesión
              </span>
            </p>
          </div>
        </form>

        {/* Modal */}
        {modal.open && (
          <div className={styles.modal}>
            <div className={styles["modal-content"]}>
              <h2>{modal.title}</h2>
              <p>{modal.message}</p>
              <button onClick={closeModal} className={styles["modal-btn"]}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
