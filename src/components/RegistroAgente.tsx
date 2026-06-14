import { useState } from "react";
import { Turnstile } from "react-turnstile";
import { registrarAgente } from "../services/api";
import "./css/registroAgente.css";

type Props = {
  volver: () => void;
};

const GRADOS = [
  { categoria: "Generales", opciones: ["GRAL. SUP.", "GRAL. MY.", "GRAL. 1RO."] },
  { categoria: "Jefes", opciones: ["CNL.", "TCNL.", "MY."] },
  { categoria: "Oficiales", opciones: ["CAP.", "TTE.", "SUBTTE.", "CAD."] },
  {
    categoria: "Suboficiales y Sargentos",
    opciones: [
      "SOF. SUP.",
      "SOF. MY.",
      "SOF. 1RO.",
      "SOF. 2DO.",
      "SGT. MY.",
      "SGT. 1RO.",
      "SGT. 2DO.",
      "SGT.",
      "ALM.",
    ],
  },
] as const;

export const RegistroAgente = ({ volver }: Props) => {
  const [nroEsclf, setNroEsclf]   = useState("");
  const [CI, setCI]               = useState("");
  const [grado, setGrado]         = useState("");
  const [nombres, setNombres]     = useState("");
  const [apellidos, setApellidos] = useState("");
  const [password, setPassword]   = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [mensaje, setMensaje]     = useState("");
  const [error, setError]         = useState("");
  const [cargando, setCargando]   = useState(false);

  const fortalezaPassword = () => {
    if (!password) return "—";
    if (password.length < 6) return "Débil";
    const tieneNumero    = /\d/.test(password);
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneEspecial  = /[^A-Za-z0-9]/.test(password);
    if (password.length >= 8 && tieneNumero && tieneMayuscula && tieneEspecial)
      return "Fuerte";
    return "Media";
  };

  // Solo permite dígitos en campos numéricos
  const soloDigitos = (valor: string) => valor.replace(/\D/g, "");

  const registrar = async () => {
    setError("");
    setMensaje("");

    if (!nroEsclf.trim())  { setError("Ingrese el número de escalafón."); return; }
    if (!CI.trim())        { setError("Ingrese el CI."); return; }
    if (!grado)            { setError("Seleccione el grado."); return; }
    if (!nombres.trim())   { setError("Ingrese los nombres."); return; }
    if (!apellidos.trim()) { setError("Ingrese los apellidos."); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (!captchaToken)     { setError("Debe completar el CAPTCHA."); return; }

    setCargando(true);
    try {
      await registrarAgente(
        nroEsclf.trim().toUpperCase(),
        CI.trim().toUpperCase(),
        grado,                          // ya viene en mayúsculas del select
        nombres.trim().toUpperCase(),
        apellidos.trim().toUpperCase(),
        password,
        captchaToken
      );
      setMensaje("Agente registrado correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="loginPage">
      <section className="loginCard">
        <h1>Registro de Agente</h1>

        <label>Nro. Escalafón</label>
        <input
          placeholder="Ej: AG001"
          value={nroEsclf}
          maxLength={30}
          onChange={(e) => setNroEsclf(e.target.value.toUpperCase())}
        />

        <label>Carnet de Identidad</label>
        <input
          placeholder="Ej: 12345678"
          value={CI}
          maxLength={20}
          inputMode="numeric"
          onChange={(e) => setCI(soloDigitos(e.target.value))}
        />

        <label>Grado</label>
        <select
          value={grado}
          onChange={(e) => setGrado(e.target.value)}
        >
          <option value="">— Seleccione un grado —</option>
          {GRADOS.map((cat) => (
            <optgroup key={cat.categoria} label={cat.categoria}>
              {cat.opciones.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <label>Nombres</label>
        <input
          placeholder="Ej: JUAN CARLOS"
          value={nombres}
          maxLength={100}
          onChange={(e) => setNombres(e.target.value.toUpperCase())}
        />

        <label>Apellidos</label>
        <input
          placeholder="Ej: MAMANI QUISPE"
          value={apellidos}
          maxLength={100}
          onChange={(e) => setApellidos(e.target.value.toUpperCase())}
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          maxLength={100}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p style={{ fontSize: "0.8rem", marginTop: "2px" }}>
          Fortaleza: <strong>{fortalezaPassword()}</strong>
        </p>

        <Turnstile
          sitekey="0x4AAAAAADiiKmol3OT7EeRm"
          onVerify={(token) => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken("")}
        />

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error   && <p className="mensaje-error">{error}</p>}

        <button onClick={registrar} disabled={cargando}>
          {cargando ? "Registrando..." : "Registrar"}
        </button>
        <button onClick={volver} disabled={cargando}>
          Volver al Login
        </button>
      </section>
    </main>
  );
};
