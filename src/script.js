import { main } from "./main";
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

//inputs
const initialValues = {
  Ax1: 1,
  Ax2: 4,
  Ay1: 1.7, 
  Ay2: 25,
  Az1: 3,
  Az2: 8,
  Vxwind: 0,
  Vzwind: 2,
  M: 91.6,
  g: 9.81,
  Rho: 1.2,
  vx0: 500,
  vz0: 0,
  cd1: 0.25,
  cd2: 36.9,
  x0: 0,
  y0: 0,
  z0: 0,
  plan_x0: -16000,
  plan_y0: 3000,
  plan_z0: 3000,
  time: 0.03,
};

//object from class main
let m = null;
let planeTime = 0,
  jumpTime = 0,
  openTime = 0;
const updateMainInstance = () => {
  m = new main(
    initialValues.M,
    initialValues.g,
    initialValues.Rho,
    initialValues.x0,
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
    initialValues.plan_x0,
    initialValues.plan_y0,
    initialValues.plan_z0,
    initialValues.time
  );
};
// إنشاء كائن Audio
const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);

// تحميل الملف الصوتي
audioLoader.load(
  "/Helicopter Sound Effect - Flying 5 minutes(MP3_160K).mp3",
  function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false); // تكرار الصوت
    sound.setVolume(0.5); // تحديد مستوى الصوت
  }
);

let currentVolume = 0;
let isFadingIn = true;

// تشغيل الصوت وجعله يزداد تدريجياً ثم ينخفض بعد فترة زمنية
function playSoundWithFadeInAndOut() {
  if (sound.isPlaying) {
    return; // تجنب تكرار بدء التأثير أثناء تشغيل الصوت
  }

  sound.play();
  sound.setVolume(currentVolume);

  // التحكم في معدل تصاعد وانخفاض الصوت
  const fadeRate = 0.005;
  const fadeInterval = 50;

  function fade() {
    if (isFadingIn) {
      currentVolume += fadeRate;
      if (currentVolume >= 1) {
        currentVolume = 1;
        isFadingIn = false;
      }
    } else {
      currentVolume -= fadeRate;
      if (currentVolume <= 0) {
        currentVolume = 0;
        sound.stop();
        return;
      }
    }

    sound.setVolume(currentVolume);
    setTimeout(fade, fadeInterval);
  }

  fade();
}

//GUI
const gui = new dat.GUI();
const gui1 = new dat.GUI();

//GUIتحديد العناصر يلي بدي ضيفها ل
var settings = {
  Time: 0,
  TotalSpeed: 0,
  Acceleration: 0,
  PositionX: 0,
  PositionY: 0,
  PositionZ: 0,
  speed_on_Y: 0,
  speed_on_X: 0,
  speed_on_Z: 0,
 
};

//GUIاضافة عناصر العرض لواجهة
gui1.add(settings, "Time").name("Time").listen();
gui1.add(settings, "TotalSpeed").name("Total speed").listen();
gui1.add(settings, "Acceleration").name("Acceleration").listen();
gui1.add(settings, "PositionX").name("PositionX").listen();
gui1.add(settings, "PositionY").name("PositionY").listen();
gui1.add(settings, "PositionZ").name("PositionZ").listen();
gui1.add(settings, "speed_on_X").name("speed_on_X").listen();
gui1.add(settings, "speed_on_Y").name("speed_on_Y").listen();
gui1.add(settings, "speed_on_Z").name("speed_on_Z").listen();

gui1.domElement.style.cssFloat = "left";

// Add controls to the GUI
const controls2 = {
  M: gui.add(initialValues, "M"),
  plan_x0: gui.add(initialValues, "plan_x0"),
  plan_y0: gui.add(initialValues, "plan_y0"),
  plan_z0: gui.add(initialValues, "plan_z0"),
  Vxwind: gui.add(initialValues, "Vxwind"),
  Vzwind: gui.add(initialValues, "Vzwind"),
  Ax1: gui.add(initialValues, "Ax1"),
  Ax2: gui.add(initialValues, "Ax2"),
  Ay1: gui.add(initialValues, "Ay1"),
  Ay2: gui.add(initialValues, "Ay2"),
  Az1: gui.add(initialValues, "Az1"),
  Az2: gui.add(initialValues, "Az2"),
};
// Call the update function initially
updateMainInstance();

