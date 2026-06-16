import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import TasksPage from "./pages/tasks/TasksPage";
import AIPage from "./pages/AIPage/AIPage";
import ClassroomPage from "./pages/ClassroomPage/ClassroomPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import SettingsPage from "./pages/settings/SettingsPage";
import StudyPage from "./pages/study/StudyPage";

function App() {
  const { user } = useAuth();

  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute user={user}>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute user={user}>
            <TasksPage />
          </ProtectedRoute>
        }
      />
      

      <Route
        path="/ai"
        element={
          <ProtectedRoute user={user}>
            <AIPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
        <ProtectedRoute user={user}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/study"
        element={
          <ProtectedRoute user={user}>
            <StudyPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;