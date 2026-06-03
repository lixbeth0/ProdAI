export const getCourses = async (token) => {
  const res = await fetch(
    "https://classroom.googleapis.com/v1/courses",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  return data.courses || [];
};

export const getCourseWork = async (courseId, token) => {
  const res = await fetch(
    `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  return data.courseWork || [];
};

export const getStudentSubmissions = async (
  courseId,
  courseWorkId,
  token
) => {

  const res = await fetch(
    `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  console.log(
    "Respuesta studentSubmissions:",
    data
  );

  return data.studentSubmissions || [];
};