// Call the update function whenever a value changes
for (const control of Object.values(controls2)) {
  control.onChange(updateMainInstance);
}

// Loaders
const gltfLoader = new GLTFLoader();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Environment map
var loader = new THREE.TextureLoader();
/////////////////////////////////////////////
const texture = new THREE.CubeTextureLoader();
const images = texture.load([
  "/textures/environmentMaps/1/px.jpg",
  "/textures/environmentMaps/1/nx.jpg",
  "/textures/environmentMaps/1/py.jpg",
  "/textures/environmentMaps/1/ny.jpg",
  "/textures/environmentMaps/1/pz.jpg",
  "/textures/environmentMaps/1/nz.jpg",
]);
scene.images = images;
scene.background = images;
//////////////////////////////////////////////
// var texture1 = loader.load("/textures/environmentMaps/1/px.jpg");
// var texture2 = loader.load("/textures/environmentMaps/1/nx.jpg");
// var texture3 = loader.load("/textures/environmentMaps/1/py.jpg");
// var texture4 = loader.load("/textures/environmentMaps/1/ny.jpg");
// var texture5 = loader.load("/textures/environmentMaps/1/pz.jpg");
// var texture6 = loader.load("/textures/environmentMaps/1/nz.jpg");
// var materials = [
//   new THREE.MeshBasicMaterial({ map: texture1, side: THREE.BackSide }), //right
//   new THREE.MeshBasicMaterial({ map: texture2, side: THREE.BackSide }), //left
//   new THREE.MeshBasicMaterial({ map: texture3, side: THREE.BackSide }), //top
//   new THREE.MeshBasicMaterial({ map: texture4, side: THREE.BackSide }), //bottom
//   new THREE.MeshBasicMaterial({ map: texture5, side: THREE.BackSide }), //front
//   new THREE.MeshBasicMaterial({ map: texture6, side: THREE.BackSide }), //back
// ];
// const skybox = new THREE.Mesh(
//   new THREE.BoxGeometry(8000, 8000, 8000),
//   materials
// );
// scene.add(skybox);
//Models

// Model
let loadedModel = null;
gltfLoader.load("/people/scene.gltf", (gltf) => {
  loadedModel = gltf.scene;
  gltf.scene.scale.set(30, 30, 30);
});

let plane = null;
let plane1 = false;
gltfLoader.load("/models/formats/ALH.glb", (gltf) => {
  plane = gltf.scene;
  gltf.scene.scale.set(100, 100, 100);
  gltf.scene.rotation.y = Math.PI * 2.6;
});

let parachute = null;
gltfLoader.load("/parachute/scene.gltf", (gltf) => {
  parachute = gltf.scene;
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.rotation.y = Math.PI ;
});

//light by rafah
const light = new THREE.AmbientLight(0x404040, 100);
scene.add(light);

//open parachute

//Sizes
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

// Camera
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.00001,
  20000
);
// camera.position.set(-2205.686954491959, 140.69193085481754, 354.6432564935091);
camera.position.set(372.65867649793427,557.6938576339298, -1751.0948234517136);
scene.add(camera);


//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Animate
// const clock = new THREE.Clock();
// const clock2 = new THREE.Clock();
// const clock3 = new THREE.Clock();

let position_on_XBefor;
let position_on_YBefor;
let position_on_ZBefor;

let position_on_XAfter;
let position_on_YAfter;
let position_on_YAfter2;
let position_on_ZAfter;

let w = 0.0001;

let jump = false;
let simulationState = "paused";
let isParachuteVisible = false;
let x = 0;
let openParachuteTime;

