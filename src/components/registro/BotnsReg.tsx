type Props = {
  guardando: boolean;
  editando: boolean;
  registrar: () => void;
  limpiar: () => void;
};

export const BotonesRegistro = ({
  guardando,
  editando,
  registrar,
  limpiar,
}: Props) => {
  return (
    <>
      <button className="btnRegistrar" onClick={registrar} disabled={guardando}>
        {guardando ? "Guardando..." : editando ? "Actualizar" : "Registrar"}
      </button>

      {editando && (
        <button className="btnCancelar" type="button" onClick={limpiar}>
          Cancelar edición
        </button>
      )}
    </>
  );
};