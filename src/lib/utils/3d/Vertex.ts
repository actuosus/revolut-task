import Mat3 from "./Mat3";
import Vec3 from "./Vec3";

export default class Vertex {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static transform(vertex: Vertex, matrix: Mat3) {
    return Vertex.fromVec3(matrix.multiply(Vertex.toVec3(vertex)));
  }

  static toVec3(vertex: Vertex) {
    return new Vec3([vertex.x, vertex.y, vertex.z]);
  }

  static fromVec3(vector: Vec3) {
    return new Vertex(vector.element(0), vector.element(1), vector.element(2));
  }
}
