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
import NextNProgress from 'nextjs-progressbar';
import Head from 'next/head';

const inter = Inter({subsets: ['latin']})
const cache = createCache({
    key: 'css',
    prepend: true,
});

const materialTheme = materialExtendTheme()

export default function App({Component, pageProps}: AppProps) {

    return (
        <CacheProvider value={cache}>
            <Head>
                <title>programme.lv</title>
                <meta name="description" content="Programme.lv - Latvijas kodēšanas mācību platforma skolēniem un studentiem. Mācību materiāls un praktiski uzdevumi." />
                <meta name="keywords" content="kodēšana, programmēšana, mācības, izglītība, Latvija, skolēni, studenti, skolotāji, atvērtā koda, programmēšanas izaicinājumi" />
                <link rel="canonical" href="https://programme.lv" />

                {/* Open Graph tags */}
                <meta property="og:title" content="Programme.lv - Kodēšanas Mācību Platforma Latvijā" />
                <meta property="og:description" content="Programme.lv ir kodēšanas mācību platforma skolēniem un studentiem Latvijā. Uzlabojiet savas prasmes ar mūsu bagātīgo materiālu un praktiskajiem uzdevumiem." />
                <meta property="og:url" content="https://www.programme.lv" />
                <meta property="og:type" content="website" />

                {/* Additional tags for enhanced SEO */}
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Krišjānis Petručeņa" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <StyledEngineProvider injectFirst>

                <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
                <JoyCssVarsProvider theme={muiTheme}>
                    <div className={inter.className}>
                        <UserProvider>
                            <NextNProgress showOnShallow={false}/>
                            <Component {...pageProps} />
                        </UserProvider>
                    </div>

                </JoyCssVarsProvider>
                </MaterialCssVarsProvider>
            </StyledEngineProvider>
        </CacheProvider>
    )
}
