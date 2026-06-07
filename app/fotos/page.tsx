import type { Metadata } from "next";
import PhotoUploadPage from "@/components/PhotoUploadPage";

export const metadata: Metadata = {
  title: "Enviar Fotos | Vitória & Patrik",
  description:
    "Página para convidados enviarem fotos do casamento de Vitória e Patrik sem login.",
};

export default function FotosPage() {
  return <PhotoUploadPage />;
}
