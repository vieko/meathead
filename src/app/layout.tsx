import type { Metadata } from 'next'
import { Oxanium, Lora, Space_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const oxaniumSans = Oxanium({
  variable: '--font-oxanium',
  subsets: ['latin'],
})

const loraSerif = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
})

const spaceMono = Space_Mono({
  weight: '400',
  variable: '--font-space-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Project Meathead',
  description:
    'A training program designed to plan, track and optimize your meathead goals',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${oxaniumSans.variable} ${loraSerif.variable} ${spaceMono.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
