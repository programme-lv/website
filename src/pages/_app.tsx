import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
	return <div className={inter.className}>
		<UserProvider>
			<Component {...pageProps} />
		</UserProvider>
	</div>
}
