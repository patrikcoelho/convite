import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presentes | Vitória & Patrik",
  description:
    "Ideias de presentes para Vitória e Patrik, com contribuições por Pix ou cartão.",
};

export default function PresentesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
