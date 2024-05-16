"use client"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppBar, Box, Container, CssBaseline, IconButton, StyledEngineProvider, ThemeProvider, Toolbar, Typography, useMediaQuery } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import StoreProvider from "@/component/StoreProvider"
import i18n from "i18next"
import { initReactI18next, useTranslation } from "react-i18next"

import itTranslations from "../assets/i18n/it.json"
import enTranslations from "../assets/i18n/en.json"
import CustomDrawer from "@/component/Drawer"
import { useMemo, useState } from "react"
import { useAppBarHeight } from "@/lib/hooks/useAppBarHeigth"
import { createCustomTheme } from "@/lib/theme"

export const defaultNS = "enTranslations"
export const resources = {
  it: {
    itTranslations,
  },
  en: {
    enTranslations,
  },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  ns: ["enTranslations"],
  defaultNS,
  fallbackLng: "it",
})

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { t } = useTranslation()
  const [drawerOpen, setDraweOpen] = useState(false)
  const appBarHeigth = useAppBarHeight()
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const theme = useMemo(() => createCustomTheme(prefersDarkMode ? "dark" : "light"), [prefersDarkMode])
  return (
    <html>
      <body className={inter.className}>
        <StoreProvider>
          <StyledEngineProvider injectFirst>
            <CssBaseline />
            <ThemeProvider theme={theme}>
              <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                  <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setDraweOpen((prev) => !prev)}>
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      {t("title")}
                    </Typography>
                  </Toolbar>
                </AppBar>
              </Box>
              <CustomDrawer open={drawerOpen} handleDrawerClick={() => setDraweOpen((prev) => !prev)}></CustomDrawer>

              <Box sx={{ minHeight: appBarHeigth, height: appBarHeigth }} />
              <Container maxWidth="xl">{children}</Container>
            </ThemeProvider>
          </StyledEngineProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
