type Props = {
  activo: boolean;
  imagen: string;
  mensaje: string;
  camposRevisar: string[];
  cambiarActivo: () => void;
  enviarArchivo: (file: File) => void;
};

export const OcrPanel = ({
  activo,
  imagen,
  mensaje,
  camposRevisar,
  cambiarActivo,
  enviarArchivo,
}: Props) => {
  const manejarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) enviarArchivo(f);
  };

  return (
    <div className="ocrBox">
      <button type="button" className="btnOCR" onClick={cambiarActivo}>
        Activar OCR <span>BETA</span>
      </button>

      {activo && (
        <div className="ocrPanel">
          <p>
            Sube una imagen o toma una foto de la boleta. El OCR intentará
            llenar el formulario, pero podrás corregir los datos antes de
            registrar.
          </p>

          <div className="ocrInputs">
            <label className="ocrInputLabel">
              Subir imagen
              <input
                type="file"
                accept="image/*"
                onChange={manejarArchivo}
              />
            </label>

            <label className="ocrInputLabel">
              Tomar foto
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={manejarArchivo}
              />
            </label>
          </div>

          {mensaje && <strong>{mensaje}</strong>}

          {camposRevisar.length > 0 && (
            <div className="ocrAviso">
              <p>Campos a revisar:</p>
              <ul>
                {camposRevisar.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {imagen && <img src={imagen} alt="ocr-preview" />}
        </div>
      )}
    </div>
  );
};
