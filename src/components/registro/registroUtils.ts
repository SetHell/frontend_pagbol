import type { BoletaReg, DatosOcr } from "../types";
import { articulos, colores, LIM, marcas, tipos } from "./regConst";
import type { FormBol, OtrosForm, SelectAplicado } from "./regTyps";

export const fecAct = () => new Date().toISOString().split("T")[0];

export const horAct = () => new Date().toTimeString().slice(0, 5);

export const crearFormVacio = (): FormBol => ({
  nro_boleta: "",
  fecha: fecAct(),
  hora: horAct(),
  placa: "",
  nro_lic: "",
  categ_lic: "",
  nom_conductor: "",
  tip_vehi: "",
  marca: "",
  color: "",
  art: "",
  nro_infr: "",
  lugar: "",
  zona: "",
  observ: "",
});

export const crearOtrosVacio = (): OtrosForm => ({
  tip_vehi: "",
  marca: "",
  color: "",
  art: "",
});

export const val = (v?: string | null) =>
  v ? String(v).toUpperCase().trim() : "";

export const quitarSerie = (v: string) =>
  v.replace("B-24-", "").replace("B24-", "").replace(/[^0-9]/g, "");

export const fechaCorta = (v?: string | null) =>
  v ? String(v).slice(0, 10) : "";

const upper = (v: string) => v.toUpperCase();

const soloNumeros = (v: string, max: number) =>
  v.replace(/[^0-9]/g, "").slice(0, max);

const soloLetras = (v: string, max: number) =>
  upper(v)
    .replace(/[^A-ZÁÉÍÓÚÜÑ\s]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, max);

const alfaNum = (v: string, max: number) =>
  upper(v)
    .replace(/[^A-ZÁÉÍÓÚÜÑ0-9]/g, "")
    .slice(0, max);

const alfaNumEspacios = (v: string, max: number) =>
  upper(v)
    .replace(/[^A-ZÁÉÍÓÚÜÑ0-9\s.-]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, max);

