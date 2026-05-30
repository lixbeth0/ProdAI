export function analizarDatos(datos) {
  if (!datos.length) return {};

  // 🔹 Mejor hora
  const mejor = datos.reduce((a, b) =>
    b.productividad > a.productividad ? b : a
  );

  // 🔹 Promedio general
  const promedio =
    datos.reduce((acc, d) => acc + d.productividad, 0) / datos.length;

  // 🔹 Último vs anterior (tendencia)
  const ultimo = datos[datos.length - 1];
  const anterior = datos[datos.length - 2];

  let cambio = 0;
  let tendencia = "estable";

  if (anterior) {
    cambio = ultimo.productividad - anterior.productividad;

    if (cambio > 0) tendencia = "subiendo";
    else if (cambio < 0) tendencia = "bajando";
  }

  // 🔹 Mensaje inteligente
  let mensaje = "";

  if (promedio < 70) {
    mensaje = "🔴 Tu productividad general es baja";
  } else {
    mensaje = "🟢 Buen rendimiento general";
  }

  // 🔹 Insight adicional
  let insightTendencia = "";

  if (tendencia === "bajando") {
    insightTendencia = "⚠️ Tu rendimiento ha bajado recientemente";
  } else if (tendencia === "subiendo") {
    insightTendencia = "🚀 Estás mejorando tu rendimiento";
  }

  return {
    mejorHora: mejor.hora,
    promedio: promedio.toFixed(1),
    tendencia,
    cambio,
    mensaje,
    insightTendencia,
  };
}