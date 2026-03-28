import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted so these are available inside hoisted vi.mock factories
const { mockScene, mockBox } = vi.hoisted(() => {
  const mockScene = {
    registerBeforeRender: vi.fn(),
    render: vi.fn(),
    meshes: [] as unknown[],
  };
  const mockBox = {
    rotation: { y: 0 },
    material: null as unknown,
  };
  return { mockScene, mockBox };
});

// Mock @babylonjs/core modules before importing createScene
vi.mock("@babylonjs/core/Engines/engine", () => ({
  Engine: vi.fn(),
}));
vi.mock("@babylonjs/core/scene", () => ({
  Scene: vi.fn().mockImplementation(class {
    registerBeforeRender = mockScene.registerBeforeRender;
    render = mockScene.render;
    meshes = mockScene.meshes;
  }),
}));
vi.mock("@babylonjs/core/Cameras/arcRotateCamera", () => ({
  ArcRotateCamera: vi.fn().mockImplementation(class {
    attachControl = vi.fn();
  }),
}));
vi.mock("@babylonjs/core/Lights/hemisphericLight", () => ({
  HemisphericLight: vi.fn().mockImplementation(class {}),
}));
vi.mock("@babylonjs/core/Meshes/meshBuilder", () => ({
  MeshBuilder: { CreateBox: vi.fn().mockReturnValue(mockBox) },
}));
vi.mock("@babylonjs/core/Maths/math.vector", () => ({
  Vector3: Object.assign(
    vi.fn().mockImplementation(class {
      constructor(public x = 0, public y = 0, public z = 0) {}
    }),
    { Zero: vi.fn().mockReturnValue({ x: 0, y: 0, z: 0 }) }
  ),
}));
vi.mock("@babylonjs/core/Materials/standardMaterial", () => ({
  StandardMaterial: vi.fn().mockImplementation(class {
    diffuseColor = null;
  }),
}));
vi.mock("@babylonjs/core/Maths/math.color", () => ({
  Color3: vi.fn().mockImplementation(class {
    constructor(public r = 0, public g = 0, public b = 0) {}
  }),
}));

import { createScene } from "../scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

describe("createScene", () => {
  let mockEngine: Engine;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset shared mock state
    mockBox.material = null;
    mockScene.registerBeforeRender.mockReset();
    mockScene.render.mockReset();

    mockEngine = {
      getRenderingCanvas: vi.fn().mockReturnValue(null),
      runRenderLoop: vi.fn(),
      resize: vi.fn(),
    } as unknown as Engine;
  });

  it("creates a scene with the given engine", () => {
    const scene = createScene(mockEngine);
    expect(Scene).toHaveBeenCalledWith(mockEngine);
    expect(scene).toBeDefined();
  });

  it("creates a box mesh", () => {
    createScene(mockEngine);
    expect(MeshBuilder.CreateBox).toHaveBeenCalledWith(
      "box",
      { size: 2 },
      expect.anything()
    );
  });

  it("applies a StandardMaterial to the box", () => {
    createScene(mockEngine);
    expect(StandardMaterial).toHaveBeenCalledWith(
      "boxMaterial",
      expect.anything()
    );
    expect(mockBox.material).not.toBeNull();
  });

  it("registers a before-render callback for rotation", () => {
    createScene(mockEngine);
    expect(mockScene.registerBeforeRender).toHaveBeenCalledTimes(1);
  });
});
