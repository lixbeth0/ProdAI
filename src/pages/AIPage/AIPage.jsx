import "./AIPage.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import AIChat from "../../components/ai/AIChat";
import { useEffect } from "react";

export default function AIPage() {

  useEffect(() => {
    document.title = "Asistente | ProdAI";
  }, []);

  return (
    <DashboardLayout>
      <div className="ai-page">

        <div className="ai-chat-wrapper">

          <AIChat />

        </div>

      </div>
    </DashboardLayout>
  );
}