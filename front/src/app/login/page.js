"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import { useRouter } from 'next/navigation';

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
        const datosLogin = { correo: email, password };

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

                router.replace("/contactos");
            } else {
                showModal("Error", "La contraseña o el mail es incorrecto");
            }
        } catch (error) {
            console.error("Error al hacer la petición:", error);
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h1>Iniciar Sesión</h1>
                <form>
                    <div className="input-group">
                        <Input 
                            type="text" 
                            placeholder="ejemplo@mail.com" 
                            onChange={(e) => setMail(e.target.value)} 
                        />
                        <label htmlFor="mail">Correo electrónico</label>
                    </div>

                    <div className="input-group">
                        <Input 
                            type="contrseña" 
                            placeholder="********" 
                            onChange={(e) => setContraseña(e.target.value)} 
                        />
                        <label htmlFor="contraseña">Contraseña</label>
                    </div>

                    <button type="button" className="btn-login" onClick={ingresar}>
                        Ingresar
                    </button>

                    {/* Enlace para ir a registro */}
                    <div className="registro-redirect">
                        <p>
                            ¿No tienes cuenta?{" "}
                            <span className="registro-link" onClick={() => router.push("/registro")}>
                                Registrarse
                            </span>
                        </p>
                    </div>
                </form>

                {/* Modal */}
                {modal.open && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>{modal.title}</h2>
                            <p>{modal.message}</p>
                            <button onClick={closeModal} id="modal-btn">
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}