import * as THREE from 'three';

export const STITCH_TYPE = {
    SC: 0,
    INC: 1,
    DEC: 2
}

export class Model{

    constructor(){
        this.layers = [];
        this.indices = [];
        
        this.vertArray = [];
        this.addBase(4)
        this.addLayer([STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC]);
        this.addLayer([STITCH_TYPE.INC, STITCH_TYPE.INC, STITCH_TYPE.INC, STITCH_TYPE.INC]);
        this.addLayer([STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC, STITCH_TYPE.SC]);
        this.addLayer([STITCH_TYPE.DEC, STITCH_TYPE.DEC, STITCH_TYPE.DEC, STITCH_TYPE.DEC]);


        this.vertices = new Float32Array(this.vertArray);
        
        this.indices.push(            
            6, 4, 7, // Coperchio
            5, 4, 6,
        );
        this.makeInverseFace();

        

        const geometryBuffer = new THREE.BufferGeometry();
        geometryBuffer.setIndex( this.indices );
        geometryBuffer.setAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );
        geometryBuffer.computeVertexNormals() //<-- this
        geometryBuffer.normalizeNormals();
        const materialBuffer = new THREE.MeshPhongMaterial( { color: 0xff0000, flatShading: true  } );
        this.mesh = new THREE.Mesh( geometryBuffer, materialBuffer );
    }

    //Create a base with a set number of points
    makeInverseFace(){
        const len = this.indices.length;
        for(let i=0; i <len; i+=3){
            this.indices.push(this.indices[i])
            this.indices.push(this.indices[i+2])
            this.indices.push(this.indices[i+1])
        }

    }

    // This function is used to add a new layer of triangles to the model
    // The final objective here is to give to it an array of STITCHES and make it automatically calculate the Vertex and Index of the new Layer  
    // For now we ask the number of SC to add to the new layer  
    // schema: STITCH_TYPE[]
    addLayer(schema){
        
        console.log("Adding new layer !!")

        // Calclulate the number of edges of the next Pattern
        let nEdges = 0;
        schema.forEach((stitch, index)=>{
            switch (stitch) {
                case STITCH_TYPE.SC:
                    if(index == 0){
                        nEdges = 1;
                        break;
                    }
                    nEdges++;
                    break;
            
                case STITCH_TYPE.INC:
                    if(index == 0){
                        nEdges = 2;
                        break;
                    }
                    nEdges+=2;
                    break;
            
                case STITCH_TYPE.DEC:
                    if(index == 0){
                        nEdges = 1;
                        break;
                    }
                    nEdges++;
                    break;
                        
                default:
                    break;
            }
        }); 
        console.log("Number of edges new layer: ", nEdges);

        // Current base face
        let firstPoint = this.layers[this.layers.length-1][0]
        let diff
        let base = new Float32Array( this.makeShape(nEdges, new THREE.Vector3(0, firstPoint.y, 0), new THREE.Vector3(0, 1, 0) ));

        // Creating momentarily an object to move it, rotate it and add it to the main body
        // Create a rotation matrix
        let rotationMatrix = new THREE.Matrix4();
        let angleInRadians = Math.PI / 4; // Example rotation of 45 degrees
        rotationMatrix.makeRotationAxis(new THREE.Vector3(0, 1, 0), angleInRadians); // Rotating around the y-axis

        // Create a translation matrix
        let translationMatrix = new THREE.Matrix4();
        // let translationVector = new THREE.Vector3(0, 1, 0); // Example translation
        let translationVector = new THREE.Vector3(0, 4/nEdges, 0); // Example translation
        translationMatrix.makeTranslation(translationVector.x, translationVector.y, translationVector.z);

        // Combine rotation and translation into one transformation matrix
        let transformationMatrix = new THREE.Matrix4().multiplyMatrices(translationMatrix, rotationMatrix);

        // Add a new layer to the reference model:
        let newLayer = [];
        
        // Apply rotation to each point
        for (let i = 0; i < base.length; i+=3) {
            let point = new THREE.Vector3(base[i], base[i+1], base[i+2])
            point.applyMatrix4(transformationMatrix);
            this.vertArray.push(point.x, point.y, point.z);
            newLayer.push(point);
        }
        
        this.layers.push(newLayer)

        
        // Make triangles for this layer of the shape
            ///////////////////////////////////////////////////////////////////////////////////////////////////
        let topIndex = 0;
        let bottomIndex = 0;
        schema.forEach((stitch, i)=>{
            switch (stitch) {
                case STITCH_TYPE.SC:
                    this.indices.push(
                        ...this.makeIndexesSC(bottomIndex, topIndex)
                    ); 
                    topIndex++;
                    bottomIndex++;
                    break;
            
                case STITCH_TYPE.INC:
                    this.indices.push(
                        ...this.makeIndexesINC(bottomIndex, topIndex)
                    ); 
                    topIndex += 2;
                    bottomIndex++;
                    break;
            
                case STITCH_TYPE.DEC:
                    this.indices.push(
                        ...this.makeIndexesDEC(bottomIndex, topIndex)
                    ); 
                    topIndex++;
                    bottomIndex+=2;
                    break;
                        
                default:
                    break;
            }
        }); 
                  


    }

    
    addBase(nEdges){
        // Current base face
        let base = this.makeShape(nEdges, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));

        // Add a base layer to the reference model:
        this.layers[0] = [];
        this.indices = []

        // Make indexes of the base
        if(nEdges >= 3){
            for (let i = 2; i < nEdges; i++) {
                this.indices.push(i, i-1, 0);      
            }
        }
        
        // Apply rotation to each point
        for (let i = 0; i < base.length; i+=3) {
            let point = new THREE.Vector3(base[i], base[i+1], base[i+2])
            this.vertArray.push(point.x, point.y, point.z);
            this.layers[0].push(point);
        }
        this.vertArray
    }

    makeShape(nEdges, center, dir){
        // let point = new THREE.Vector3(1, 0, 0);
        let shiftPoint = dir.cross(new THREE.Vector3(1, 0, 0)).normalize()
        let point = center.add(shiftPoint);
        let point2 = new THREE.Vector3(1, 0, 0);
        
        // Create a rotation matrix
        let rotationMatrix = new THREE.Matrix4();
        let angleInRadians = 2 * Math.PI / nEdges; // Rotation to make regular shape
        rotationMatrix.makeRotationAxis(new THREE.Vector3(0, 1, 0), angleInRadians); // Rotating around the y-axis
        
        point.multiplyScalar(1/Math.cos( Math.PI/2 - angleInRadians/2) * 0.5)

        let res = []
        // Apply rotation to each point
        for (let i = 0; i < nEdges; i++) {
            if(i != 0){
                point.applyMatrix4(rotationMatrix);
            }
            res.push(point.x, point.y, point.z);
        }
        
        return res;
    }


    // Create the triangles to make a simple stitch in the models
    //   4   5
    //   .___.
    //   |╲  |
    //   | ╲ |
    //   |  ╲|
    //   .⎯⎯⎯.
    //   0   1   
    makeIndexesSC(currentBase, currentTop){
        
        let totEdges = this.vertArray.length/3;

        let nTop = this.layers.at(-1).length;
        let firstTop = totEdges - nTop; 
        
        let nBase = this.layers.at(-2).length;
        let firstBase = firstTop - nBase;
    
        return [
            //First Triangle (Ex: 1, 4, 0)
                firstBase + (currentBase+1) % nBase, 
                firstTop + currentTop % nTop, 
                firstBase + currentBase % nBase,
            //Second Triangle (Ex: 1, 4, 5)
                firstBase + (currentBase+1) % nBase, 
                firstTop + currentTop % nTop, 
                firstTop + (currentTop+1) % nTop,
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
    makeIndexesINC(currentBase, currentTop){
        let totEdges = this.vertArray.length/3;

        let nTop = this.layers.at(-1).length;
        let firstTop = totEdges - nTop; 
        
        let nBase = this.layers.at(-2).length;
        let firstBase = firstTop - nBase;
    
        return [
            //First Triangle (Ex: 5, 4, 0)
                firstTop + currentTop % nTop, 
                firstTop + (currentTop+1) % nTop, 
                firstBase + currentBase % nBase,
            //Second Triangle (Ex: 0, 1, 5)
                firstBase + currentBase % nBase, 
                firstBase + (currentBase+1) % nBase, 
                firstTop + (currentTop+1) % nTop,
            //Third Triangle (Ex: 6, 5, 1)
                firstTop + (currentTop+2) % nTop,
                firstTop + (currentTop+1) % nTop,
                firstBase + (currentBase+1) % nBase, 
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
    makeIndexesDEC(currentBase, currentTop){
        let totEdges = this.vertArray.length/3;

        let nTop = this.layers.at(-1).length;
        let firstTop = totEdges - nTop; 
        
        let nBase = this.layers.at(-2).length;
        let firstBase = firstTop - nBase;
        console.log(firstTop + (currentTop+1) % nTop)
    
        return [
            //First Triangle (Ex: 0, 1, 4)
                firstBase + currentBase % nBase, 
                firstBase + (currentBase+1) % nBase, 
                firstTop + currentTop % nTop,
            //Second Triangle (Ex: 5, 4, 1)
                firstTop + (currentTop+1) % nTop,
                firstTop + currentTop % nTop,
                firstBase + (currentBase+1) % nBase, 
            //Third Triangle (Ex: 1, 2, 5)
                firstBase + (currentBase+1) % nBase, 
                firstBase + (currentBase+2) % nBase, 
                firstTop + (currentTop+1) % nTop,
        ]
    }

}