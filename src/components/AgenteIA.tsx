import { useEffect, useRef, useState } from "react";
import type React from "react";
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

type Esquina = "top-right" | "top-left" | "bottom-right" | "bottom-left";

const posicionEsquina = (esquina: Esquina): React.CSSProperties => {
  const base: React.CSSProperties = { position: "fixed", zIndex: 9999 };
  if (esquina === "top-right") return { ...base, top: 18, right: 18 };
  if (esquina === "top-left") return { ...base, top: 18, left: 18 };
  if (esquina === "bottom-right") return { ...base, bottom: 18, right: 18 };
  return { ...base, bottom: 18, left: 18 };
};

const esquinaMasCercana = (x: number, y: number): Esquina => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const derecha = x > w / 2;
  const abajo = y > h / 2;
  if (!derecha && !abajo) return "top-left";
  if (derecha && !abajo) return "top-right";
  if (!derecha && abajo) return "bottom-left";
  return "bottom-right";
};

export const AgenteIA = ({ paginaActual, nombreAgente, grado }: Props) => {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [esquina, setEsquina] = useState<Esquina>("top-right");
  const [arrastrando, setArrastrando] = useState(false);

  const burbRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const chatRef = useRef<HTMLDivElement>(null);
  const fueArrastrado = useRef(false);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes, abierto]);

  const iniciarArrastre = (e: React.MouseEvent | React.TouchEvent) => {
    fueArrastrado.current = false;
    setArrastrando(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const rect = burbRef.current?.getBoundingClientRect();
    offsetRef.current = {
      x: clientX - (rect?.left ?? 0),
      y: clientY - (rect?.top ?? 0),
    };
    e.preventDefault();
  };

  useEffect(() => {
    const mover = (e: MouseEvent | TouchEvent) => {
      if (!arrastrando || !burbRef.current) return;
      fueArrastrado.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      burbRef.current.style.left = `${clientX - offsetRef.current.x}px`;
      burbRef.current.style.top = `${clientY - offsetRef.current.y}px`;
      burbRef.current.style.right = "auto";
      burbRef.current.style.bottom = "auto";
    };

    const soltar = (e: MouseEvent | TouchEvent) => {
      if (!arrastrando) return;
      setArrastrando(false);
      const clientX = "changedTouches" in e
        ? e.changedTouches[0].clientX
        : (e as MouseEvent).clientX;
      const clientY = "changedTouches" in e
        ? e.changedTouches[0].clientY
        : (e as MouseEvent).clientY;
      const nueva = esquinaMasCercana(clientX, clientY);
      setEsquina(nueva);
      if (burbRef.current) {
        burbRef.current.style.left = "";
        burbRef.current.style.top = "";
        burbRef.current.style.right = "";
        burbRef.current.style.bottom = "";
      }
    };

    window.addEventListener("mousemove", mover);
    window.addEventListener("mouseup", soltar);
    window.addEventListener("touchmove", mover, { passive: false });
    window.addEventListener("touchend", soltar);

    return () => {
      window.removeEventListener("mousemove", mover);
      window.removeEventListener("mouseup", soltar);
      window.removeEventListener("touchmove", mover);
      window.removeEventListener("touchend", soltar);
    };
  }, [arrastrando]);

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
  <div ref={burbRef} style={posicionEsquina(esquina)}>
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
      style={{ position: "relative", zIndex: 9999 }}
      onMouseDown={iniciarArrastre}
      onTouchStart={iniciarArrastre}
      onClick={() => {
        if (!fueArrastrado.current) setAbierto((p) => !p);
      }}
    >
        <img src={agenteImg} alt="Asistente" />
        </div>
    </div>
    );
};