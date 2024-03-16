import * as THREE from 'three';

export default class Model{

    constructor(){
        this.layers = [];
        
        let vertArray = this.addBase(5)
        let newVertex = this.addLayer();
        vertArray.push(...newVertex);

        this.vertices = new Float32Array(vertArray);
        
        this.indices = [
            0, 3, 1,
            1, 3, 2,

            0, 6, 3,
            0, 6, 7,

            1, 7, 0, // 2 trinagoli sopra sommati + 1
            1, 7, 4,
            
            6, 4, 7, // Coperchio
            5, 4, 6,
        ];
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

    addLayer(){
        // Current base face
        let firstPoint = this.layers[this.layers.length-1][0]
        let base = new Float32Array( this.makeShape(4,  firstPoint));
        console.log(this.makeShape(4, new THREE.Vector3(1, 0, 0)));

        // Creating momentarily an object to move it, rotate it and add it to the main body
        // Assuming you have a set of points defined as an array of Vector3 objects
        let points = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];

        // Create a rotation matrix
        let rotationMatrix = new THREE.Matrix4();
        let angleInRadians = Math.PI / 4; // Example rotation of 45 degrees
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
            res.push(point.x, point.y, point.z);
            newLayer.push(point);
        }
        
        this.layers.push(newLayer)

        return res;

    }

    
    addBase(nEdges){
        // Current base face
        let base = this.makeShape(nEdges, new THREE.Vector3(1, 0, 0));

        // Add a base layer to the reference model:
        this.layers[0] = [];
        
        let res = []
        // Apply rotation to each point
        for (let i = 0; i < base.length; i+=3) {
            let point = new THREE.Vector3(base[i], base[i+1], base[i+2])
            point.applyMatrix4(rotationMatrix);
            res.push(point.x, point.y, point.z);
            this.layers[0].push(point);
        }

        return res;

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
            point.applyMatrix4(rotationMatrix);
            res.push(point.x, point.y, point.z);
        }
        
        return res;
    }
}