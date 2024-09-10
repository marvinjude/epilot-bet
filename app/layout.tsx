import type { Metadata } from "next";

import "./globals.css";
import { instrumentSans } from "./fonts";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${instrumentSans.className}`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
