import { useState } from "react";
import { Turnstile } from "react-turnstile";
import { registrarAgente } from "../services/api";
import "./css/registroAgente.css";

type Props = {
  volver: () => void;
};

export const RegistroAgente = ({ volver }: Props) => {
  const [nroEsclf, setNroEsclf] = useState("");
  const [CI, setCI] = useState("");
  const [grado, setGrado] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const fortalezaPassword = () => {
    if (!password) return "Vacía";
    if (password.length < 6) return "Débil";

    const tieneNumero = /\d/.test(password);
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneEspecial = /[^A-Za-z0-9]/.test(password);

    if (password.length >= 8 && tieneNumero && tieneMayuscula && tieneEspecial) {
      return "Fuerte";
    }

    return "Media";
  };

  const registrar = async () => {
    try {
      setError("");
      setMensaje("");

      await registrarAgente(nroEsclf, CI, grado, password, captchaToken);

      setMensaje("Agente registrado correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar.");
    }
  };

  return (
    <main className="loginPage">
      <section className="loginCard">
        <h1>Registro de Agente</h1>

        <input
          placeholder="Nro Escalafón"
          value={nroEsclf}
          onChange={(e) => setNroEsclf(e.target.value.toUpperCase())}
        />

        <input
          placeholder="CI"
          value={CI}
          onChange={(e) => setCI(e.target.value)}
        />

        <input
          placeholder="Grado"
          value={grado}
          onChange={(e) => setGrado(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p>Fortaleza: {fortalezaPassword()}</p>

        <Turnstile
          sitekey="0x4AAAAAADiiKmol3OT7EeRm"
          onVerify={(token) => setCaptchaToken(token)}
        />

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="mensaje-error">{error}</p>}

        <button onClick={registrar}>Registrar</button>
        <button onClick={volver}>Volver al Login</button>
      </section>
    </main>
  );
};