const textoGeneral = (v: string, max: number) =>
  upper(v)
    .replace(/[^A-ZÁÉÍÓÚÜÑ0-9\s.,;:#°º/-]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, max);

export const limpiarCampo = (campo: keyof FormBol, valor: string) => {
  switch (campo) {
    case "nro_boleta":
      return soloNumeros(valor, LIM.nro_boleta);

    case "nro_infr":
      return soloNumeros(valor, LIM.nro_infr);

    case "nro_lic":
      return soloNumeros(valor, LIM.nro_lic);

    case "placa":
      return alfaNum(valor, LIM.placa);

    case "nom_conductor":
      return soloLetras(valor, LIM.nom_conductor);

    case "categ_lic":
      return alfaNumEspacios(valor, LIM.categ_lic);

    case "tip_vehi":
      return upper(valor).slice(0, LIM.tip_vehi);

    case "marca":
      return upper(valor).slice(0, LIM.marca);

    case "color":
      return upper(valor).slice(0, LIM.color);

    case "art":
      return upper(valor).slice(0, LIM.art);

    case "lugar":
      return textoGeneral(valor, LIM.lugar);

    case "zona":
      return textoGeneral(valor, LIM.zona);

    case "observ":
      return textoGeneral(valor, LIM.observ);

    default:
      return upper(valor);
  }
};

export const limpiarOtro = (campo: keyof OtrosForm, valor: string) => {
  switch (campo) {
    case "tip_vehi":
      return alfaNumEspacios(valor, LIM.tip_vehi);

    case "marca":
      return alfaNumEspacios(valor, LIM.marca);

    case "color":
      return soloLetras(valor, LIM.color);

    case "art":
      return alfaNumEspacios(valor, LIM.art);

    default:
      return upper(valor);
  }
};

export const aplicarSelect = (
  valor: string,
  opciones: string[]
): SelectAplicado => {
  if (!valor) return { sel: "", otro: "" };
  if (opciones.includes(valor)) return { sel: valor, otro: "" };

  return {
    sel: "OTRO",
    otro: valor,
  };
};

export const fecOcr = (d: DatosOcr, fechaActual: string) => {
  if (d.fecha) return d.fecha;

  if (d.dia && d.mes && d.anio) {
    return `${d.anio}-${d.mes.padStart(2, "0")}-${d.dia.padStart(2, "0")}`;
  }

  return fechaActual;
};

export const crearEstadoDesdeBoleta = (boleta: BoletaReg) => {
  const tip = aplicarSelect(val(boleta.tip_vehi), tipos);
  const mar = aplicarSelect(val(boleta.marca), marcas);
  const col = aplicarSelect(val(boleta.color), colores);
  const art = aplicarSelect(val(boleta.art), articulos);

  const dat: FormBol = {
    nro_boleta: limpiarCampo("nro_boleta", quitarSerie(boleta.nro_boleta)),
    fecha: fechaCorta(boleta.fecha),
    hora: val(boleta.hora).slice(0, 5),
    placa: limpiarCampo("placa", val(boleta.placa)),
    nro_lic: limpiarCampo("nro_lic", val(boleta.nro_lic)),
    categ_lic: limpiarCampo("categ_lic", val(boleta.categ_lic)),
    nom_conductor: limpiarCampo("nom_conductor", val(boleta.nom_conductor)),
    tip_vehi: limpiarCampo("tip_vehi", tip.sel),
    marca: limpiarCampo("marca", mar.sel),
    color: limpiarCampo("color", col.sel),
    art: limpiarCampo("art", art.sel),
    nro_infr: limpiarCampo("nro_infr", val(boleta.nro_infr)),
    lugar: limpiarCampo("lugar", val(boleta.lugar)),
    zona: limpiarCampo("zona", val(boleta.zona)),
    observ: limpiarCampo("observ", val(boleta.observ)),
  };

  const otros: OtrosForm = {
    tip_vehi: limpiarOtro("tip_vehi", tip.otro),
    marca: limpiarOtro("marca", mar.otro),
    color: limpiarOtro("color", col.otro),
    art: limpiarOtro("art", art.otro),
  };

  return { dat, otros };
};

export const crearEstadoInicial = (editando?: BoletaReg | null) => {
  if (editando) {
    return crearEstadoDesdeBoleta(editando);
  }

  return {
    dat: crearFormVacio(),
    otros: crearOtrosVacio(),
  };
};

export const validarFormulario = (dat: FormBol, otros: OtrosForm) => {
  const faltantes: string[] = [];

  if (!dat.nro_boleta) faltantes.push("NRO BOLETA");
  if (!dat.fecha) faltantes.push("FECHA");
  if (!dat.hora) faltantes.push("HORA");
  if (!dat.placa) faltantes.push("PLACA");
  if (!dat.tip_vehi) faltantes.push("TIPO DE VEHÍCULO");
  if (!dat.marca) faltantes.push("MARCA");
  if (!dat.color) faltantes.push("COLOR");
  if (!dat.art) faltantes.push("ARTÍCULO");
  if (!dat.nro_infr) faltantes.push("NÚMERO DE INFRACCIÓN");
  if (!dat.lugar) faltantes.push("LUGAR");
  if (!dat.zona) faltantes.push("ZONA");

  if (dat.tip_vehi === "OTRO" && !otros.tip_vehi) {
    faltantes.push("OTRO TIPO DE VEHÍCULO");
  }

  if (dat.marca === "OTRO" && !otros.marca) {
    faltantes.push("OTRA MARCA");
  }

  if (dat.color === "OTRO" && !otros.color) {
    faltantes.push("OTRO COLOR");
  }

  if (dat.art === "OTRO" && !otros.art) {
    faltantes.push("OTRO ARTÍCULO");
  }

  return faltantes;
};