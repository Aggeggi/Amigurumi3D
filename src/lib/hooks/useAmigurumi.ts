import { useEffect } from "react"
import type { STITCH_TYPE } from "../features/amigurumi/amigurumiSlice"
import { addBase, addLayer, resetAmigurumi, close, scratch } from "../features/amigurumi/amigurumiSlice"
import { useAppDispatch, useAppSelector } from "./hooks"
import type { AmigurumiLayerContainer, AmigurumiModel } from "../features/amigurumi/amigurumiApi"

const parseLayer = (container: AmigurumiLayerContainer) => {
  const layer: STITCH_TYPE[] = []
  for (let i = 0; i < container.times; i++) {
    for (const stitch of container.layers) {
      for (let y = 0; y < stitch.times; y++) {
        layer.concat(stitch.pattern)
      }
    }
  }
  return layer
}
export const useAmigurumi = (amigurumi: AmigurumiModel) => {
  const dispatch = useAppDispatch()
  const amigurumiModel = useAppSelector((state) => state.amigurumi)

  useEffect(() => {
    console.log("amigurum")
    dispatch(resetAmigurumi())
    if (amigurumi.layers.length) {
      const baseLayer = parseLayer(amigurumi.layers[0])
      dispatch(addBase(baseLayer.length))
      for (const layer of amigurumi.layers.slice(1)) {
        dispatch(addLayer(parseLayer(layer)))
      }
      dispatch(close())
      dispatch(scratch(2))
    }
  }, [dispatch, amigurumi])
  return { amigurumiModel }
}
