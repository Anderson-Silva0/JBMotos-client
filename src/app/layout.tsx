import '@/app/globals.css'
import { Inter } from 'next/font/google'
import 'toastr/build/toastr.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JB Motos',
  description: 'Gerenciamento de Oficina Mecânica de Motos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
