import type { ChangeEvent } from "react";
import { ContadorCampo } from "./ContCamp";

type Props = {
  label: string;
  name: string;
  value: string;
  max: number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "search" | "email" | "url";
  disabled?: boolean;
  textarea?: boolean;
  onBlur?: () => void;
};

export const CampoTexto = ({
  label,
  name,
  value,
  max,
  onChange,
  type = "text",
  inputMode,
  disabled = false,
  textarea = false,
  onBlur,
}: Props) => {
  return (
    <>
      <label>{label}</label>

      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          maxLength={max}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={max}
          inputMode={inputMode}
          disabled={disabled}
        />
      )}

      <ContadorCampo valor={value} max={max} />
    </>
  );
};