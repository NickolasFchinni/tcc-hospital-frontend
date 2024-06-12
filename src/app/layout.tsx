import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Menu from "@/components/Menu/menu"
import Header from "@/components/Header/header"
import Head from 'next/head';
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hospital",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <body className={inter.className}>
      <AuthProvider>
        <div className="flex w-full">
          <Menu></Menu>
          <div className="h-[100vh] w-full bg-[#F1F3F6]">
            <Header></Header>
            {children}
          </div>
        </div>
        </AuthProvider>
      </body>
    </html>
  )
}
