import { main } from "./main";
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

//*************************inputs***********************

const initialValues = {
  Ax1: 2,
  Ax2: 8,
  Ay1: 1.7,
  Ay2: 25,
  Az1: 2,
  Az2: 8,
  Vxwind: 1,
  Vzwind:50,
  M: 91.6,
  g: 9.81,
  Rho: 1.2,
  vx0: 500,
  vz0: 0,
  TimeFall: 20,
  cd1: 0.25,
  cd2: 36.9,
  x0: 500,
  y0: 3000,
  z0: 500,
  TimeOpen: 50.1,
};
// GUI
const gui = new dat.GUI();
const gui1 = new dat.GUI();

// //******************************************************
let m = null;

const updateMainInstance = () => {
  m = new main(
    initialValues.M,
    initialValues.g,
    initialValues.Rho,
    initialValues.y0,
    initialValues.z0,
    initialValues.vx0,
    initialValues.vz0,
    initialValues.Vxwind,
    initialValues.Vzwind,
    initialValues.Ax1,
    initialValues.Ax2,
    initialValues.Ay1,
    initialValues.Ay2,
    initialValues.Az1,
    initialValues.Az2,
    initialValues.cd1,
    initialValues.cd2,
    initialValues.TimeFall,
    initialValues.TimeOpen
  );
};

/*تحديد العناصر يلي بدي ضيفها ل 
GUI

*/
var settings = {
  TotalSpeed: 0,
  Acceleration: 0,
  PositionX: 0,
  PositionY: 0,
  PositionZ: 0,
  speed_on_YBefor: 0,
  speed_on_XBefor: 0,
  speed_on_ZBefor: 0,
};
/*
اضافة عناصر العرض لواجهة 
GUI
*/
gui1.add(settings, "TotalSpeed").name("Total speed").listen();
gui1.add(settings, "Acceleration").name("Acceleration").listen();
gui1.add(settings, "PositionX").name("PositionX").listen();
gui1.add(settings, "PositionY").name("PositionY").listen();
gui1.add(settings, "speed_on_YBefor").name("speed-Y-Befor").listen();
gui1.add(settings, "speed_on_XBefor").name("speed-X-Befor").listen();
gui1.add(settings, "speed_on_ZBefor").name("speed-Z-Befor").listen();
gui1.add(settings, "PositionZ").name("PositionZ").listen();
gui1.domElement.style.cssFloat = "left";

// Add controls to the GUI
const controls2 = {
  M: gui.add(initialValues, "M"),
  y0: gui.add(initialValues, "y0"),
  x0: gui.add(initialValues, "x0"),
  z0: gui.add(initialValues, "z0"),
};
// Call the update function initially
updateMainInstance();

// Call the update function whenever a value changes
for (const control of Object.values(controls2)) {
  control.onChange(updateMainInstance);
}
/* Loaders
 */
const gltfLoader = new GLTFLoader();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/* Environment map
 */

var loader = new THREE.TextureLoader();
var texture1 = loader.load("/textures/environmentMaps/1/px.jpg");
var texture2 = loader.load("/textures/environmentMaps/1/nx.jpg");
var texture3 = loader.load("/textures/environmentMaps/1/py.jpg");
var texture4 = loader.load("/textures/environmentMaps/1/ny.jpg");
var texture5 = loader.load("/textures/environmentMaps/1/pz.jpg");
var texture6 = loader.load("/textures/environmentMaps/1/nz.jpg");
var materials = [
  new THREE.MeshBasicMaterial({ map: texture1, side: THREE.BackSide }), //right
  new THREE.MeshBasicMaterial({ map: texture2, side: THREE.BackSide }), //left
  new THREE.MeshBasicMaterial({ map: texture3, side: THREE.BackSide }), //top
  new THREE.MeshBasicMaterial({ map: texture4, side: THREE.BackSide }), //bottom
  new THREE.MeshBasicMaterial({ map: texture5, side: THREE.BackSide }), //front
  new THREE.MeshBasicMaterial({ map: texture6, side: THREE.BackSide }), //back
];
const skybox = new THREE.Mesh(
  new THREE.BoxGeometry(5000, 4000, 5000),
  materials
);
scene.add(skybox);

/* Models
 */

let modelPositionX = 0;
let loadedModel = null;

gltfLoader.load("/people/scene.gltf", (gltf) => {
  loadedModel = gltf.scene;
  gltf.scene.scale.set(15, 15, 15);
  gltf.scene.rotation.y = Math.PI * 0.5;
  gltf.scene.position.y = 0;
  gltf.scene.position.x = 100;
  gltf.scene.position.z = 500;
});

let plane = null;
gltfLoader.load("/models/formats/ALH.glb", (gltf) => {
  plane = gltf.scene;
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.rotation.y = Math.PI * 2.6;
  gltf.scene.position.y = 3000;
  gltf.scene.position.x = -1000;
  gltf.scene.position.z = 500;
});

//light by rafah
const light = new THREE.AmbientLight(0x404040, 100);
scene.add(light);

// const axes = new THREE.AxesHelper(1000, 1000, 1000);
// scene.add(axes);

