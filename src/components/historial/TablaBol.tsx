import type { BoletaReg } from "../types";
import { fecha, valor } from "./histutils";

type Props = {
  boletas: BoletaReg[];
  setSel: (boleta: BoletaReg) => void;
  editarBoleta: (boleta: BoletaReg) => void;
  eliminar: (nro_boleta: string) => void;
};

export const TablaBol = ({
  boletas,
  setSel,
  editarBoleta,
  eliminar,
}: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Boleta</th>
          <th>Placa</th>
          <th>Conductor</th>
          <th>Tipo</th>
          <th>Marca</th>
          <th>Artículo</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {boletas.map((b) => (
          <tr key={b.nro_boleta}>
            <td>{b.nro_boleta}</td>
            <td>{b.placa}</td>
            <td>{valor(b.nom_conductor)}</td>
            <td>{b.tip_vehi}</td>
            <td>{b.marca}</td>
            <td>
              {b.art} - {b.nro_infr}
            </td>
            <td>{fecha(b.fecha)}</td>
            <td>
              <button onClick={() => setSel(b)}>Ver</button>
              <button onClick={() => editarBoleta(b)}>Editar</button>
              <button onClick={() => eliminar(b.nro_boleta)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};