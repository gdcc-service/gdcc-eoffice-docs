import React from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import { EditorProviderWrapper } from "@/components/providers/editor-provider";
import "./global.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <EditorProviderWrapper>{children}</EditorProviderWrapper>
        </RootProvider>
      </body>
    </html>
  );
}
