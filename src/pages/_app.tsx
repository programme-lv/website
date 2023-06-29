import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app'
import { UserProvider } from '@/contexts/UserContext'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })
const theme = 'mytheme'

export default function App({ Component, pageProps }: AppProps) {

	useEffect(() => {
	  const body = document.body;
	  body.setAttribute("data-theme", theme);
	}, []);

	return <div className={inter.className}>
		<UserProvider>
			<Component {...pageProps} />
		</UserProvider>
	</div>
}
