import "./AIPage.css";
import DashboardLayout from "../../layouts/DashboardLayout";
import AIChat from "../../components/ai/AIChat";

export default function AIPage() {
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