const tick = () => {
  // Update controls
  controls.update();
  // scene.add(loadedModel1);
  //     scene.add(loadedModel2);

  if (plane) {
    settings.Time = planeTime;
    scene.add(plane);
    let positionPlan_on_x = m.plan_x0 + m.position_plan_onX(planeTime, m.x.Vx0);
    plane.position.set(positionPlan_on_x, m.plan_y0, m.plan_z0);
    planeTime = planeTime + m.time; // clock.getElapsedTime();
    if (plane1) {
      m.x.x0 = plane.position.x;
      m.y.y0 = plane.position.y;
      m.z.z0 = plane.position.z;
      settings.PositionX = plane.position.x;
      settings.PositionY = plane.position.y;
      settings.PositionZ = plane.position.z;
      settings.speed_on_X = m.x.Vx0;
      settings.TotalSpeed = m.x.Vx0;
      camera.lookAt(plane.position);
    }
  }
  if (loadedModel && w > 0 && jump) {
    scene.add(loadedModel);
    jumpTime = jumpTime + m.time;

    // model
    position_on_XBefor = m.x.position_on_XBefor(jumpTime, m.time);
    position_on_YBefor = m.y.position_on_YBefor(jumpTime, m.time);
    position_on_ZBefor = m.z.position_on_ZBefor(jumpTime, m.time);
    loadedModel.position.set(
      position_on_XBefor,
      position_on_YBefor,
      position_on_ZBefor
    );
    camera.lookAt(loadedModel.position);
    //camera.position.set(position_on_XBefor, 20+position_on_YBefor, position_on_ZBefor);
    w = loadedModel.position.y;

    // Gui
    settings.PositionX = position_on_XBefor;
    settings.PositionY = position_on_YBefor;
    settings.PositionZ = position_on_ZBefor;
    settings.speed_on_X = m.x.speed_on_XBefor(jumpTime);
    settings.speed_on_Y = m.y.speed_on_YBefor(jumpTime);
    settings.speed_on_Z = m.z.speed_on_ZBefor(jumpTime);
    settings.TotalSpeed = m.Total_speed(0, jumpTime);
    settings.Acceleration = m.Acceleration(0, jumpTime, 0, openTime, m.time);
  }
  if (isParachuteVisible && w > 0) {
    openParachuteTime = jumpTime;
    openTime = openTime + m.time;
    scene.add(parachute);
    let A = m.Acceleration(1, openTime, openParachuteTime, openTime, m.time);
    position_on_XAfter = m.x.position_on_XAfter(
      openTime,
      m.time,
      openParachuteTime
    );
    position_on_YAfter = m.y.position_on_YAfter(
      openTime,
      m.time +0.3,
      openParachuteTime,
      A
    );
    position_on_ZAfter = m.z.position_on_ZAfter(
      openTime,
      m.time,
      openParachuteTime
    );
    loadedModel.position.set(
      position_on_XAfter,
      position_on_YAfter,
      position_on_ZAfter
    );
    parachute.position.set(
      position_on_XAfter,
      position_on_YAfter + 100,
      position_on_ZAfter
    );
    camera.lookAt(loadedModel.position);
    //camera.position.set(position_on_XAfter,20+position_on_YAfter,position_on_ZAfter);
    w = loadedModel.position.y;
    settings.PositionX = position_on_XAfter;
    settings.PositionY = position_on_YAfter;
    settings.PositionZ = position_on_ZAfter;
    settings.speed_on_X = m.x.speed_on_XAfter(openTime, openParachuteTime);
    settings.speed_on_Y = m.y.speed_on_YAfter(openTime, openParachuteTime);
    settings.speed_on_Z = m.z.speed_on_ZAfter(openTime, openParachuteTime);
    settings.TotalSpeed = m.Total_speed(1, openTime, openParachuteTime);
    settings.Acceleration = A;
  } else if (w < 0) {
    camera.lookAt(loadedModel.position);
  }

  // Render
  renderer.render(scene, camera);
  renderer.setClearColor();
  // Call tick again on the next frame
  if (simulationState === "running") {
    window.requestAnimationFrame(tick);
  }
};

// controller

document.addEventListener("keydown", (event) => {
  if (event.key === "s") {
    if (simulationState === "paused") {
      simulationState = "running";
      playSoundWithFadeInAndOut();
      plane1 = true;
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
    jump = false;
  }
  if (event.key === "c") {
    scene.remove(parachute);
    isParachuteVisible = false;
  }
  if (event.key === "j") {
    jump = true;
    plane1 = false;
  }
});
