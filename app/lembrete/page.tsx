import type { Metadata } from "next";
import WeddingReminderPage from "@/components/WeddingReminderPage";

export const metadata: Metadata = {
  title: "Lembrete do Casamento | Vitória & Patrik",
  description:
    "Lembrete do casamento de Vitória e Patrik com dia, horário, local e informações sobre presentes via Pix.",
};

export default function ReminderPage() {
  return <WeddingReminderPage />;
}
