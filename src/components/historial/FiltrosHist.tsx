import type { Dispatch, SetStateAction } from "react";
import type { FiltrosHistorial, OrdenCampo, OrdenDir } from "./histTypes";

type Props = {
  filtros: FiltrosHistorial;
  setFiltros: Dispatch<SetStateAction<FiltrosHistorial>>;

  opcionesTipo: string[];
  opcionesMarca: string[];
  opcionesArt: string[];

  orden: OrdenCampo;
  setOrden: Dispatch<SetStateAction<OrdenCampo>>;

  dir: OrdenDir;
  setDir: Dispatch<SetStateAction<OrdenDir>>;

  cargar: () => void;
  generarPDF: () => void;
  desactivarPDF: boolean;
};

export const FiltrosHist = ({
  filtros,
  setFiltros,
  opcionesTipo,
  opcionesMarca,
  opcionesArt,
  orden,
  setOrden,
  dir,
  setDir,
  cargar,
  generarPDF,
  desactivarPDF,
}: Props) => {
  return (
    <div className="filtrosTabla">
      <input
        placeholder="Filtrar placa"
        value={filtros.placa}
        onChange={(e) =>
          setFiltros((p) => ({
            ...p,
            placa: e.target.value.toUpperCase(),
          }))
        }
      />

      <select
        value={filtros.tipo}
        onChange={(e) =>
          setFiltros((p) => ({
            ...p,
            tipo: e.target.value,
          }))
        }
      >
        <option value="">Todos los tipos</option>
        {opcionesTipo.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>

      <select
        value={filtros.marca}
        onChange={(e) =>
          setFiltros((p) => ({
            ...p,
            marca: e.target.value,
          }))
        }
      >
        <option value="">Todas las marcas</option>
        {opcionesMarca.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>

      <select
        value={filtros.art}
        onChange={(e) =>
          setFiltros((p) => ({
            ...p,
            art: e.target.value,
          }))
        }
      >
        <option value="">Todos los artículos</option>
        {opcionesArt.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>

      <select
        value={orden}
        onChange={(e) => setOrden(e.target.value as OrdenCampo)}
      >
        <option value="fecha">Ordenar por fecha</option>
        <option value="placa">Ordenar por placa</option>
        <option value="tip_vehi">Ordenar por tipo</option>
        <option value="marca">Ordenar por marca</option>
        <option value="art">Ordenar por artículo</option>
      </select>

      <select
        value={dir}
        onChange={(e) => setDir(e.target.value as OrdenDir)}
      >
        <option value="desc">Descendente</option>
        <option value="asc">Ascendente</option>
      </select>

      <button onClick={cargar}>Actualizar</button>

      <button onClick={generarPDF} disabled={desactivarPDF}>
        Generar PDF
      </button>
    </div>
  );
};