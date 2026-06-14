import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import type { BoletaReg } from "../types";

type Modo = "dia" | "mes" | "anio";

type Props = {
  boletas: BoletaReg[];
  onCerrar: () => void;
};

const MESES = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

export const GraficoBoletas = ({ boletas, onCerrar }: Props) => {
  const [modo, setModo] = useState<Modo>("mes");

  const datos = useMemo(() => {
    const conteo: Record<string, number> = {};

    boletas.forEach((b) => {
      if (!b.fecha) return;
      const d = new Date(b.fecha);
      let clave: string;

      if (modo === "dia") {
        clave = String(b.fecha).slice(0, 10);
      } else if (modo === "mes") {
        clave = `${MESES[d.getMonth()]} ${d.getFullYear()}`;
      } else {
        clave = String(d.getFullYear());
      }

      conteo[clave] = (conteo[clave] ?? 0) + 1;
    });

    const entradas = Object.entries(conteo).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    if (modo === "dia") {
      return entradas.slice(-30).map(([label, total]) => ({ label, total }));
    }

    return entradas.map(([label, total]) => ({ label, total }));
  }, [boletas, modo]);

  const titulos: Record<Modo, string> = {
    dia: "Boletas por día (últimos 30 días)",
    mes: "Boletas por mes",
    anio: "Boletas por año",
  };

  return (
    <div className="modal">
      <div className="modalCard" style={{ width: "min(820px, 96vw)", maxHeight: "90vh" }}>
        <h2 style={{ textAlign: "center" }}>📊 {titulos[modo]}</h2>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 18 }}>
          {(["dia", "mes", "anio"] as Modo[]).map((m) => (
            <button
              key={m}
              onClick={() => setModo(m)}
              style={{
                background: modo === m ? "var(--verde-oscuro)" : "var(--papel-amarillo)",
                color: modo === m ? "white" : "#111",
                border: "1px solid var(--borde-papel)",
                borderRadius: 7,
                padding: "6px 18px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {m === "dia" ? "Por día" : m === "mes" ? "Por mes" : "Por año"}
            </button>
          ))}
        </div>

        {datos.length === 0 ? (
          <p style={{ textAlign: "center", padding: 30 }}>
            No hay datos para mostrar.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={datos}
              margin={{ top: 20, right: 20, left: 0, bottom: modo === "dia" ? 60 : 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#c8bf8a" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fontWeight: 700, fill: "#3a4a2a" }}
                angle={modo === "dia" ? -45 : 0}
                textAnchor={modo === "dia" ? "end" : "middle"}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fontWeight: 700, fill: "#3a4a2a" }}
                label={{
                  value: "Boletas",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { fontSize: 12, fill: "#3a4a2a" },
                }}
              />
              <Tooltip
                formatter={(value) => {
                  const total = Number(value ?? 0);
                  return [`${total} boleta${total !== 1 ? "s" : ""}`, "Total"];
                }}
                contentStyle={{
                  background: "#f8f3cf",
                  border: "1px solid #9f985d",
                  borderRadius: 8,
                  fontWeight: 700,
                }}
              />
              <Bar dataKey="total" fill="var(--verde-oscuro)" radius={[5, 5, 0, 0]}>
                <LabelList
                  dataKey="total"
                  position="top"
                  style={{ fontSize: 11, fontWeight: 900, fill: "#3a4a2a" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        <p style={{ textAlign: "center", fontSize: 12, color: "#555", marginTop: 8 }}>
          Total: <strong>{boletas.length}</strong> boleta{boletas.length !== 1 ? "s" : ""} registrada{boletas.length !== 1 ? "s" : ""}
        </p>

        <button onClick={onCerrar} style={{ marginTop: 14 }}>
          Cerrar
        </button>
      </div>
    </div>
  );
};