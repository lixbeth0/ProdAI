// =========================================
// API KEY
// =========================================
const API_KEY =
  process.env.REACT_APP_OPENROUTER_API_KEY;

// =========================================
// GENERAR QUIZ
// =========================================

export async function generateQuiz(content) {

  try {
    
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        },

        body: JSON.stringify({

          model: "openai/gpt-4o-mini",

          messages: [

            {
              role: "system",

              content: `
Eres un generador de cuestionarios académicos.

INSTRUCCIONES OBLIGATORIAS:

- Genera exactamente 10 preguntas.
- Cada pregunta debe tener 4 opciones.
- Solo una opción debe ser correcta.
- Devuelve ÚNICAMENTE JSON.
- No uses markdown.
- No uses bloques de código.
- No escribas texto antes o después del JSON.

Formato obligatorio:

[
  {
    "question":"Pregunta",
    "options":[
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer":0
  }
]
`
            },

            {
              role: "user",
              content
            }

          ],

          temperature: 0.5,
          max_tokens: 2000

        })
      }
    );

    if (!response.ok) {

      throw new Error(
        `Error HTTP: ${response.status}`
      );

    }

    const data = await response.json();

    const result =
      data?.choices?.[0]?.message?.content;

    if (!result) {

      throw new Error(
        "No se recibió contenido."
      );

    }

    return result.trim();

  } catch (error) {

    console.error(
      "Error generando quiz:",
      error
    );

    throw error;

  }

}