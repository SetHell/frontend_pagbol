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
  return (
    <div className="ocrBox">
      <button type="button" className="btnOCR" onClick={cambiarActivo}>
        Activar OCR <span>BETA</span>
      </button>

      {activo && (
        <div className="ocrPanel">
          <p>
            Sube una imagen de la boleta. El OCR intentará llenar el formulario,
            pero podrás corregir los datos antes de registrar.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) enviarArchivo(f);
            }}
          />

          {mensaje && <strong>{mensaje}</strong>}

          {camposRevisar.length > 0 && (
            <div className="ocrAviso">
              <p>Campos recomendados para revisar:</p>
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