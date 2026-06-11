type Props = {
  valor: string;
  max: number;
};

export const ContadorCampo = ({ valor, max }: Props) => {
  return (
    <small className="contadorCampo">
      {Math.max(max - valor.length, 0)} caracteres restantes
    </small>
  );
};