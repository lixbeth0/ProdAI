function StudyInput({
  studyContent,
  setStudyContent,
  onGenerate
}) {
  return (
    <>
      <textarea
        value={studyContent}
        onChange={(e) => setStudyContent(e.target.value)}
        placeholder="Pega aquí tus apuntes..."
      />

      <button onClick={onGenerate}>
        Generar Quiz
      </button>
    </>
  );
}

export default StudyInput;