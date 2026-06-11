import { FormularioBoleta } from "./registro/FormBol";
import { OcrPanel } from "./registro/OcrPanel";
import { ErroresFormulario } from "./registro/ErrForm";
import { BotonesRegistro } from "./registro/BotnsReg";
import { useRegistrarBoleta } from "./registro/useRegBol";
import type { RegistrarProps } from "./registro/regTyps";
import "./css/registro.css";

export const Registrar = (props: RegistrarProps) => {
  const {
    dat,
    otros,
    err,
    guardando,
    vehiculoMsg,
    ocrAct,
    ocrImg,
    ocrMsg,
    ocrRev,
    cambiar,
    cambiarOtro,
    autocompletarVehiculoPorPlaca,
    enviarOCR,
    setOcrAct,
    registrar,
    limpiar,
  } = useRegistrarBoleta(props);

  const editando = !!props.editando;

  return (
    <section className="panel">
      <h1>{editando ? "Editar Boleta" : "Registrar Boleta"}</h1>

      <div className="boletaFisica">
        <div className="boletaHead">
          <h2>BOLETA DE INFRACCIÓN</h2>
          <strong>SERIE B-24</strong>
        </div>

        <FormularioBoleta
          dat={dat}
          otros={otros}
          editando={editando}
          vehiculoMsg={vehiculoMsg}
          cambiar={cambiar}
          cambiarOtro={cambiarOtro}
          autocompletarVehiculoPorPlaca={() => autocompletarVehiculoPorPlaca()}
        />

        {!editando && (
          <OcrPanel
            activo={ocrAct}
            imagen={ocrImg}
            mensaje={ocrMsg}
            camposRevisar={ocrRev}
            cambiarActivo={() => setOcrAct((p) => !p)}
            enviarArchivo={enviarOCR}
          />
        )}

        <ErroresFormulario errores={err} />

        <BotonesRegistro
          guardando={guardando}
          editando={editando}
          registrar={registrar}
          limpiar={limpiar}
        />
      </div>
    </section>
  );
};