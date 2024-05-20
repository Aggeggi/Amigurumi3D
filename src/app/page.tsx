"use client"
import React, { useMemo, useState } from "react"
import { Canvas } from "@react-three/fiber"
import Amigurumi from "@/component/Amigurumi"
import { Autocomplete, Box, Stack, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"
import type { AmigurumisResponse } from "@/lib/features/amigurumi/amigurumiApi"
import { useGetAmigurumiByIdQuery, useGetAmigurumisQuery } from "@/lib/features/amigurumi/amigurumiApi"

export default function Home() {
  const { t } = useTranslation()
  const { data: amigurumis } = useGetAmigurumisQuery()
  const [amigurumi, setAmigurumi] = useState<AmigurumisResponse | undefined>(undefined)
  const { data: amigurumiPattern } = useGetAmigurumiByIdQuery(amigurumi?.id ?? "", { skip: !amigurumi?.id })

  const canvas = useMemo(() => {
    if (!amigurumiPattern) {
      return <></>
    }
    return <Amigurumi amigurumi={amigurumiPattern}></Amigurumi>
  }, [amigurumiPattern])

  return (
    <Stack>
      <Autocomplete
        options={amigurumis ?? []}
        sx={{ width: 300 }}
        onChange={(_event, value) => {
          setAmigurumi(value || undefined)
        }}
        value={amigurumi}
        renderInput={(params) => <TextField {...params} label={t("selectPattern")} />}
        getOptionLabel={(amigurumi) => amigurumi.name ?? ""}
      />
      <Box>
        <Canvas style={{ width: "100vw", height: "100vh" }} camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, -5] }}>
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
          {canvas}
        </Canvas>
      </Box>
    </Stack>
  )
}
