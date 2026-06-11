import type { BoletaReg } from "../types";
import { fecha, valor } from "./histutils";

type Props = {
  boleta: BoletaReg;
  cerrar: () => void;
};

export const ModalBol = ({ boleta, cerrar }: Props) => {
  return (
    <div className="modal">
      <div className="modalCard">
        <h2>{boleta.nro_boleta}</h2>

        <p>
          <b>Fecha:</b> {fecha(boleta.fecha)} {boleta.hora}
        </p>
        <p>
          <b>Placa:</b> {boleta.placa}
        </p>
        <p>
          <b>Licencia:</b> {valor(boleta.nro_lic)}
        </p>
        <p>
          <b>Categoría:</b> {valor(boleta.categ_lic)}
        </p>
        <p>
          <b>Conductor:</b> {valor(boleta.nom_conductor)}
        </p>
        <p>
          <b>Vehículo:</b> {boleta.tip_vehi}
        </p>
        <p>
          <b>Marca:</b> {boleta.marca}
        </p>
        <p>
          <b>Color:</b> {boleta.color}
        </p>
        <p>
          <b>Artículo:</b> {boleta.art}
        </p>
        <p>
          <b>Número:</b> {boleta.nro_infr}
        </p>
        <p>
          <b>Lugar:</b> {boleta.lugar}
        </p>
        <p>
          <b>Zona:</b> {boleta.zona}
        </p>
        <p>
          <b>Observaciones:</b> {valor(boleta.observ)}
        </p>
        <p>
          <b>Fecha Registro:</b> {boleta.fech_reg}
        </p>

        <button onClick={cerrar}>Cerrar</button>
      </div>
    </div>
  );
};