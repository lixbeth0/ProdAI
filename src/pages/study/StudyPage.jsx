// =========================================
// IMPORTACIONES
// =========================================

import { useState, useEffect} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import { auth } from "../../firebase/firebase";

import {
  generateQuiz
} from "../../services/quizService";

import {
  saveStudySession
} from "../../services/studyService";

import {
  useStudyHistory
} from "../../hooks/useStudyHistory";

import "./StudyPage.css";

import {
  extractTextFromPDF
}
from "../../services/pdfService";


// =========================================
// COMPONENTE
// =========================================

function StudyPage() {


  useEffect(() => {
    document.title = "Área de estudio | ProdAI";
  }, []);

  // =========================================
  // ESTADOS
  // =========================================

  // Contenido que el usuario pega
  const [studyContent, setStudyContent] =
    useState("");

  const [pdfFile, setPdfFile] =
    useState(null);

  // Preguntas generadas por IA
  const [questions, setQuestions] =
    useState([]);

  // Estado de carga
  const [loading, setLoading] =
    useState(false);

  // Pregunta actual
  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  // Respuestas del usuario
  const [answers, setAnswers] =
    useState([]);

  // Saber si terminó el quiz
  const [quizFinished, setQuizFinished] =
    useState(false);

  // Resultado obtenido
  const [score, setScore] =
    useState(0);

  // Historial de estudio
  const {
    sessions,
    loading: historyLoading
  } = useStudyHistory();

  // =========================================
// ESTADÍSTICAS
// =========================================

const totalSessions =
  sessions.length;

const averageScore =
  totalSessions > 0
    ? Math.round(
        sessions.reduce(
          (acc, session) =>
            acc +
            session.percentage,
          0
        ) / totalSessions
      )
    : 0;

const bestScore =
  totalSessions > 0
    ? Math.max(
        ...sessions.map(
          (session) =>
            session.percentage
        )
      )
    : 0;


  // =========================================
  // CALCULAR RESULTADO
  // =========================================

  const calculateScore = (
    userAnswers
  ) => {

    let correct = 0;

    questions.forEach(
      (
        question,
        index
      ) => {

        if (
          userAnswers[index] ===
          question.correctAnswer
        ) {
          correct++;
        }

      }
    );

    return correct;

  };


  // =========================================
  // GENERAR QUIZ
  // =========================================

  const handleGenerateQuiz =
    async () => {

     if (
        !studyContent.trim() &&
        !pdfFile
      ) {

        alert(
          "Ingresa texto o sube un PDF."
        );

        return;
      }

      try {

        setLoading(true);

          let contentToStudy =
            studyContent;

            console.log(
            "studyContent:",
            studyContent
          );

          console.log(
            "pdfFile:",
            pdfFile
          );

            // Si existe PDF
           if (pdfFile) {

              console.log(
                "Extrayendo texto del PDF..."
              );

              contentToStudy =
                await extractTextFromPDF(
                  pdfFile
                );

              console.log(
                contentToStudy
              );
            }

            const response =
            await generateQuiz(
                contentToStudy
            );

        console.log(
          "Respuesta IA:",
          response
        );

        // Limpiar posible markdown
        const cleanedResponse =
          response
            .replace(
              /```json/g,
              ""
            )
            .replace(
              /```/g,
              ""
            )
            .trim();

        const parsedQuestions =
          JSON.parse(
            cleanedResponse
          );

        // Guardar preguntas
        setQuestions(
          parsedQuestions
        );

        // Reiniciar quiz
        setCurrentQuestion(0);

        setAnswers([]);

        setQuizFinished(false);

        setScore(0);

      } catch (error) {

        console.error(
          "Error generando quiz:",
          error
        );

        alert(
          "No se pudo generar el quiz."
        );

      } finally {

        setLoading(false);

      }

    };


  // =========================================
  // RESPONDER PREGUNTA
  // =========================================

  const handleAnswer =
    async (
      selectedOption
    ) => {

      const newAnswers = [
        ...answers,
        selectedOption
      ];

      setAnswers(
        newAnswers
      );

      // Última pregunta
      if (
        currentQuestion ===
        questions.length - 1
      ) {

        const finalScore =
          calculateScore(
            newAnswers
          );

        setScore(
          finalScore
        );

        // Guardar en Firebase
        try {

          if (
            auth.currentUser
          ) {

            await saveStudySession(
              auth.currentUser.uid,
              {

                score:
                  finalScore,

                total:
                  questions.length,

                percentage:
                  Math.round(
                    (
                      finalScore /
                      questions.length
                    ) * 100
                  ),

                topic:
                  studyContent
                    .substring(
                      0,
                      50
                    )

              }
            );

          }

        } catch (error) {

          console.error(
            "Error guardando sesión:",
            error
          );

        }

        setQuizFinished(
          true
        );

        return;

      }

      // Siguiente pregunta
      setCurrentQuestion(
        (
          prev
        ) => prev + 1
      );

    };


  // =========================================
  // RENDER
  // =========================================

  return (

    <DashboardLayout>

      <div
        className="study-container"
      >

        {/* =========================
            TÍTULO
        ========================= */}

        <h1
          className="study-title"
        >
          📚 Área de Estudio
        </h1>


        {/* =========================
            ENTRADA DE TEXTO
        ========================= */}

        <textarea

          className="study-textarea"

          value={
            studyContent
          }

          onChange={
            (e) =>
              setStudyContent(
                e.target.value
              )
          }

          placeholder="
Pega aquí tus apuntes, resumen o tema de estudio...
"

          rows={12}

        />

        {/* =========================
            SUBIR PDF
        ========================= */}

        <div className="pdf-upload">

        <label>
            📄 Subir PDF
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {

            const file =
              e.target.files[0];

            console.log(
              "PDF seleccionado:",
              file
            );

            setPdfFile(file);

          }}
        />

        {
            pdfFile && (
            <p>
                Archivo:
                {" "}
                {pdfFile.name}
            </p>
            )
        }

        </div>


        {/* =========================
            BOTÓN GENERAR
        ========================= */}

        <button

          className="study-button"

          onClick={
            handleGenerateQuiz
          }

          disabled={
            loading
          }

        >

          {
            loading
              ? "Generando..."
              : "Generar Quiz"
          }

        </button>


        {/* =========================
            QUIZ
        ========================= */}

        {
          questions.length > 0 &&
          !quizFinished && (

            <div
              className="quiz-container"
            >

              <h2>

                Pregunta

                {" "}

                {
                  currentQuestion + 1
                }

                {" de "}

                {
                  questions.length
                }

              </h2>

              <h3>

                {
                  questions[
                    currentQuestion
                  ].question
                }

              </h3>

              {

                questions[
                  currentQuestion
                ].options.map(
                  (
                    option,
                    index
                  ) => (

                    <button

                      key={index}

                      className="
quiz-option
"

                      onClick={
                        () =>
                          handleAnswer(
                            index
                          )
                      }

                    >

                      {option}

                    </button>

                  )
                )

              }

            </div>

          )
        }


        {/* =========================
            RESULTADO
        ========================= */}

        {
          quizFinished && (

            <div
              className="
study-result
"
            >

              <h2>
                 Resultado
              </h2>

              <h3>

                {
                  score
                }

                {" / "}

                {
                  questions.length
                }

              </h3>

              <h3>

                {
                  Math.round(
                    (
                      score /
                      questions.length
                    ) * 100
                  )
                }

                %

              </h3>

            </div>

          )
        }

        {/* =========================
                ESTADÍSTICAS
            ========================= */}

            <div
            className="stats-card"
            >

            <h2>
                📊 Estadísticas
            </h2>

            <p>
                Sesiones:
                {" "}
                {totalSessions}
            </p>

            <p>
                Promedio:
                {" "}
                {averageScore}%
            </p>

            <p>
                Mejor resultado:
                {" "}
                {bestScore}%
            </p>

            </div>

        </div>
        </DashboardLayout>

  );

}

export default StudyPage;