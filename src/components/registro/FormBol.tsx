import type { ChangeEvent } from "react";
import { CampoTexto } from "./CampText";
import { SelectConOtro } from "./SlctOtro";
import { articulos, colores, LIM, marcas, tipos } from "./regConst";
import type { FormBol, OtrosForm } from "./regTyps";

type Props = {
  dat: FormBol;
  otros: OtrosForm;
  editando: boolean;
  vehiculoMsg: string;
  cambiar: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  cambiarOtro: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  autocompletarVehiculoPorPlaca: () => void;
};

export const FormularioBoleta = ({
  dat,
  otros,
  editando,
  vehiculoMsg,
  cambiar,
  cambiarOtro,
  autocompletarVehiculoPorPlaca,
}: Props) => {
  return (
    <div className="gridForm">
      <CampoTexto
        label="Nro Boleta"
        name="nro_boleta"
        value={dat.nro_boleta}
        onChange={cambiar}
        max={LIM.nro_boleta}
        inputMode="numeric"
        disabled={editando}
      />

      <label>Fecha</label>
      <input type="date" name="fecha" value={dat.fecha} onChange={cambiar} />

      <label>Hora</label>
      <input type="time" name="hora" value={dat.hora} onChange={cambiar} />

      <CampoTexto
        label="Placa N°"
        name="placa"
        value={dat.placa}
        onChange={cambiar}
        max={LIM.placa}
        onBlur={editando ? undefined : autocompletarVehiculoPorPlaca}
        disabled={editando}
      />

      {vehiculoMsg && <p className="avisoVehiculo">{vehiculoMsg}</p>}

      <CampoTexto
        label="Licencia N°"
        name="nro_lic"
        value={dat.nro_lic}
        onChange={cambiar}
        max={LIM.nro_lic}
        inputMode="numeric"
      />

      <CampoTexto
        label="Categoría Licencia"
        name="categ_lic"
        value={dat.categ_lic}
        onChange={cambiar}
        max={LIM.categ_lic}
      />

      <CampoTexto
        label="Nombre del Conductor"
        name="nom_conductor"
        value={dat.nom_conductor}
        onChange={cambiar}
        max={LIM.nom_conductor}
      />

      <SelectConOtro
        label="Tipo"
        name="tip_vehi"
        value={dat.tip_vehi}
        opciones={tipos}
        otroValue={otros.tip_vehi}
        otroLabel="Otro Tipo"
        maxOtro={LIM.tip_vehi}
        onChangeSelect={cambiar}
        onChangeOtro={cambiarOtro}
      />

      <SelectConOtro
        label="Marca"
        name="marca"
        value={dat.marca}
        opciones={marcas}
        otroValue={otros.marca}
        otroLabel="Otra Marca"
        maxOtro={LIM.marca}
        onChangeSelect={cambiar}
        onChangeOtro={cambiarOtro}
      />

      <SelectConOtro
        label="Color"
        name="color"
        value={dat.color}
        opciones={colores}
        otroValue={otros.color}
        otroLabel="Otro Color"
        maxOtro={LIM.color}
        onChangeSelect={cambiar}
        onChangeOtro={cambiarOtro}
      />

      <SelectConOtro
        label="Artículo"
        name="art"
        value={dat.art}
        opciones={articulos}
        otroValue={otros.art}
        otroLabel="Otro Artículo"
        maxOtro={LIM.art}
        onChangeSelect={cambiar}
        onChangeOtro={cambiarOtro}
      />

      <CampoTexto
        label="Num."
        name="nro_infr"
        value={dat.nro_infr}
        onChange={cambiar}
        max={LIM.nro_infr}
        inputMode="numeric"
      />

      <CampoTexto
        label="Lugar / Calle"
        name="lugar"
        value={dat.lugar}
        onChange={cambiar}
        max={LIM.lugar}
      />

      <CampoTexto
        label="Zona"
        name="zona"
        value={dat.zona}
        onChange={cambiar}
        max={LIM.zona}
      />

      <CampoTexto
        label="Observaciones"
        name="observ"
        value={dat.observ}
        onChange={cambiar}
        max={LIM.observ}
        textarea
      />
    </div>
  );
};