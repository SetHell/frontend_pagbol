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
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
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
    if (password.length >= 8 && tieneNumero && tieneMayuscula && tieneEspecial)
      return "Fuerte";
    return "Media";
  };

  const registrar = async () => {
    try {
      setError("");
      setMensaje("");

      if (!nroEsclf.trim()) { setError("Ingrese el número de escalafón."); return; }
      if (!CI.trim()) { setError("Ingrese el CI."); return; }
      if (!grado.trim()) { setError("Ingrese el grado."); return; }
      if (!nombres.trim()) { setError("Ingrese los nombres."); return; }
      if (!apellidos.trim()) { setError("Ingrese los apellidos."); return; }
      if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
      if (!captchaToken) { setError("Debe completar el CAPTCHA."); return; }

      await registrarAgente(nroEsclf, CI, grado, nombres, apellidos, password, captchaToken);

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
          placeholder="Nombres"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
        />
        <input
          placeholder="Apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
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
          onExpire={() => setCaptchaToken("")}
        />

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="mensaje-error">{error}</p>}

        <button onClick={registrar}>Registrar</button>
        <button onClick={volver}>Volver al Login</button>
      </section>
    </main>
  );
};