import type { PaletteMode, Theme } from "@mui/material"
import { createTheme } from "@mui/material"
import { itIT } from "@mui/material/locale"
import { deepmerge } from "@mui/utils"

const commonTheme = {
  components: {
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
  },
}

const lightTheme = {
  palette: {
    mode: "light",
  },
}

const darkTheme = {
  palette: {
    mode: "dark",
  },
}

export const createCustomTheme = (mode: PaletteMode, additional?: Partial<Theme>) => {
  switch (mode) {
    case "light":
      return createTheme(deepmerge(deepmerge(commonTheme, lightTheme), additional), itIT)
    case "dark":
      return createTheme(deepmerge(deepmerge(commonTheme, darkTheme), additional), itIT)
  }
}

export const defaultTheme = createCustomTheme("light")
