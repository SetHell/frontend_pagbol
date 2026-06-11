import { useState } from "react";
import type { Agente, BoletaReg } from "./types";
import { Menu } from "./Menu";
import { Inicio } from "./Inicio";
import { Guia } from "./Guia";
import { Registrar } from "./Registrar";
import { Historial } from "./Historial";

type Props = {
  agente: Agente;
  cerrarSesion: () => void;
};

type Pagina = "inicio" | "guia" | "registrar" | "historial";

export const Main = ({ agente, cerrarSesion }: Props) => {
  const [pag, setPag] = useState<Pagina>("inicio");
  const [bol, setBol] = useState<BoletaReg[]>([]);
  const [editando, setEditando] = useState<BoletaReg | null>(null);

  const confirmarSalida = () => {
    if (window.confirm("¿Está seguro que desea cerrar sesión?")) cerrarSesion();
  };

  const cambiarPag = (nuevaPag: string) => {
    const pagina = nuevaPag as Pagina;
    if (pagina !== "registrar") setEditando(null);
    setPag(pagina);
  };

  const irEditar = (boleta: BoletaReg) => {
    if (!window.confirm(`¿Editar la boleta ${boleta.nro_boleta}?`)) return;
    setEditando(boleta);
    setPag("registrar");
  };

  return (
    <div className="appLayout">
      <Menu pag={pag} setPag={cambiarPag} cerrarSesion={confirmarSalida} />

      <main className="contenido">
        {pag === "inicio" && <Inicio agente={agente} />}
        {pag === "guia" && <Guia />}
        {pag === "registrar" && (
          <Registrar
            agente={agente}
            setBol={setBol}
            editando={editando}
            cancelarEdicion={() => setEditando(null)}
          />
        )}
        {pag === "historial" && (
          <Historial
            agente={agente}
            bol={bol}
            setBol={setBol}
            editarBoleta={irEditar}
          />
        )}
      </main>

      <div className="salirMovil">
        <button onClick={confirmarSalida}>Cerrar sesión</button>
      </div>
    </div>
  );
};