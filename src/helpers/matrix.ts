// Matrix operations from Ken Perlin's notes translated to typeScript

export const matrixMultiply = (a: number[], b: number[]): number[] => {
  let dst = [];
  for (let n = 0; n < 16; n++)
    dst.push(
      a[n & 3] * b[n & 12] +
        a[(n & 3) | 4] * b[(n & 12) | 1] +
        a[(n & 3) | 8] * b[(n & 12) | 2] +
        a[(n & 3) | 12] * b[(n & 12) | 3]
    );
  return dst;
};

export const matrixTranspose = (a: number[]): number[] => [
  a[0],
  a[4],
  a[8],
  a[12],
  a[1],
  a[5],
  a[9],
  a[13],
  a[2],
  a[6],
  a[10],
  a[14],
  a[3],
  a[7],
  a[11],
  a[15],
];

export const matrixInverse = (a: number[]): number[] => {
  let dst = [];
  let det = 0;
  const cofactor = (c: number, r: number) => {
    let s = (i: number, j: number) => a[((c + i) & 3) | (((r + j) & 3) << 2)];
    return (
      ((c + r) & 1 ? -1 : 1) *
      (s(1, 1) * (s(2, 2) * s(3, 3) - s(3, 2) * s(2, 3)) -
        s(2, 1) * (s(1, 2) * s(3, 3) - s(3, 2) * s(1, 3)) +
        s(3, 1) * (s(1, 2) * s(2, 3) - s(2, 2) * s(1, 3)))
    );
  };
  for (let n = 0; n < 16; n++) dst.push(cofactor(n >> 2, n & 3));
  for (let n = 0; n < 4; n++) det += a[n] * dst[n << 2];
  for (let n = 0; n < 16; n++) dst[n] /= det;
  return dst;
};

export const matrixTransform = (m: number[], p: number[]) => {
  let x = p[0],
    y = p[1],
    z = p[2],
    w = p[3] === undefined ? 1 : p[3];
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12] * w,
    m[1] * x + m[5] * y + m[9] * z + m[13] * w,
    m[2] * x + m[6] * y + m[10] * z + m[14] * w,
    m[3] * x + m[7] * y + m[11] * z + m[15] * w,
  ];
};

export const matrixIdentity = () => [
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
];

export const matrixTranslate = (t: number[]) => [
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  t[0],
  t[1],
  t[2],
  1,
];

export const matrixScale = (s: number[]) => [
  s[0],
  0,
  0,
  0,
  0,
  s[1],
  0,
  0,
  0,
  0,
  s[2],
  0,
  0,
  0,
  0,
  1,
];

export const matrixRotx = (theta: number) => {
  let c = Math.cos(theta);
  let s = Math.sin(theta);
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
};

export const matrixRoty = (theta: number) => {
  let c = Math.cos(theta);
  let s = Math.sin(theta);
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
};

export const matrixRotz = (theta: number) => {
  let c = Math.cos(theta);
  let s = Math.sin(theta);
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

export default class Matrix {
  private _m: () => number[];
  private _top: number;
  private _stack: number[][];

  constructor() {
    this._stack = [matrixIdentity()];
    this._top = 0;
    this._m = () => this._stack[this._top];
  }

  public get() {
    return this._m();
  }

  public set(m: number[]) {
    this._stack[this._top] = m;
  }

  public identity() {
    return this.set(matrixIdentity());
  }

  public translate(t: number[]) {
    return this.set(matrixMultiply(this._m(), matrixTranslate(t)));
  }

  public scale(s: number[]) {
    return this.set(matrixMultiply(this._m(), matrixScale(s)));
  }

  public rotx(theta: number) {
    return this.set(matrixMultiply(this._m(), matrixRotx(theta)));
  }

  public roty(theta: number) {
    return this.set(matrixMultiply(this._m(), matrixRoty(theta)));
  }

  public rotz(theta: number) {
    return this.set(matrixMultiply(this._m(), matrixRotz(theta)));
  }

  public save() {
    this._stack.push(this._m());
    this._top++;
  }

  public restore() {
    if (this._top === 0) console.log('Matrix stack underflow');
    else {
      this._top--;
      this._stack.pop();
    }
  }
}
