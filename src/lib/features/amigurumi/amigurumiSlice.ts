import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../store"
import { Matrix4, Vector3 } from "three"

export enum STITCH_TYPE {
  SC = "SC",
  INC = "INC",
  DEC = "DEC",
}
interface MyVector {
  x: number
  y: number
  z: number
}

const makeShape = (nEdges: number, center: Vector3, dir: Vector3, rotation: number, scale: number): number[] => {
  const shiftPoint = new Vector3(1, 0, 0).multiplyScalar(scale)
  // let shiftPoint = dir.cross(new THREE.Vector3(1, 0, 0)).normalize()
  const point = center.add(shiftPoint)
  // const point2 = new Vector3(1, 0, 0)

  // Create a rotation matrix
  const rotationMatrix = new Matrix4()
  const angleInRadians = (2 * Math.PI) / nEdges // Rotation to make regular shape
  rotationMatrix.makeRotationAxis(new Vector3(0, 1, 0), angleInRadians) // Rotating around the y-axis

  point.multiplyScalar((1 / Math.cos(Math.PI / 2 - angleInRadians / 2)) * 0.5)

  const res = []
  // Apply rotation to each point
  for (let i = 0; i < nEdges; i++) {
    if (i !== 0) {
      point.applyMatrix4(rotationMatrix)
    } else {
      const beginRotationMatrix = new Matrix4()
      beginRotationMatrix.makeRotationAxis(new Vector3(0, 1, 0), rotation) // Rotating around the y-axis
      point.applyMatrix4(beginRotationMatrix)
    }
    res.push(point.x, point.y, point.z)
  }

  return res
}

// Create the triangles to make a simple stitch in the models
//   4   5
//   .___.
//   |╲  |
//   | ╲ |
//   |  ╲|
//   .⎯⎯⎯.
//   0   1
const makeIndexesSC = (currentBase: number, currentTop: number, vertArray: number[], layers: MyVector[][]): number[] => {
  const totEdges = vertArray.length / 3

  const nTop = layers.at(-1)?.length ?? 0
  const firstTop = totEdges - nTop

  const nBase = layers.at(-2)?.length ?? 0
  const firstBase = firstTop - nBase

  return [
    // First Triangle (Ex: 1, 4, 0)
    firstBase + ((currentBase + 1) % nBase),
    firstTop + (currentTop % nTop),
    firstBase + (currentBase % nBase),
    // Second Triangle (Ex: 1, 4, 5)
    firstBase + ((currentBase + 1) % nBase),
    firstTop + (currentTop % nTop),
    firstTop + ((currentTop + 1) % nTop),
  ]
}

// Create the triangles to make a increase stitch in the models
//   4   5   6
//   .___.___.
//   |  ╱ ╲  |
//   | ╱   ╲ |
//   |╱     ╲|
//   .⎯⎯⎯⎯⎯⎯⎯.
//   0       1
const makeIndexesINC = (currentBase: number, currentTop: number, vertArray: number[], layers: MyVector[][]): number[] => {
  const totEdges = vertArray.length / 3

  const nTop = layers.at(-1)?.length ?? 0
  const firstTop = totEdges - nTop

  const nBase = layers.at(-2)?.length ?? 0
  const firstBase = firstTop - nBase

  return [
    // First Triangle (Ex: 5, 4, 0)
    firstTop + (currentTop % nTop),
    firstTop + ((currentTop + 1) % nTop),
    firstBase + (currentBase % nBase),
    // //Second Triangle (Ex: 0, 1, 5)
    firstBase + (currentBase % nBase),
    firstBase + ((currentBase + 1) % nBase),
    firstTop + ((currentTop + 1) % nTop),
    // Third Triangle (Ex: 6, 5, 1)
    firstTop + ((currentTop + 2) % nTop),
    firstTop + ((currentTop + 1) % nTop),
    firstBase + ((currentBase + 1) % nBase),
  ]
}

