export function generatePlan(tasks) {

  const todayDate = new Date().toISOString().split("T")[0];

  const today = tasks.filter(
    t => t.dueDate === todayDate && !t.completed
  );

  const urgent = tasks.filter(
    t => t.priority === "Alta" && !t.completed
  );

  const next = tasks
    .filter(t => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  return {
    today,
    urgent,
    next
  };
}