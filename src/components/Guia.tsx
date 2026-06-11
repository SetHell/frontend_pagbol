import { guiaArticulos } from "./guia/guiaData";

export const Guia = () => {
  return (
    <section className="panel">
        <h1>BOLETA DE INFRACCIÓN DE TRÁNSITO</h1>
      <div className="guiaHoja">
        <h2>GUÍA DEL FUNCIONARIO POLICIAL</h2>
        {guiaArticulos.map((articulo) => (
          <div className="guiaArticulo" key={articulo.art}>
            <h3>
              {articulo.art}&nbsp;&nbsp; {articulo.titulo}
            </h3>

            {articulo.items.map((item) => (
              <div className="guiaItem" key={`${articulo.art}-${item.num}`}>
                <span>{item.num}</span>
                <p>{item.texto}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};