/* =========================================
   API KEY
========================================= */

const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

/* =========================================
   CONSULTAR IA
========================================= */

export async function askAI(messages) {

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
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

              content: `
Eres ProdAI, un tutor académico.

REGLAS ESTRICTAS (OBLIGATORIAS):

1. NUNCA resuelvas ejercicios completos.
2. NUNCA des respuestas finales directas.
3. NUNCA hagas la tarea del estudiante.
4. SOLO explica el procedimiento general.
5. SOLO da pasos de cómo resolver, no el resultado.
6. Si el usuario pide una operación (ej: 4+6), NO la resuelvas, solo explica cómo hacerlo.
7. Si el usuario insiste, vuelve a explicar el método sin resolver.

ESTILO DE RESPUESTA:

- Usa Markdown
- Usa títulos (# y ##)
- Usa listas de pasos
- Explica de forma simple
- Sé breve pero claro

FORMATO:

# Título del tema

## Explicación general

- Paso 1: ...
- Paso 2: ...
- Paso 3: ...

## Cómo hacerlo tú

Explicación guiada para que el estudiante lo resuelva.

## Consejo

Motiva al estudiante a intentarlo por sí mismo.
`
            },

            ...messages

          ],

          temperature: 0.7,
          max_tokens: 1500

        })

      }
    );

    if (!response.ok) {

      throw new Error(
        `Error HTTP: ${response.status}`
      );

    }

    const data = await response.json();

    const content =
      data?.choices?.[0]?.message?.content ||
      "No se obtuvo respuesta.";

    const cleanedContent = content
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    console.log("RESPUESTA IA:");
    console.log(cleanedContent);

    return cleanedContent;

  } catch (error) {

    console.error(
      "Error consultando OpenRouter:",
      error
    );

    return `
# ❌ Error

No pude comunicarme con la IA.

## Posibles causas

- Problema de conexión
- API Key incorrecta
- Límite de solicitudes alcanzado

Intenta nuevamente.
`;
  }

}