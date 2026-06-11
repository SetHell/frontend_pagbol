import { useState } from "react";
import type { Agente } from "./components/types";
import { PrincipalLogin } from "./components/PrincipalLogin";
import { Main } from "./components/Main";
import "./components/css/sistema.css";

export default function App() {
  const [agente, setAgente] = useState<Agente | null>(() => {
    const sesion = sessionStorage.getItem("agente");
    const token = sessionStorage.getItem("token");

    if (!sesion || !token) return null;

    return JSON.parse(sesion) as Agente;
  });

  const iniciarSesion = (ag: Agente, token: string) => {
    sessionStorage.setItem("agente", JSON.stringify(ag));
    sessionStorage.setItem("token", token);
    setAgente(ag);
  };

  const cerrarSesion = () => {
    sessionStorage.removeItem("agente");
    sessionStorage.removeItem("token");
    setAgente(null);
  };

  if (!agente) {
    return <PrincipalLogin onLogin={iniciarSesion} />;
  }

  return <Main agente={agente} cerrarSesion={cerrarSesion} />;
}
