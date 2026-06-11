type Props = {
  pag: string;
  setPag: (pag: string) => void;
  cerrarSesion: () => void;
};

const opcionesMenu = [
  { id: "inicio", texto: "Inicio" },
  { id: "guia", texto: "Guía" },
  { id: "registrar", texto: "Registrar" },
  { id: "historial", texto: "Historial" },
];

export const Menu = ({ pag, setPag, cerrarSesion }: Props) => {
  return (
    <aside className="menu">
      <div className="menuCabecera">
        <h2>BOLETAS</h2>
      </div>

      <div className="menuOpciones">
        {opcionesMenu.map((op) => (
          <button
            key={op.id}
            className={pag === op.id ? "activo" : ""}
            onClick={() => setPag(op.id)}
          >
            {op.texto}
          </button>
        ))}
      </div>

      <div className="menuSesion">
        <button className="salir" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};