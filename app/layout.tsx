import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CODE VIVANT · Votre portrait intérieur",
  description:
    "Mettez en lumière le mécanisme intérieur qui vous protège encore, mais vous retient de vivre plus pleinement.",
  metadataBase: new URL("https://questions.malbrunot.me"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
