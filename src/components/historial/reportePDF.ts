import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Agente, BoletaReg } from "../types";
import type { FiltrosHistorial, OrdenCampo, OrdenDir } from "./histTypes";
import { fecha, nombreOrden, valor } from "./histutils";
import logoReporte from "../../assets/iconPolicia.png";

type Params = {
  agente: Agente;
  boletas: BoletaReg[];
  filtros: FiltrosHistorial;
  orden: OrdenCampo;
  dir: OrdenDir;
};

const cargarLogoTransparente = (
  src: string,
  alpha = 0.24
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("No se pudo preparar el logo"));
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => reject(new Error("No se pudo cargar el logo"));
    img.src = src;
  });
};

export const generarReporteBoletasPdf = async ({
  agente,
  boletas,
  filtros,
  orden,
  dir,
}: Params) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "legal",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  const fechaGeneracion = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  try {
    const logo = await cargarLogoTransparente(logoReporte, 0.24);
    doc.addImage(logo, "PNG", 14, 8, 18, 18);
  } catch {
    // El PDF se genera aunque el logo no cargue.
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("REPORTE DE BOLETAS", pageWidth / 2, 16, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Fecha de emisión: ${fechaGeneracion}`, pageWidth / 2, 23, {
    align: "center",
  });

  doc.text(
    `FUNCIONARIO POLICIAL: ${valor(agente.grado)} ${valor(
      agente.persona?.nombres
    )} ${valor(agente.persona?.apellidos)} - ${valor(agente.nro_esclf)}`,
    14,
    34
  );

  const condiciones = [
    `Placa consultada: ${filtros.placa ? filtros.placa.toUpperCase() : "TODAS"}`,
    `Tipo de vehículo: ${filtros.tipo || "TODOS"}`,
    `Marca: ${filtros.marca || "TODAS"}`,
    `Artículo: ${filtros.art || "TODOS"}`,
    `Ordenamiento aplicado: ${nombreOrden(orden)} / ${
      dir === "asc" ? "ASCENDENTE" : "DESCENDENTE"
    }`,
  ];

  doc.setFont("helvetica", "bold");
  doc.text("Condiciones de emisión del reporte:", 14, 42);

  doc.setFont("helvetica", "normal");
  doc.text(condiciones.join("   |   "), 14, 48);

  autoTable(doc, {
    startY: 56,
    head: [
      [
        "Boleta",
        "Fecha",
        "Hora",
        "Placa",
        "Conductor",
        "Tipo",
        "Marca",
        "Color",
        "Artículo",
        "Num",
        "Lugar",
        "Zona",
      ],
    ],
    body: boletas.map((b) => [
      b.nro_boleta,
      fecha(b.fecha),
      valor(b.hora),
      valor(b.placa),
      valor(b.nom_conductor),
      valor(b.tip_vehi),
      valor(b.marca),
      valor(b.color),
      valor(b.art),
      valor(b.nro_infr),
      valor(b.lugar),
      valor(b.zona),
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fontStyle: "bold",
    },
    margin: {
      left: 14,
      right: 14,
    },
  });

  doc.save(
    `reporte_boletas_${agente.nro_esclf}_${fechaGeneracion.replaceAll(
      "/",
      "-"
    )}.pdf`
  );
};