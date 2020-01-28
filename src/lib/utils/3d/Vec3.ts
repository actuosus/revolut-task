import Mat3 from "./Mat3";

export default class Vec3 {
  elements: number[];

  constructor(elements: number[]) {
    if (elements.length !== 3) {
      throw new Error("Vec3 must have 3 elements");
    }

    this.elements = elements;
  }

  element(i: number) {
    if (i < 0 || i > 2) {
      throw new Error("i must be in the range 0 - 2");
    }

    return this.elements[i];
  }

  multiply(matrix: Mat3): Vec3 | Mat3 {
    if (!(matrix instanceof Mat3)) {
      throw new Error("matrix must be a Mat3");
    }

    return matrix.multiply(this);
  }
}
