import type { ChangeEvent } from "react";
import { CampoTexto } from "./CampText";

type Props = {
  label: string;
  name: string;
  value: string;
  opciones: string[];
  otroValue: string;
  otroLabel: string;
  maxOtro: number;
  onChangeSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  onChangeOtro: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const SelectConOtro = ({
  label,
  name,
  value,
  opciones,
  otroValue,
  otroLabel,
  maxOtro,
  onChangeSelect,
  onChangeOtro,
}: Props) => {
  return (
    <>
      <label>{label}</label>

      <select name={name} value={value} onChange={onChangeSelect}>
        <option value="">SELECCIONAR</option>

        {opciones.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}

        <option value="OTRO">OTRO</option>
      </select>

      {value === "OTRO" && (
        <CampoTexto
          label={otroLabel}
          name={name}
          value={otroValue}
          max={maxOtro}
          onChange={onChangeOtro}
        />
      )}
    </>
  );
};