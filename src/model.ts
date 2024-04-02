import { BufferAttribute, BufferGeometry, Matrix4, Mesh, MeshPhongMaterial, Vector3 } from 'three'

export enum STITCH_TYPE {
  SC = 'SC',
  INC = 'INC',
  DEC = 'DEC'
}

export class Model {
  vertArray: Vector3[]
  layers: Vector3[][]
  indices: number[]
  vertices: Float32Array
  mesh: Mesh
  scale: number

  constructor (_scale: number) {
    this.scale = _scale

    this.layers = []
    this.indices = []

    this.vertArray = []
    this.addBase(4)
    this.addLayer([STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC])
    this.addLayer([STITCH_TYPE.SC, STITCH_TYPE.INC, STITCH_TYPE.SC, STITCH_TYPE.INC])
    this.addLayer([STITCH_TYPE.SC, STITCH_TYPE.INC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.INC])
    this.addLayer([STITCH_TYPE.SC, STITCH_TYPE.INC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.INC])
    this.addLayer([STITCH_TYPE.SC, STITCH_TYPE.INC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.INC])
    this.addLayer([STITCH_TYPE.SC, STITCH_TYPE.INC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.INC])
    // this.addLayer([STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC]);
    // this.addLayer([STITCH_TYPE.INC, STITCH_TYPE.INC, STITCH_TYPE.INC, STITCH_TYPE.INC]);
    // this.addLayer([STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC]);
    // this.addLayer([STITCH_TYPE.DEC, STITCH_TYPE.DEC, STITCH_TYPE.DEC, STITCH_TYPE.DEC]);
    // this.addLayer([STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.INC]);

    this.vertices = new Float32Array(this.vertArray.length)
    this.makeInverseFace()

    const geometryBuffer = new BufferGeometry()
    geometryBuffer.setIndex(this.indices)
    geometryBuffer.setAttribute('position', new BufferAttribute(this.vertices, 3))
    geometryBuffer.computeVertexNormals() // <-- this
    geometryBuffer.normalizeNormals()
    const materialBuffer = new MeshPhongMaterial({ color: 0xff0000, flatShading: true })
    this.mesh = new Mesh(geometryBuffer, materialBuffer)
  }

  // Create a base with a set number of points
  makeInverseFace (): void {
    const len = this.indices.length
    for (let i = 0; i < len; i += 3) {
      this.indices.push(this.indices[i])
      this.indices.push(this.indices[i + 2])
      this.indices.push(this.indices[i + 1])
    }
  }

  // This function is used to add a new layer of triangles to the model
  // The final objective here is to give to it an array of STITCHES and make it automatically calculate the Vertex and Index of the new Layer
  // For now we ask the number of SC to add to the new layer
  // schema: STITCH_TYPE[]
  addLayer (schema: STITCH_TYPE[]): void {
    const nEdgesBase = this.layers.at(-1)?.length ?? 0
    if (nEdgesBase > schema.length) {
      console.error('Error: there are too few stitches for this layer\n Available: ' + nEdgesBase + ' Given:' + schema.length)
      return
    }

    if (nEdgesBase < schema.length) {
      console.error('Error: there are too many stitches for this layer\n Available: ' + nEdgesBase + ' Given:' + schema.length)
      return
    }

    console.log('Adding new layer !!')

    // Calclulate the number of edges of the next Pattern
    let nEdges = 0
    schema.forEach((stitch, index) => {
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
    })
    console.log('Number of edges new layer: ', nEdges)

    // Current base face
    const firstPoint = this.layers.at(-1)?.at(0)
    // const lastPoint = this.layers.at(-1)?.at(-1)
    if (firstPoint == null) {
      throw Error('invalid first point')
    }
    console.log(nEdges, firstPoint)
    const base = new Float32Array(this.makeShape(
      nEdges,
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
      new Vector3(firstPoint.x, 0, firstPoint.z).angleTo(new Vector3(1, 0, 0))
    ))

    // Creating momentarily an object to move it, rotate it and add it to the main body
    // Create a rotation matrix
    const rotationMatrix = new Matrix4()
    const edgesGCD = Math.max(nEdges, nEdgesBase)
    // const div = Math.max(nEdges, nEdgesBase) / Math.min(nEdges, nEdgesBase)
    // edgesGCD = (Number.isInteger(div))? Math.max(nEdges, nEdgesBase) : edgesGCD;
    console.log(edgesGCD)
    // let angleInRadians = 0;
    const angleInRadians = Math.PI / (edgesGCD) // Example rotation of 45 degrees
    console.log(angleInRadians / Math.PI)
    rotationMatrix.makeRotationAxis(new Vector3(0, 1, 0), angleInRadians) // Rotating around the y-axis

    // Create a translation matrix
    const translationMatrix = new Matrix4()
    let diffLayers = Math.abs(nEdges - nEdgesBase)
    diffLayers = (diffLayers === 0) ? 1 : diffLayers
    // let translationVector = new THREE.Vector3(0, firstPoint.y + 0.7, 0); // TEMPORANEOOOOOOOOOOOOOOOOOOO
    const translationVector = new Vector3(0, firstPoint.y + 1 / (diffLayers) * this.scale, 0) // Example translation
    translationMatrix.makeTranslation(translationVector.x, translationVector.y, translationVector.z)

    // Combine rotation and translation into one transformation matrix
    const transformationMatrix = new Matrix4().multiplyMatrices(translationMatrix, rotationMatrix)

    // Add a new layer to the reference model:
    const newLayer = []

    // Apply rotation to each point
    for (let i = 0; i < base.length; i += 3) {
      const point = new Vector3(base[i], base[i + 1], base[i + 2])
      point.applyMatrix4(transformationMatrix)
      this.vertArray.push(new Vector3(point.x, point.y, point.z))
      newLayer.push(point)
    }

    this.layers.push(newLayer)

    // Make triangles for this layer of the shape
    /// ////////////////////////////////////////////////////////////////////////////////////////////////
    let topIndex = 0
    let bottomIndex = 0
    schema.forEach((stitch, i) => {
      switch (stitch) {
        case STITCH_TYPE.SC:
          this.indices.push(
            ...this.makeIndexesSC(bottomIndex, topIndex)
          )
          topIndex++
          bottomIndex++
          break

        case STITCH_TYPE.INC:
          this.indices.push(
            ...this.makeIndexesINC(bottomIndex, topIndex)
          )
          topIndex += 2
          bottomIndex++
          break

        case STITCH_TYPE.DEC:
          this.indices.push(
            ...this.makeIndexesDEC(bottomIndex, topIndex)
          )
          topIndex++
          bottomIndex += 2
          break

        default:
          break
      }
    })
  }

