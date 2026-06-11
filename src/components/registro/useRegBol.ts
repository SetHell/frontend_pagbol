import { useState, type ChangeEvent } from "react";
import type { BoletaReg, DatosOcr } from "../types";
import {
  actualizarBoleta,
  buscarVehiculo,
  crearBoleta,
  procesarOCR,
} from "../../services/api";
import { articulos, colores, marcas, tipos } from "./regConst";
import type { FormBol, OtrosForm, RegistrarProps } from "./regTyps";
import {
  aplicarSelect,
  crearEstadoInicial,
  crearFormVacio,
  crearOtrosVacio,
  fecOcr,
  limpiarCampo,
  limpiarOtro,
  quitarSerie,
  val,
  validarFormulario,
} from "./registroUtils";

export const useRegistrarBoleta = ({
  setBol,
  editando,
  cancelarEdicion,
}: RegistrarProps) => {
  const [dat, setDat] = useState<FormBol>(() => crearEstadoInicial(editando).dat);
  const [otros, setOtros] = useState<OtrosForm>(
    () => crearEstadoInicial(editando).otros
  );

  const [err, setErr] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [vehiculoMsg, setVehiculoMsg] = useState("");

  const [ocrAct, setOcrAct] = useState(false);
  const [ocrImg, setOcrImg] = useState("");
  const [ocrMsg, setOcrMsg] = useState("");
  const [ocrRev, setOcrRev] = useState<string[]>([]);

  const cambiar = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const campo = name as keyof FormBol;

    setDat((p) => ({
      ...p,
      [campo]: limpiarCampo(campo, value),
    }));
  };

  const cambiarOtro = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const campo = name as keyof OtrosForm;

    setOtros((p) => ({
      ...p,
      [campo]: limpiarOtro(campo, value),
    }));
  };

  const autocompletarVehiculoPorPlaca = async (
    placaBase?: string,
    colorDetectado?: string
  ) => {
    const placa = limpiarCampo("placa", placaBase || dat.placa);

    if (!placa) {
      setVehiculoMsg("");
      return;
    }

    if (!/^[0-9]{3,4}[A-Z]{3}$/.test(placa)) {
      setVehiculoMsg("Formato de placa no válido. Use 3 o 4 números y 3 letras.");
      return;
    }

    try {
      const vehiculo = await buscarVehiculo(placa);

      const tip = aplicarSelect(val(vehiculo.tip_vehi), tipos);
      const mar = aplicarSelect(val(vehiculo.marca), marcas);
      const colorFinal = colorDetectado ? val(colorDetectado) : val(vehiculo.color);
      const col = aplicarSelect(colorFinal, colores);

      setDat((p) => ({
        ...p,
        placa,
        tip_vehi: limpiarCampo("tip_vehi", tip.sel || p.tip_vehi),
        marca: limpiarCampo("marca", mar.sel || p.marca),
        color: limpiarCampo("color", col.sel || p.color),
      }));

      setOtros((p) => ({
        ...p,
        tip_vehi: limpiarOtro("tip_vehi", tip.otro),
        marca: limpiarOtro("marca", mar.otro),
        color: limpiarOtro("color", col.otro),
      }));

      setVehiculoMsg(
        "Vehículo encontrado. Se cargaron marca y tipo registrados. El color puede variar."
      );
    } catch {
      setVehiculoMsg("Vehículo no registrado. Complete los datos manualmente.");
    }
  };

  const aplicarOcr = (d: DatosOcr) => {
    const tip = aplicarSelect(val(d.tip_vehi), tipos);
    const mar = aplicarSelect(val(d.marca), marcas);
    const col = aplicarSelect(val(d.color), colores);
    const art = aplicarSelect(val(d.art), articulos);

    const placaDetectada = limpiarCampo("placa", val(d.placa));
    const colorDetectado = limpiarCampo("color", val(d.color));

    setDat((p) => ({
      ...p,
      nro_boleta: d.nro_boleta
        ? limpiarCampo("nro_boleta", quitarSerie(val(d.nro_boleta)))
        : p.nro_boleta,
      fecha: fecOcr(d, p.fecha),
      hora: val(d.hora).slice(0, 5) || p.hora,
      placa: placaDetectada || p.placa,
      nro_lic: limpiarCampo("nro_lic", val(d.nro_lic)) || p.nro_lic,
      nom_conductor:
        limpiarCampo("nom_conductor", val(d.nom_conductor)) || p.nom_conductor,
      tip_vehi: limpiarCampo("tip_vehi", tip.sel) || p.tip_vehi,
      marca: limpiarCampo("marca", mar.sel) || p.marca,
      color: limpiarCampo("color", col.sel) || p.color,
      art: limpiarCampo("art", art.sel) || p.art,
      nro_infr: limpiarCampo("nro_infr", val(d.nro_infr)) || p.nro_infr,
      lugar: limpiarCampo("lugar", val(d.lugar)) || p.lugar,
      zona: limpiarCampo("zona", val(d.zona)) || p.zona,
      observ: limpiarCampo("observ", val(d.observ)) || p.observ,
    }));

    setOtros((p) => ({
      ...p,
      tip_vehi: limpiarOtro("tip_vehi", tip.otro) || p.tip_vehi,
      marca: limpiarOtro("marca", mar.otro) || p.marca,
      color: limpiarOtro("color", col.otro) || p.color,
      art: limpiarOtro("art", art.otro) || p.art,
    }));

    setOcrRev(d.campos_revisar || []);

    if (placaDetectada) {
      void autocompletarVehiculoPorPlaca(placaDetectada, colorDetectado);
    }
  };

  const enviarOCR = async (file: File) => {
    setOcrImg(URL.createObjectURL(file));
    setOcrMsg("Procesando imagen con OCR...");
    setOcrRev([]);
    setErr([]);

    try {
      const datos = await procesarOCR(file);
      aplicarOcr(datos);
      setOcrMsg("OCR aplicado al formulario. Revise y corrija antes de registrar.");
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "No se puede conectar con el OCR o no se pudieron leer datos.";

      setOcrMsg(mensaje);
    }
  };

  const limpiar = () => {
    setDat(crearFormVacio());
    setOtros(crearOtrosVacio());
    setOcrImg("");
    setOcrMsg("");
    setOcrRev([]);
    setOcrAct(false);
    setErr([]);
    setVehiculoMsg("");
    cancelarEdicion?.();
  };

  const crearPayload = (): Partial<BoletaReg> => ({
    fecha: dat.fecha,
    hora: dat.hora,
    placa: dat.placa,
    nro_lic: dat.nro_lic || undefined,
    categ_lic: dat.categ_lic || undefined,
    nom_conductor: dat.nom_conductor || undefined,
    tip_vehi: dat.tip_vehi === "OTRO" ? otros.tip_vehi : dat.tip_vehi,
    marca: dat.marca === "OTRO" ? otros.marca : dat.marca,
    color: dat.color === "OTRO" ? otros.color : dat.color,
    art: dat.art === "OTRO" ? otros.art : dat.art,
    nro_infr: dat.nro_infr,
    lugar: dat.lugar,
    zona: dat.zona,
    observ: dat.observ || undefined,
  });

  const registrar = async () => {
    const faltantes = validarFormulario(dat, otros);

    if (faltantes.length > 0) {
      setErr(faltantes);
      return;
    }

    setGuardando(true);
    setErr([]);

    try {
      if (editando) {
        const actualizada = await actualizarBoleta(
          editando.nro_boleta,
          crearPayload()
        );

        setBol((p) =>
          p.map((b) =>
            b.nro_boleta === actualizada.nro_boleta ? actualizada : b
          )
        );

        alert("Boleta actualizada correctamente");
      } else {
        const guardada = await crearBoleta({
          ...crearPayload(),
          nro_boleta: `B-24-${dat.nro_boleta}`,
        });

        setBol((p) => [guardada, ...p]);
        alert("Boleta registrada correctamente");
      }

      limpiar();
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "NO SE PUDO GUARDAR EN LA BASE DE DATOS";

      setErr([mensaje]);
    } finally {
      setGuardando(false);
    }
  };

  return {
    dat,
    otros,
    err,
    guardando,
    vehiculoMsg,
    ocrAct,
    ocrImg,
    ocrMsg,
    ocrRev,
    cambiar,
    cambiarOtro,
    autocompletarVehiculoPorPlaca,
    enviarOCR,
    setOcrAct,
    registrar,
    limpiar,
  };
};