//open parachute
let parachute = null;
gltfLoader.load("/parachute/scene.gltf", (gltf) => {
  parachute = gltf.scene;
  gltf.scene.scale.set(30, 30, 30);
  gltf.scene.rotation.y = Math.PI * 2.6;
  gltf.scene.position.y = 200;
  gltf.scene.position.x = -520;
  gltf.scene.position.z = 1000;
});

/* Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/* Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.00001,
  20000
);

camera.position.set(-2205.686954491959, 140.69193085481754, 354.6432564935091);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/* Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* Animate
 */
const clock = new THREE.Clock();
const clock2 = new THREE.Clock();

// Plane
let position_planeX;
let position_planeY;
let position_planeZ;

let position_on_XBefor;
let position_on_YBefor;
let position_on_ZBefor;

let position_on_XAfter;
let position_on_YAfter;
let position_on_ZAfter;

let w = 0.0001;
var Totalspeed = 0;
var speedafteropen = 0;

let jump = false;
let simulationState = "paused";
let isParachuteVisible = false;

const tick = () => {

  // Update controls
  controls.update();

  if (plane) {
      var elapsedTime = clock.getElapsedTime();

    scene.add(plane);
    if (!jump) {
      plane.position.set(m.Postion_plane(elapsedTime, 500), 3000, 500);

      position_planeX = plane.position.x;
      position_planeY = plane.position.y;
      position_planeZ = plane.position.z;
      settings.PositionX = position_planeX;
      settings.PositionY = position_planeY;
      settings.PositionZ = position_planeZ;
      settings.TotalSpeed = 500;
    } else {
      plane.position.set(m.Postion_plane(elapsedTime, 500), 3000, 500);
    }
    camera.lookAt(plane.position);
  }

  if (loadedModel && w > 0 && jump) {
    scene.add(loadedModel);
    var jumpTime = clock2.getElapsedTime();

    // model
    position_on_XBefor = m.x.position_on_XBefor(
      jumpTime,
      0.2,
      position_planeX
    );
    position_on_YBefor = m.y.position_on_YBefor(
      jumpTime,
      0.2,
      position_planeY
    );
    position_on_ZBefor = m.z.position_on_ZBefor(
      jumpTime,
      0.2,
      position_planeZ
    );

    // Gui
    settings.PositionX = position_on_XBefor;
    settings.PositionY = position_on_YBefor;
    settings.PositionZ = position_on_ZBefor;
    settings.speed_on_YBefor = m.y.speed_on_YBefor(jumpTime);
    settings.speed_on_XBefor = m.x.speed_on_XBefor(jumpTime);
    settings.speed_on_ZBefor = m.z.speed_on_ZBefor(jumpTime);
    settings.TotalSpeed = m.Total_speed(0, jumpTime);
    settings.Acceleration = m.Acceleration(0, jumpTime, jumpTime + 0.03);

    // if (isParachuteVisible) {
    //   scene.add(parachute);
    //   if (parachute) {
    //     position_on_XAfter = m.x.position_on_XAfter(
    //       elapsedTime,
    //       0.03,
    //       m.TimeOpen
    //     );

    //     position_on_YAfter = m.y.position_on_YAfter(
    //       elapsedTime,
    //       0.03,
    //       m.TimeOpen,
    //       m.Acceleration(0, elapsedTime, elapsedTime + 0.03)
    //     );

    //     position_on_ZAfter = m.z.position_on_ZAfter(
    //       elapsedTime,
    //       0.03,
    //       m.TimeOpen
    //     );
    //     parachute.position.set(
    //       position_on_XAfter,
    //       position_on_YAfter + 50,
    //       position_on_ZAfter
    //     );
    //   }
    //   speedafteropen = m.Total_speed(1, elapsedTime, m.TimeOpen);
    //   settings.TotalSpeed = speedafteropen;
    // }
    camera.lookAt(loadedModel.position);
    loadedModel.position.set(
      position_on_XBefor,
      position_on_YBefor,
      position_on_ZBefor
    );
    w = loadedModel.position.y;
  } else if (loadedModel && w < 0) {
    if (isParachuteVisible) {
      scene.add(parachute);
      if (parachute)
        parachute.position.set(
          position_on_XAfter,
          position_on_YAfter + 50,
          position_on_ZAfter
        );
      
      // speedafteropen = m.Total_speed(1, elapsedTime, m.TimeOpen);
      // settings.TotalSpeed = speedafteropen;
    }
    // عند وصول المظلي الى الارض عرض التسارع والموضع 0

    settings.PositionY = 0;
    settings.Acceleration = 0;
    camera.lookAt(loadedModel.position);
    // ثم الخروج من الشرط كي يتوقف تزايد القيم على المحاور
    return;
  }

  // Render
  renderer.render(scene, camera);
  renderer.setClearColor();
  // Call tick again on the next frame
  if (simulationState === "running") {
    window.requestAnimationFrame(tick);
  }
};

/**
 * controller
 */
document.addEventListener("keydown", (event) => {
  if (event.key === "s") {
    if (simulationState === "paused") {
      simulationState = "running";
      tick();
    }
  }
  if (event.key === "p") {
    if (simulationState === "running") {
      simulationState = "paused";
    }
  }
  if (event.key === "o") {
    isParachuteVisible = !isParachuteVisible;
  }
  if (event.key === "c") {
    scene.remove(parachute);
    isParachuteVisible = false;
  }
  if (event.key === "j") {
    jump = true;
  }
});
