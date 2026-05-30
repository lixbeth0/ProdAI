
const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

export async function askAI(messages) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres tutor inteligente, tutor académico. NO resuelves tareas completas, solo explicas paso a paso y das recomendaciones." +
            `IMPORTANTE:
            - Usa markdown
            - Usa títulos
            - Usa listas
            - Usa emojis moderados
            - Usa párrafos cortos
            - Separa ideas con espacios
            - NO hagas bloques enormes de texto
            - Responde de forma moderna tipo ChatGPT
            `
            },
        ...messages
      ]
    })
  });

  const data = await res.json();

  return data.choices?.[0]?.message?.content || "Sin respuesta";
}