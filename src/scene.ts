import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";

export const createScene = (engine: Engine): Scene => {
  const scene = new Scene(engine);

  const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 4,
    10,
    Vector3.Zero(),
    scene
  );
  camera.attachControl(engine.getRenderingCanvas(), true);

  new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  const material = new StandardMaterial("boxMaterial", scene);
  material.diffuseColor = new Color3(0.4, 0.4, 1.0);
  box.material = material;

  return scene;
};
