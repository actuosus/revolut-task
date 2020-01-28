import Vec3 from "./Vec3";

export default class Mat3 {
  elements: number[];

  constructor(elements: number[]) {
    if (elements.length !== 9) {
      throw new Error("Mat3 must have 9 elements");
    }

    this.elements = elements;
  }

  static rotationX(angle: number) {
    const a = Math.cos(angle);
    const b = Math.sin(angle);
    return new Mat3([1.0, 0.0, 0.0, 0.0, a, -b, 0.0, b, a]);
  }

  static rotationY(angle: number) {
    const a = Math.cos(angle);
    const b = Math.sin(angle);
    return new Mat3([a, 0.0, b, 0.0, 1.0, 0.0, -b, 0.0, a]);
  }

  static rotationZ(angle: number) {
    const a = Math.cos(angle);
    const b = Math.sin(angle);
    return new Mat3([a, -b, 0.0, b, a, 0.0, 0.0, 0.0, 1.0]);
  }

  element(x: number, y: number) {
    if (x < 0 || x > 2) {
      throw new Error();
    }
    if (y < 0 || y > 2) {
      throw new Error();
    }

    return this.elements[y * 3 + x];
  }

  multiply(other: Vec3): Vec3;
  multiply(other: Mat3): Mat3;
  multiply(other: Vec3 | Mat3): Vec3 | Mat3 {
    if (!(other instanceof Vec3) && !(other instanceof Mat3)) {
      throw new Error("boo");
    }
    if (other instanceof Vec3) {
      const elements = [];
      for (let y = 0; y < 3; ++y) {
        let sum = 0;
        for (let x = 0; x < 3; ++x) {
          sum += other.element(x) * this.element(x, y);
        }
        elements.push(sum);
      }
      return new Vec3(elements);
    } else {
      const elements = [];
      for (let z = 0; z < 3; ++z) {
        for (let y = 0; y < 3; ++y) {
          let sum = 0;
          for (let x = 0; x < 3; ++x) {
            sum += other.element(y, x) * this.element(x, z);
          }
          elements.push(sum);
        }
      }
      return new Mat3(elements);
    }
  }
}
