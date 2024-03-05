import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (2*window.innerHeight), 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth/2, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 2, 1 );
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

//Set camera position
camera.position.z = 5;

//create a blue LineBasicMaterial
const materialLine = new THREE.LineBasicMaterial( { color: 0x0000ff } );
const points = [];
points.push( new THREE.Vector3( -2, 0, 0 ) );
points.push( new THREE.Vector3( 0,  2, 0 ) );
points.push( new THREE.Vector3( 2,  0, 2 ) );
const geometryLine = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( geometryLine, materialLine );
scene.add(line);

//Light
const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-2, 2, 4);
scene.add(light);

const geometryBuffer = new THREE.BufferGeometry();

// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
// const vertices = new Float32Array( [
// 	-1.0, -1.0,  1.0, // v0
// 	 1.0, -1.0,  1.0, // v1
// 	 1.0,  1.0,  1.0, // v2

// 	 1.0,  1.0,  1.0, // v3
// 	-1.0,  1.0,  1.0, // v4
// 	-1.0, -1.0,  1.0  // v5
// ] );

// const vertices = new Float32Array( [
// 	-1.0, -1.0,  1.0, // v0
// 	 1.0, -1.0,  1.0, // v1
// 	 1.0,  1.0,  1.0, // v2
// 	-1.0,  1.0,  1.0, // v3
// ] );

// const indices = [
// 	0, 1, 2,
// 	2, 3, 0,
// ];

const vertices = new Float32Array( [
	 0.0,  0.0,  0.0, // v0
     
	 0.5,  1.0,  4.5, // v1
	 0.0,  1.0, -1.0, // v2
	-0.5,  1.0,  0.5, // v3
] );

const indices = [
	0, 1, 2,
	0, 2, 3,
	0, 3, 1,
	1, 3, 2,
];


// itemSize = 3 because there are 3 values (components) per vertex
geometryBuffer.setIndex( indices );
geometryBuffer.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const materialBuffer = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const mesh = new THREE.Mesh( geometryBuffer, materialBuffer );
//scene.add(mesh);


function animate(time) {
	requestAnimationFrame( animate );

    //cube.material.color.set(time*0.01 % 0xffffff);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    mesh.rotation.y += 0.01;

    line.rotation.y += 0.03
    line.rotation.z += 0.03

	renderer.render( scene, camera );
}






if ( WebGL.isWebGLAvailable() ) {
	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}