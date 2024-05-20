"use client"
import { Autocomplete, Stack, TextField, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import type { AmigurumisResponse } from "@/lib/features/amigurumi/amigurumiApi"
import { useGetAmigurumiByIdQuery, useGetAmigurumisQuery } from "@/lib/features/amigurumi/amigurumiApi"

const PatternsPage = () => {
  const { t } = useTranslation()
  const { data: amigurumis } = useGetAmigurumisQuery()
  const [amigurumi, setAmigurumi] = useState<AmigurumisResponse | undefined>(undefined)
  const { data: amigurumiPattern } = useGetAmigurumiByIdQuery(amigurumi?.id ?? "", { skip: !amigurumi?.id })
  const layers = useMemo(() => {
    if (!amigurumiPattern) {
      return <></>
    }
    return (
      <Stack spacing={2}>
        {amigurumiPattern.layers.map((layer, i) => (
          <>
            <Typography variant="h6">{t("layer") + " " + (i + 1) + ":"}</Typography>
            <Stack direction={"row"} spacing={2}>
              {layer.layers.map((stitch, h) => (
                <Stack key={"stitch" + h}>
                  {stitch.pattern.map((a, y) => (
                    <Stack key={"e" + y}>
                      <Typography>{t(a)}</Typography>
                    </Stack>
                  ))}
                  <Typography>{" X " + stitch.times}</Typography>
                </Stack>
              ))}
            </Stack>
          </>
        ))}
      </Stack>
    )
  }, [amigurumiPattern, t])
  return (
    <Stack spacing={2}>
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
      {layers}
    </Stack>
  )
}
export default PatternsPage
