import type { Agente } from "./types";

type Props = {
  agente: Agente;
};

export const Inicio = ({ agente }: Props) => {
  return (
    <section className="panel">
      <h1>Inicio</h1>

      <div className="cardDato">
        <p><b>Funcionario:</b> {agente.persona.nombres} {agente.persona.apellidos}</p>
        <p><b>Grado:</b> {agente.grado}</p>
        <p><b>CI:</b> {agente.CI}</p>
        <p><b>Nro Escalafón:</b> {agente.nro_esclf}</p>
      </div>
    </section>
  );
};