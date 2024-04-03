import { useEffect } from "react"
import type { STITCH_TYPE } from "../features/amigurumi/amigurumiSlice"
import { addBase, addLayer, resetAmigurumi } from "../features/amigurumi/amigurumiSlice"
import { useAppDispatch, useAppSelector } from "./hooks"

export interface AmigurumiModel {
  base: number
  layers: STITCH_TYPE[][]
}

export const useAmigurumi = (amigurumi: AmigurumiModel) => {
  const dispatch = useAppDispatch()
  const amigurumiModel = useAppSelector((state) => state.amigurumi)

  useEffect(() => {
    dispatch(resetAmigurumi())
    dispatch(addBase(amigurumi.base))
    for (const layer of amigurumi.layers) {
      dispatch(addLayer(layer))
    }
  }, [dispatch, amigurumi])
  return { amigurumiModel }
}
