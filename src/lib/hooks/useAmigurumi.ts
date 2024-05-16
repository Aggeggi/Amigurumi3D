import { useEffect } from "react"
import type { STITCH_TYPE } from "../features/amigurumi/amigurumiSlice"
import { addBase, addLayer, resetAmigurumi, close, scratch } from "../features/amigurumi/amigurumiSlice"
import { useAppDispatch, useAppSelector } from "./hooks"

export interface AmigurumiModel {
  layers: STITCH_TYPE[][]
}

export const useAmigurumi = (amigurumi: AmigurumiModel) => {
  const dispatch = useAppDispatch()
  const amigurumiModel = useAppSelector((state) => state.amigurumi)

  useEffect(() => {
    console.log("amigurum")
    dispatch(resetAmigurumi())
    if (amigurumi.layers.length) {
      dispatch(addBase(amigurumi.layers[0].length))
      for (const layer of amigurumi.layers) {
        dispatch(addLayer(layer))
      }
      dispatch(close())
      dispatch(scratch(2))
    }
  }, [dispatch, amigurumi])
  return { amigurumiModel }
}
