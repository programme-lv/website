import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { StyledEngineProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })
const cache = createCache({
	key: 'css',
	prepend: true,
});

export default function App({ Component, pageProps }: AppProps) {

	return (
		<CacheProvider value={cache}>
			<StyledEngineProvider injectFirst>
				<div className={inter.className}>
					<UserProvider>
						<Component {...pageProps} />
					</UserProvider>
				</div>
			</StyledEngineProvider>
		</CacheProvider>
	)
}
