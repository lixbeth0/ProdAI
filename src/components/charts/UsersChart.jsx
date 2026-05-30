import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./UsersChart.css";

const data = [
  { name: "Ene", users: 30 },
  { name: "Feb", users: 45 },
  { name: "Mar", users: 60 },
  { name: "Abr", users: 90 },
  { name: "May", users: 120 },
];

function UsersChart() {
  return (
    <div className="chart-card">

      <h3>Usuarios registrados</h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={data}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="users"
            stroke="#7c3aed"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default UsersChart;