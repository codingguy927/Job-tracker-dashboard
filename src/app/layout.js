import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css"; // use alias or keep as is if it works
import Navbar from "@/components/Navbar"; // ✅ FIXED: now points to correct folder

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Job Tracker Dashboard",
  description: "Track and organize your job applications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
