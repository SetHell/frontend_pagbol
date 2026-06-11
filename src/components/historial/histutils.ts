import type { BoletaReg } from "../types";
import type { FiltrosHistorial, OrdenCampo, OrdenDir } from "./histTypes";

export const valor = (v?: string | null) =>
  (v || "-----").toString().toUpperCase();

export const fecha = (v?: string | null) =>
  v ? String(v).slice(0, 10) : "-----";

export const obtenerOpciones = (
  boletas: BoletaReg[],
  campo: "tip_vehi" | "marca" | "art"
) => {
  return [
    ...new Set(
      boletas
        .map((b) => valor(b[campo]))
        .filter((x) => x !== "-----")
    ),
  ];
};

export const filtrarYOrdenarBoletas = (
  boletas: BoletaReg[],
  filtros: FiltrosHistorial,
  orden: OrdenCampo,
  dir: OrdenDir
) => {
  return [...boletas]
    .filter((b) => b.activo !== false)
    .filter((b) => valor(b.placa).includes(filtros.placa.toUpperCase()))
    .filter((b) => (filtros.tipo ? valor(b.tip_vehi) === filtros.tipo : true))
    .filter((b) => (filtros.marca ? valor(b.marca) === filtros.marca : true))
    .filter((b) => (filtros.art ? valor(b.art) === filtros.art : true))
    .sort((a, b) => {
      if (orden === "fecha") {
        const da = new Date(a.fecha).getTime();
        const db = new Date(b.fecha).getTime();

        return dir === "asc" ? da - db : db - da;
      }

      const av = valor(a[orden]);
      const bv = valor(b[orden]);

      return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
};

export const nombreOrden = (campo: OrdenCampo) => {
  const nombres: Record<OrdenCampo, string> = {
    fecha: "FECHA",
    placa: "PLACA",
    tip_vehi: "TIPO DE VEHÍCULO",
    marca: "MARCA",
    art: "ARTÍCULO",
  };

  return nombres[campo];
};