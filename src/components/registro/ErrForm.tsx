type Props = {
  errores: string[];
};

export const ErroresFormulario = ({ errores }: Props) => {
  if (errores.length === 0) return null;

  return (
    <div className="error">
      <p>Revise lo siguiente:</p>
      <ul>
        {errores.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  );
};