// Create the triangles to make a decrease stitch in the models
//   4       5
//   .⎯⎯⎯⎯⎯⎯⎯.
//   |╲     ╱|
//   | ╲   ╱ |
//   |  ╲ ╱  |
//   .⎯⎯⎯.⎯⎯⎯.
//   0   1   2
const makeIndexesDEC = (currentBase: number, currentTop: number, vertArray: number[], layers: MyVector[][]): number[] => {
  const totEdges = vertArray.length / 3

  const nTop = layers.at(-1)?.length ?? 0
  const firstTop = totEdges - nTop

  const nBase = layers.at(-2)?.length ?? 0
  const firstBase = firstTop - nBase

  return [
    // First Triangle (Ex: 0, 1, 4)
    firstBase + (currentBase % nBase),
    firstBase + ((currentBase + 1) % nBase),
    firstTop + (currentTop % nTop),
    // Second Triangle (Ex: 5, 4, 1)
    firstTop + ((currentTop + 1) % nTop),
    firstTop + (currentTop % nTop),
    firstBase + ((currentBase + 1) % nBase),
    // Third Triangle (Ex: 1, 2, 5)
    firstBase + ((currentBase + 1) % nBase),
    firstBase + ((currentBase + 2) % nBase),
    firstTop + ((currentTop + 1) % nTop),
  ]
}

export interface AmigurumiState {
  indices: number[]
  layers: MyVector[][]
  scale: number
  vertArray: number[]
}

const initialState: AmigurumiState = {
  indices: [],
  layers: [],
  scale: 0.2,
  vertArray: [],
}

