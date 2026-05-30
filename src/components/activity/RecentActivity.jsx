import { useActivities } from "../../hooks/useActivities";
function RecentActivity() {

  const { activities, loading } = useActivities();

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h3>Actividad reciente</h3>

      {activities.map(item => (
        <div key={item.id}>
          {item.message}
        </div>
      ))}

    </div>
  );
}

export default RecentActivity;