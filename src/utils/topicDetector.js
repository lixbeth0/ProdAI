export function detectTopic(text) {

  const msg = text.toLowerCase();

  if (
    msg.includes("redes") ||
    msg.includes("tcp") ||
    msg.includes("ip") ||
    msg.includes("subnet")
  ) {
    return "Redes";
  }

  if (
    msg.includes("programacion") ||
    msg.includes("javascript") ||
    msg.includes("react")
  ) {
    return "Programación";
  }

  if (
    msg.includes("matematicas") ||
    msg.includes("algebra")
  ) {
    return "Matemáticas";
  }

  return "General";
}