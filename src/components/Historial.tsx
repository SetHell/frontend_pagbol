import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Agente, BoletaReg } from "./types";
import { eliminarBoleta, listarBoletasAgente } from "../services/api";
import type {
  FiltrosHistorial,
  OrdenCampo,
  OrdenDir,
} from "./historial/histTypes";
import {
  filtrarYOrdenarBoletas,
  obtenerOpciones,
} from "./historial/histutils";
import { generarReporteBoletasPdf } from "./historial/reportePDF";
import { FiltrosHist } from "./historial/FiltrosHist";
import { TablaBol } from "./historial/TablaBol";
import { ModalBol } from "./historial/ModalBol";

type Props = {
  agente: Agente;
  bol: BoletaReg[];
  setBol: Dispatch<SetStateAction<BoletaReg[]>>;
  editarBoleta: (boleta: BoletaReg) => void;
};

export const Historial = ({ agente, bol, setBol, editarBoleta }: Props) => {
  const [sel, setSel] = useState<BoletaReg | null>(null);
  const [cargando, setCargando] = useState(true);
  const [err, setErr] = useState("");
  const [recarga, setRecarga] = useState(0);

  const [filtros, setFiltros] = useState<FiltrosHistorial>({
    placa: "",
    tipo: "",
    marca: "",
    art: "",
  });

  const [orden, setOrden] = useState<OrdenCampo>("fecha");
  const [dir, setDir] = useState<OrdenDir>("desc");

  useEffect(() => {
    let cancelado = false;

    const cargarBoletas = async () => {
      try {
        const data = await listarBoletasAgente();

        if (!cancelado) {
          setBol(data);
          setErr("");
        }
      } catch {
        if (!cancelado) {
          setErr("NO SE PUDIERON CARGAR LAS BOLETAS DESDE LA BASE DE DATOS");
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    void cargarBoletas();

    return () => {
      cancelado = true;
    };
  }, [recarga, setBol]);

  const cargar = () => {
    setCargando(true);
    setRecarga((p) => p + 1);
  };

  const eliminar = async (nro_boleta: string) => {
    if (!window.confirm("¿Eliminar registro?")) return;

    try {
      const eliminada = await eliminarBoleta(nro_boleta);

      setBol((p) =>
        p.map((b) => (b.nro_boleta === nro_boleta ? eliminada : b))
      );

      if (sel?.nro_boleta === nro_boleta) {
        setSel(null);
      }
    } catch {
      alert("No se pudo eliminar la boleta");
    }
  };

  const activas = useMemo(() => {
    return bol.filter((b) => b.activo !== false);
  }, [bol]);

  const opcionesTipo = useMemo(() => {
    return obtenerOpciones(activas, "tip_vehi");
  }, [activas]);

  const opcionesMarca = useMemo(() => {
    return obtenerOpciones(activas, "marca");
  }, [activas]);

  const opcionesArt = useMemo(() => {
    return obtenerOpciones(activas, "art");
  }, [activas]);

  const filtradas = useMemo(() => {
    return filtrarYOrdenarBoletas(activas, filtros, orden, dir);
  }, [activas, filtros, orden, dir]);

  const generarPDF = async () => {
    await generarReporteBoletasPdf({
      agente,
      boletas: filtradas,
      filtros,
      orden,
      dir,
    });
  };

  return (
    <section className="panel">
      <h1>Historial</h1>

      <FiltrosHist
        filtros={filtros}
        setFiltros={setFiltros}
        opcionesTipo={opcionesTipo}
        opcionesMarca={opcionesMarca}
        opcionesArt={opcionesArt}
        orden={orden}
        setOrden={setOrden}
        dir={dir}
        setDir={setDir}
        cargar={cargar}
        generarPDF={generarPDF}
        desactivarPDF={filtradas.length === 0}
      />

      {err && (
        <div className="error">
          <p>{err}</p>
        </div>
      )}

      {cargando && (
        <div className="cardDato">
          <p>Cargando boletas...</p>
        </div>
      )}

      {!cargando && filtradas.length === 0 && (
        <div className="cardDato">
          <p>No existen boletas registradas para este filtro.</p>
        </div>
      )}

      {!cargando && filtradas.length > 0 && (
        <TablaBol
          boletas={filtradas}
          setSel={setSel}
          editarBoleta={editarBoleta}
          eliminar={eliminar}
        />
      )}

      {sel && <ModalBol boleta={sel} cerrar={() => setSel(null)} />}
    </section>
  );
};