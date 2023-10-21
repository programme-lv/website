
import { extendTheme } from '@mui/joy/styles';

/*
Green - #179E7E
Dark blue - #003F87
Light blue - #0066FF
Soft gray - #F8F8F8
Charcoal - #333333
Golden - #F2B135
 */

const theme = extendTheme({
    "colorSchemes": {
        "light": {
            "palette": {
                "primary": {
                    "50": "#eff6ff",
                    "100": "#dbeafe",
                    "200": "#bfdbfe",
                    "300": "#93c5fd",
                    "400": "#60a5fa",
                    "500": "#0066FF", // <-- modified
                    "600": "#2563eb",
                    "700": "#1d4ed8",
                    "800": "#1e40af",
                    "900": "#1e3a8a"
                },
                "neutral": {
                    "50": "#fafafa",
                    "100": "#f5f5f5",
                    "200": "#e5e5e5",
                    "300": "#d4d4d4",
                    "400": "#a3a3a3",
                    "500": "#737373",
                    "600": "#525252",
                    "700": "#404040",
                    "800": "#262626",
                    "900": "#171717"
                },
                "danger": {
                    "50": "#fff7ed",
                    "100": "#ffedd5",
                    "200": "#fed7aa",
                    "300": "#fdba74",
                    "400": "#fb923c",
                    "500": "#f97316",
                    "600": "#ea580c",
                    "700": "#c2410c",
                    "800": "#9a3412",
                    "900": "#7c2d12"
                },
                "success": {
                    "50": "#f0fdf4",
                    "100": "#dcfce7",
                    "200": "#bbf7d0",
                    "300": "#86efac",
                    "400": "#4ade80",
                    "500": "#179E7E", // <-- modified
                    "600": "#16a34a",
                    "700": "#15803d",
                    "800": "#166534",
                    "900": "#14532d"
                },
                "warning": {
                    "50": "#fefce8",
                    "100": "#fef9c3",
                    "200": "#fef08a",
                    "300": "#fde047",
                    "400": "#facc15",
                    "500": "#eab308",
                    "600": "#ca8a04",
                    "700": "#a16207",
                    "800": "#854d0e",
                    "900": "#713f12"
                },
                // "brandcolors": {
                //     "dblue": "#003F87",
                //     "lblue" : "#0066FF",
                //     "green": "#179E7E",
                //     "sgray": "#F8F8F8",
                //     "dgray": "#333333",
                //     "gold": "#F2B135"
                // },
            }
        }
    }
})

export default theme;