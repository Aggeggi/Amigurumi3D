import WebGL from 'three/addons/capabilities/WebGL.js'
import { Model } from './model';
import { BoxGeometry, BufferGeometry, DirectionalLight, Line, LineBasicMaterial, Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / (window.innerHeight), 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new BoxGeometry(1, 2, 1);
const material = new MeshPhongMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
cube.translateX(3);
cube.translateY(3);
cube.translateZ(-6);
scene.add(cube);

//Set camera position
camera.position.z = 5;

//create a blue LineBasicMaterial
const materialLine = new LineBasicMaterial({ color: 0x0000ff });
const points = [];
points.push(new Vector3(-2, 0, 0));
points.push(new Vector3(0, 2, 0));
points.push(new Vector3(2, 0, 2));
const geometryLine = new BufferGeometry().setFromPoints(points);
const line = new Line(geometryLine, materialLine);
scene.add(line);

//Light
const color = 0xFFFFFF;
const intensity = 3;
const light = new DirectionalLight(color, intensity);
light.position.set(-2, 2, 4);
scene.add(light);

//const geometryBuffer = new THREE.BufferGeometry();

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

const vertices = new Float32Array([
	0.0, 0.0, 0.0, // v0

	0.5, 1.0, 1.5, // v1
	0.0, 1.0, -1.0, // v2
	-0.5, 1.0, 0.5, // v3
]);

const indices = [
	0, 2, 1,
	0, 3, 2,
	0, 1, 3,
	1, 3, 2,
];


// itemSize = 3 because there are 3 values (components) per vertex
// geometryBuffer.setIndex( indices );
// geometryBuffer.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
// geometryBuffer.computeVertexNormals() //<-- this
// geometryBuffer.normalizeNormals();
// const materialBuffer = new THREE.MeshPhongMaterial( { color: 0xff0000, flatShading: true  } );
// const mesh = new THREE.Mesh( geometryBuffer, materialBuffer );
//scene.add(mesh);

let model = new Model(0.8);
model.mesh.translateY(-1.5);
// model.mesh.translateY(-2.5);
//model.mesh.rotation.x += 0.50;
scene.add(model.mesh)

let scheletro
const materialLineSche = new LineBasicMaterial({ color: 0x0000ff });
const pointsSche = [new Vector3(1, -0.25, 0)];
model.layers.forEach((layer) => {
	let first: Vector3|undefined
	layer.forEach((point, i) => {
		if (i == 0) {
			first = point;
		}
		pointsSche.push(point);
	});
	if (first) {
		pointsSche.push(first)
	}
});
const geometryLineSche = new BufferGeometry().setFromPoints(pointsSche);
const lineSche = new Line(geometryLineSche, materialLineSche);
// scene.add(lineSche);
lineSche.translateY(-2.5);

// for (let i = 0; i <  model.mesh.geometry.attributes.position.array.length; i++) {
// 	var vertexCopy = model.mesh.geometry.attributes.position.array[i];
// 	let res = model.mesh.localToWorld(vertexCopy);
// 	console.log(res)
// }


// console.log(model.mesh.geometry.attributes.position.array)


function animate(time: number) {
	requestAnimationFrame(animate);

	//cube.material.color.set(time*0.01 % 0xffffff);
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;


	lineSche.rotateY(0.01)
	model.mesh.rotation.y += 0.01;

	line.rotation.y += 0.03
	line.rotation.z += 0.03

	renderer.render(scene, camera);
}






if (WebGL.isWebGLAvailable()) {
	// Initiate function or other initializations here
	animate(0);

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById('container')?.appendChild(warning);

}
