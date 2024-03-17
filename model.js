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
        this.addLayer(4);
        this.addLayer(4);


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

    addLayer(nEdges){
        // Current base face
        let firstPoint = this.layers[this.layers.length-1][0]
        let base = new Float32Array( this.makeShape(nEdges,  firstPoint));

        // Creating momentarily an object to move it, rotate it and add it to the main body
        // Create a rotation matrix
        let rotationMatrix = new THREE.Matrix4();
        let angleInRadians = + Math.PI / 4; // Example rotation of 45 degrees
        rotationMatrix.makeRotationAxis(new THREE.Vector3(0, 1, 0), angleInRadians); // Rotating around the y-axis

        // Create a translation matrix
        let translationMatrix = new THREE.Matrix4();
        let translationVector = new THREE.Vector3(0, 1, 0); // Example translation
        translationMatrix.makeTranslation(translationVector.x, translationVector.y, translationVector.z);

        // Combine rotation and translation into one transformation matrix
        let transformationMatrix = new THREE.Matrix4().multiplyMatrices(translationMatrix, rotationMatrix);

        // Add a new layer to the reference model:
        let newLayer = [];
        
        let res = []
        // Apply rotation to each point
        for (let i = 0; i < base.length; i+=3) {
            let point = new THREE.Vector3(base[i], base[i+1], base[i+2])
            point.applyMatrix4(transformationMatrix);
            this.vertArray.push(point.x, point.y, point.z);
            newLayer.push(point);
        }
        
        this.layers.push(newLayer)

        
        // Make triangles for this layer of the shape
        let totEdges = this.vertArray.length/3;

        let nEdgesNewLayer = this.layers.at(-1).length;
        let firstEdgesNewLayer = totEdges - nEdgesNewLayer; 

        let nEdgeLastLayer = this.layers.at(-2).length;
        let indexEdgesLastLayer = firstEdgesNewLayer - this.layers.at(-1).length;
        if(nEdges >= 2){
            for (let i = 0; i < 4; i++) {
                this.indices.push(
                    ...this.makeIndexesSS(i,i)
                );      
            }
            // this.indices.push(
            //     ...this.makeIndexesINC(4,2)
            // );      
        }


    }

    
    addBase(nEdges){
        // Current base face
        let base = this.makeShape(nEdges, new THREE.Vector3(1, 0, 0));

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

    makeShape(nEdges, startPoint){
        // let point = new THREE.Vector3(1, 0, 0);
        let point = startPoint;

        // Create a rotation matrix
        let rotationMatrix = new THREE.Matrix4();
        let angleInRadians = 2 * Math.PI / nEdges; // Example rotation of 45 degrees
        rotationMatrix.makeRotationAxis(new THREE.Vector3(0, 1, 0), angleInRadians); // Rotating around the y-axis


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
    //   .___.
    //   |╲  |
    //   | ╲ |
    //   |  ╲|
    //   .⎯⎯⎯.   
    makeIndexesSS(currentBase, currentTop){
        
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

    
    // Create the triangles to make a increace stitch in the models
    //   4  5   6
    //   .__.___.
    //   |  ╱╲  |
    //   | ╱  ╲ |
    //   |╱    ╲|
    //   .⎯⎯⎯⎯⎯⎯. 
    //   0      1
    makeIndexesINC(currentBase, currentTop){
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
            //Third Triangle (Ex: 6, 5, 1)
                firstTop + (currentTop+2) % nTop,
                firstTop + (currentTop+1) % nTop,
                firstBase + (currentBase+1) % nBase, 
        ]
    }
    
    // Create the triangles to make a decrease stitch in the models
    //   .⎯⎯⎯⎯⎯⎯. 
    //   |╲    ╱|
    //   | ╲  ╱ |
    //   |  ╲╱  |
    //   .__.___.
    makeIndexesDEC(){

    }

}