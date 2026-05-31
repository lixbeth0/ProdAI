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