export const amigurumiSlice = createSlice({
  name: "amigurumi",
  initialState,
  reducers: {
    resetAmigurumi(state): void {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = { ...initialState }
    },
    addLayer(state, action: PayloadAction<STITCH_TYPE[]>): void {
      const schema = action.payload
      const nEdgesBase = state.layers.at(-1)?.length ?? 0
      if (nEdgesBase > schema.length) {
        console.error("Error: there are too few stitches for this layer\n Available: " + nEdgesBase + " Given:" + schema.length)
        return
      }

      if (nEdgesBase < schema.length) {
        console.error("Error: there are too many stitches for this layer\n Available: " + nEdgesBase + " Given:" + schema.length)
        return
      }

      console.log("Adding new layer !!")

      // Calculate the number of edges of the next Pattern
      let nEdges = 0
      schema.forEach((stitch) => {
        switch (stitch) {
          case STITCH_TYPE.SC:
            nEdges++
            break

          case STITCH_TYPE.INC:
            nEdges += 2
            break

          case STITCH_TYPE.DEC:
            nEdges++
            break

          default:
            break
        }

        console.log(nEdges)
      })
      console.log("Number of edges new layer: ", nEdges)

      // Current base face
      const firstPoint = state.layers.at(-1)?.at(0)
      if (firstPoint == null) {
        throw Error("invalid first point")
      }
      console.log(nEdges, firstPoint)
      const base = new Float32Array(
        makeShape(nEdges, new Vector3(0, 0, 0), new Vector3(0, 1, 0), new Vector3(firstPoint.x, 0, firstPoint.z).angleTo(new Vector3(1, 0, 0)), state.scale),
      )

      // Creating momentarily an object to move it, rotate it and add it to the main body
      // Create a rotation matrix
      const rotationMatrix = new Matrix4()
      const edgesGCD = Math.max(nEdges, nEdgesBase)
      // const edgesGCD = (nEdges + nEdgesBase)/2
      // const div = Math.max(nEdges, nEdgesBase) / Math.min(nEdges, nEdgesBase)
      // edgesGCD = (Number.isInteger(div))? Math.max(nEdges, nEdgesBase) : edgesGCD;
      console.log(edgesGCD)
      // let angleInRadians = 0;
      const angleInRadians = Math.PI / edgesGCD // Example rotation of 45 degrees
      console.log(angleInRadians / Math.PI)
      rotationMatrix.makeRotationAxis(new Vector3(0, 1, 0), angleInRadians) // Rotating around the y-axis

      // Create a translation matrix
      const translationMatrix = new Matrix4()
      let diffLayers = Math.abs(nEdges - nEdgesBase)
      diffLayers = diffLayers === 0 ? 1 : diffLayers
      // const translationVector = new Vector3(0, firstPoint.y + (1 / diffLayers) * state.scale, 0);
      const translationVector = new Vector3(0, firstPoint.y + (1 / diffLayers) * state.scale, 0)
      translationMatrix.makeTranslation(translationVector.x, translationVector.y, translationVector.z)

      // Combine rotation and translation into one transformation matrix
      const transformationMatrix = new Matrix4().multiplyMatrices(translationMatrix, rotationMatrix)

      // Add a new layer to the reference model:
      const newLayer = []

      // Apply rotation to each point
      for (let i = 0; i < base.length; i += 3) {
        const point = new Vector3(base[i], base[i + 1], base[i + 2])
        point.applyMatrix4(transformationMatrix)
        state.vertArray.push(point.x, point.y, point.z)
        newLayer.push(point)
      }

      state.layers.push(newLayer.map((point) => ({ x: point.x, y: point.y, z: point.z })))

      // Make triangles for this layer of the shape
      /// ////////////////////////////////////////////////////////////////////////////////////////////////
      let topIndex = 0
      let bottomIndex = 0
      schema.forEach((stitch) => {
        switch (stitch) {
          case STITCH_TYPE.SC:
            state.indices.push(...makeIndexesSC(bottomIndex, topIndex, state.vertArray, state.layers))
            topIndex++
            bottomIndex++
            break

          case STITCH_TYPE.INC:
            state.indices.push(...makeIndexesINC(bottomIndex, topIndex, state.vertArray, state.layers))
            topIndex += 2
            bottomIndex++
            break

          case STITCH_TYPE.DEC:
            state.indices.push(...makeIndexesDEC(bottomIndex, topIndex, state.vertArray, state.layers))
            topIndex++
            bottomIndex += 2
            break

          default:
            break
        }
      })
    },
    addBase(state, action: PayloadAction<number>): void {
      const nEdges = action.payload
      // Current base face
      const base = makeShape(nEdges, new Vector3(0, 0, 0), new Vector3(0, 1, 0), 0, state.scale)

      // Add a base layer to the reference model:
      state.layers[0] = []
      state.indices = []

      // Make indexes of the base
      if (nEdges >= 3) {
        for (let i = 2; i < nEdges; i++) {
          state.indices.push(i, i - 1, 0)
        }
      }

      // Apply rotation to each point
      for (let i = 0; i < base.length; i += 3) {
        const point = new Vector3(base[i], base[i + 1], base[i + 2])
        state.vertArray.push(point.x, point.y, point.z)
        state.layers[0].push({ x: point.x, y: point.y, z: point.z })
      }
    },

    close(state): void {
      // Error if the model is empty
      if (!state.layers.length) {
        console.error("Error: there is no Amigurumi to close, there are 0 layers")
      }

      const lastLayer = state.layers[state.layers.length - 1]
      const nTotEdges = state.layers
        .map((layer) => layer.length)
        .reduce((prev, curr) => {
          return prev + curr
        })
      const firstEdge = nTotEdges - lastLayer.length

      // Make indexes to close the last layer
      if (lastLayer.length >= 3) {
        for (let i = 2; i < lastLayer.length; i++) {
          state.indices.push(firstEdge + i, firstEdge + i - 1, firstEdge)
        }
      }
    },
    scratch(state, action: PayloadAction<number>): void {
      const starchFactor = action.payload

      // reset vertexes to match layers structure
      state.vertArray = []
      state.layers.forEach((layer) => {
        layer.forEach((vertex) => {
          state.vertArray.push(vertex.x)
          state.vertArray.push(vertex.y)
          state.vertArray.push(vertex.z)
        })
      })
    },
  },
})

// Action creators are generated for each case reducer function
export const { addLayer, addBase, resetAmigurumi, close, scratch } = amigurumiSlice.actions

export const selectAmigurumi = (state: RootState) => state.amigurumi

export default amigurumiSlice.reducer
