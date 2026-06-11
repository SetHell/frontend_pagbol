import type { Dispatch, SetStateAction } from "react";
import type { Agente, BoletaReg } from "../types";

export type RegistrarProps = {
  agente: Agente;
  setBol: Dispatch<SetStateAction<BoletaReg[]>>;
  editando?: BoletaReg | null;
  cancelarEdicion?: () => void;
};

export type FormBol = {
  nro_boleta: string;
  fecha: string;
  hora: string;
  placa: string;
  nro_lic: string;
  categ_lic: string;
  nom_conductor: string;
  tip_vehi: string;
  marca: string;
  color: string;
  art: string;
  nro_infr: string;
  lugar: string;
  zona: string;
  observ: string;
};

export type OtrosForm = {
  tip_vehi: string;
  marca: string;
  color: string;
  art: string;
};

export type SelectAplicado = {
  sel: string;
  otro: string;
};