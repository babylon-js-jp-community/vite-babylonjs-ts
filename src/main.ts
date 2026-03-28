import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);

const createScene = (): Scene => {
  const scene = new Scene(engine);

  const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 4,
    10,
    Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  scene.registerBeforeRender(() => {
    box.rotation.y += 0.01;
  });

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
