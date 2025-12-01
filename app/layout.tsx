import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareConnect – Family & Caregiver Dashboard",
  description: "Final project for Advanced React – CareConnect app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100`}>
        {/* NAVIGATION BAR */}
        <header className="border-b border-slate-800 bg-slate-900/80">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
            <span className="font-semibold tracking-tight">
              CareConnect
            </span>

            <nav className="flex gap-4 text-sm">
              <Link href="/dashboard" className="hover:text-emerald-300">
                Dashboard
              </Link>

              <Link href="/tasks" className="hover:text-emerald-300">
                Tasks
              </Link>

              <Link href="/child" className="hover:text-emerald-300">
                Child Profile
              </Link>
            </nav>
          </div>
        </header>

        {/* REDUX PROVIDER WRAPPING THE APP (CLIENT COMPONENT) */}
        <Providers>
          <main className="max-w-4xl mx-auto px-4 py-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
