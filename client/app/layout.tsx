import type React from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ReduxProvider } from '@/components/providers/redux-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'FinanceFlow - Personal Finance Manager',
	description: 'Track your accounts, transactions, and financial forecasts',
	generator: 'v0.app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className='font-sans antialiased'>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<ReduxProvider>
						{children}
						<ToastProvider />
					</ReduxProvider>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	)
}