  addBase (nEdges: number): void {
    // Current base face
    const base = this.makeShape(nEdges, new Vector3(0, 0, 0), new Vector3(0, 1, 0), 0)

    // Add a base layer to the reference model:
    this.layers[0] = []
    this.indices = []

    // Make indexes of the base
    if (nEdges >= 3) {
      for (let i = 2; i < nEdges; i++) {
        this.indices.push(i, i - 1, 0)
      }
    }

    // Apply rotation to each point
    for (let i = 0; i < base.length; i += 3) {
      const point = new Vector3(base[i], base[i + 1], base[i + 2])
      this.vertArray.push(new Vector3(point.x, point.y, point.z))
      this.layers[0].push(point)
    }
  }

  makeShape (nEdges: number, center: Vector3, dir: Vector3, rotation: number): number[] {
    const shiftPoint = new Vector3(1, 0, 0).multiplyScalar(this.scale)
    // let shiftPoint = dir.cross(new THREE.Vector3(1, 0, 0)).normalize()
    const point = center.add(shiftPoint)
    // const point2 = new Vector3(1, 0, 0)

    // Create a rotation matrix
    const rotationMatrix = new Matrix4()
    const angleInRadians = 2 * Math.PI / nEdges // Rotation to make regular shape
    rotationMatrix.makeRotationAxis(new Vector3(0, 1, 0), angleInRadians) // Rotating around the y-axis

    point.multiplyScalar(1 / Math.cos(Math.PI / 2 - angleInRadians / 2) * 0.5)

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
  makeIndexesSC (currentBase: number, currentTop: number): number[] {
    const totEdges = this.vertArray.length / 3

    const nTop = this.layers.at(-1)?.length ?? 0
    const firstTop = totEdges - nTop

    const nBase = this.layers.at(-2)?.length ?? 0
    const firstBase = firstTop - nBase

    return [
      // First Triangle (Ex: 1, 4, 0)
      firstBase + (currentBase + 1) % nBase,
      firstTop + currentTop % nTop,
      firstBase + currentBase % nBase,
      // Second Triangle (Ex: 1, 4, 5)
      firstBase + (currentBase + 1) % nBase,
      firstTop + currentTop % nTop,
      firstTop + (currentTop + 1) % nTop
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
  makeIndexesINC (currentBase: number, currentTop: number): number[] {
    const totEdges = this.vertArray.length / 3

    const nTop = this.layers.at(-1)?.length ?? 0
    const firstTop = totEdges - nTop

    const nBase = this.layers.at(-2)?.length ?? 0
    const firstBase = firstTop - nBase

    return [
      // First Triangle (Ex: 5, 4, 0)
      firstTop + currentTop % nTop,
      firstTop + (currentTop + 1) % nTop,
      firstBase + currentBase % nBase,
      // //Second Triangle (Ex: 0, 1, 5)
      firstBase + currentBase % nBase,
      firstBase + (currentBase + 1) % nBase,
      firstTop + (currentTop + 1) % nTop,
      // Third Triangle (Ex: 6, 5, 1)
      firstTop + (currentTop + 2) % nTop,
      firstTop + (currentTop + 1) % nTop,
      firstBase + (currentBase + 1) % nBase
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
  makeIndexesDEC (currentBase: number, currentTop: number): number[] {
    const totEdges = this.vertArray.length / 3

    const nTop = this.layers.at(-1)?.length ?? 0
    const firstTop = totEdges - nTop

    const nBase = this.layers.at(-2)?.length ?? 0
    const firstBase = firstTop - nBase

    return [
      // First Triangle (Ex: 0, 1, 4)
      firstBase + currentBase % nBase,
      firstBase + (currentBase + 1) % nBase,
      firstTop + currentTop % nTop,
      // Second Triangle (Ex: 5, 4, 1)
      firstTop + (currentTop + 1) % nTop,
      firstTop + currentTop % nTop,
      firstBase + (currentBase + 1) % nBase,
      // Third Triangle (Ex: 1, 2, 5)
      firstBase + (currentBase + 1) % nBase,
      firstBase + (currentBase + 2) % nBase,
      firstTop + (currentTop + 1) % nTop
    ]
  }
}
