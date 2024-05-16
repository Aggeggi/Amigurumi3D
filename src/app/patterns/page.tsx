"use client"
import { Autocomplete, Stack, TextField, Typography } from "@mui/material"
import { amigurumis } from "../../../examples/baseAmigurumi"
import { useMemo, useState } from "react"
import type { STITCH_TYPE } from "@/lib/features/amigurumi/amigurumiSlice"
import { useTranslation } from "react-i18next"

const PatternsPage = () => {
  const { t } = useTranslation()
  const [amigurumi, setAmigurumi] = useState<{
    name: string
    value: {
      layers: STITCH_TYPE[][]
    }
  } | null>(amigurumis[0])

  const layers = useMemo(() => {
    if (!amigurumi) {
      return <></>
    }
    return (
      <Stack spacing={2}>
        {amigurumi.value.layers.map((layer, i) => (
          <>
            <Typography variant="h6">{t("layer") + " " + (i + 1) + ":"}</Typography>
            <Stack direction={"row"} spacing={2}>
              {layer.map((stitch, h) => (
                <Typography key={"stitch" + h}>{t(stitch)}</Typography>
              ))}
            </Stack>
          </>
        ))}
      </Stack>
    )
  }, [amigurumi, t])
  return (
    <Stack spacing={2}>
      <Autocomplete
        options={amigurumis}
        sx={{ width: 300 }}
        onChange={(_event, value) => {
          setAmigurumi(value)
        }}
        value={amigurumi}
        renderInput={(params) => <TextField {...params} label={t("selectPattern")} />}
        getOptionLabel={(amigurumi) => amigurumi.name ?? ""}
      />
      {layers}
    </Stack>
  )
}
export default PatternsPage
