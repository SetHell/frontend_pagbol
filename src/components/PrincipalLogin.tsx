import { useState } from "react";
import type { Agente } from "./types";
import { loginAgente } from "../services/api";
import "./css/login.css";

type Props = {
  onLogin: (agente: Agente, token: string) => void;
};

export const PrincipalLogin = ({ onLogin }: Props) => {
  const [nroEsclf, setNroEsclf] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [cargando, setCargando] = useState(false);

  const ingresar = async () => {
    setErr("");

    if (!nroEsclf.trim()) {
      setErr("Ingrese el número de escalafón.");
      return;
    }

    if (!password.trim()) {
      setErr("Ingrese la contraseña.");
      return;
    }

    setCargando(true);

    try {
      const data = await loginAgente(nroEsclf.trim().toUpperCase(), password);
      onLogin(data.agente, data.token);
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión.";

      setErr(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="loginPage">
      <section className="loginCard">
        <h1>Sistema de Boletas</h1>
        <p>Ingrese sus credenciales de funcionario policial.</p>

        <label>Nro. Escalafón</label>
        <input
          value={nroEsclf}
          onChange={(e) => setNroEsclf(e.target.value.toUpperCase())}
          placeholder="Ej: AG001"
          autoComplete="username"
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingrese su contraseña"
          autoComplete="current-password"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void ingresar();
            }
          }}
        />

        {err && <div className="loginError">{err}</div>}

        <button onClick={ingresar} disabled={cargando}>
          {cargando ? "Verificando..." : "Ingresar"}
        </button>
      </section>
    </main>
  );
};