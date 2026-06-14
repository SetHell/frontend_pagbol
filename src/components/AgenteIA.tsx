import { useEffect, useRef, useState } from "react";
import agenteImg from "../assets/agenteIA.png";
import { generarContexto } from "./ia/contextoIA";

type Mensaje = {
  rol: "user" | "assistant";
  texto: string;
};

type Props = {
  paginaActual: string;
  nombreAgente: string;
  grado: string;
};

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN as string;
const MODELO = "mistralai/Mistral-7B-Instruct-v0.3";

export const AgenteIA = ({ paginaActual, nombreAgente, grado }: Props) => {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes, abierto]);

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || cargando) return;

    const nuevosMensajes: Mensaje[] = [
      ...mensajes,
      { rol: "user", texto },
    ];
    setMensajes(nuevosMensajes);
    setInput("");
    setCargando(true);

    const historial = nuevosMensajes
      .map((m) =>
        m.rol === "user" ? `[INST] ${m.texto} [/INST]` : m.texto
      )
      .join("\n");

    const prompt = `<s>[INST] ${generarContexto(paginaActual, nombreAgente, grado)} [/INST]
Entendido, estoy listo para ayudar.</s>
${historial}`;

    try {
      const res = await fetch(
        `https://api-inference.huggingface.co/models/${MODELO}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 300,
              temperature: 0.4,
              return_full_text: false,
            },
          }),
        }
      );

      const data = await res.json() as
        | { generated_text?: string }[]
        | { error?: string };

      let respuesta = "No pude obtener una respuesta.";

      if (Array.isArray(data) && data[0]?.generated_text) {
        respuesta = data[0].generated_text.split("[INST]")[0].trim();
      } else if (!Array.isArray(data) && data.error) {
        respuesta = `Error: ${data.error}`;
      }

      setMensajes([...nuevosMensajes, { rol: "assistant", texto: respuesta }]);
    } catch {
      setMensajes([
        ...nuevosMensajes,
        { rol: "assistant", texto: "Error de conexión con el asistente." },
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ position: "fixed", top: 18, right: 18, zIndex: 9999 }}>
      {abierto && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          pointerEvents: "none",
        }}>
          <div className="agenteChat" style={{ pointerEvents: "all" }}>
            <div className="agenteChatHead">
              <span>Asistente PagBol</span>
              <button onClick={() => setAbierto(false)}>✕</button>
            </div>

            <div className="agenteChatMensajes" ref={chatRef}>
              {mensajes.length === 0 && (
                <p className="agenteHint">
                  Hola, {nombreAgente}. Estás en <b>{paginaActual}</b>.
                  ¿En qué puedo ayudarte?
                </p>
              )}
              {mensajes.map((m, i) => (
                <div
                  key={i}
                  className={m.rol === "user" ? "agenteMsgUser" : "agenteMsgBot"}
                >
                  {m.texto}
                </div>
              ))}
              {cargando && (
                <div className="agenteMsgBot agenteCargando">Escribiendo...</div>
              )}
            </div>

            <div className="agenteChatInput">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") void enviar();
                }}
              />
              <button onClick={() => void enviar()} disabled={cargando}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="agenteBurbuja"
        onClick={() => setAbierto((p) => !p)}
      >
        <img src={agenteImg} alt="Asistente" />
      </div>
    </div>
  );
};
