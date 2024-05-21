"use client"
import { Box, Button, IconButton, InputAdornment, Stack, TextField } from "@mui/material"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useLazyLoginQuery } from "@/lib/features/user/userApi"
import { useRouter } from "next/navigation"

const LoginPage = () => {
  const { t } = useTranslation()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [login] = useLazyLoginQuery()
  const router = useRouter()
  return (
    <Stack spacing={2}>
      <TextField sx={{ maxWidth: 350 }} label={t("username")} variant="outlined" onChange={(event) => setUsername(event.target.value)} value={username} />
      <TextField
        sx={{ maxWidth: 350 }}
        type={showPassword ? "text" : "password"}
        label={t("password")}
        variant="outlined"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box>
        <Button
          onClick={async () => {
            try {
              await login({ username, password })
              router.push("/")
            } catch {
              console.log("Username or password invalid")
            }
          }}
        >
          {t("login")}
        </Button>
      </Box>
    </Stack>
  )
}

export default LoginPage
