import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {Inter} from 'next/font/google'
import {StyledEngineProvider} from '@mui/material/styles';
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {UserProvider} from '@/contexts/UserContext'
import {CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import muiTheme from "@/styles/mui-theme";
import {
    experimental_extendTheme as materialExtendTheme,
    Experimental_CssVarsProvider as MaterialCssVarsProvider,
    THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';

const inter = Inter({subsets: ['latin']})
const cache = createCache({
    key: 'css',
    prepend: true,
});

const materialTheme = materialExtendTheme()

export default function App({Component, pageProps}: AppProps) {

    return (
        <CacheProvider value={cache}>
            <StyledEngineProvider injectFirst>

                <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
                <JoyCssVarsProvider theme={muiTheme}>
                    <div className={inter.className}>
                        <UserProvider>
                            <Component {...pageProps} />
                        </UserProvider>
                    </div>

                </JoyCssVarsProvider>
                </MaterialCssVarsProvider>
            </StyledEngineProvider>
        </CacheProvider>
    )
}
