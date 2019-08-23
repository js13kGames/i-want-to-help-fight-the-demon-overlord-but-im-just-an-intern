/**
 * The camere.
 */

import { canvas } from './global';
import {
  matrixMultiply,
  Axis,
  rotationMatrix,
  translationMatrix,
} from './matrix';

/** The view projection matrix. */
export const cameraMatrix = new Float32Array(16);

/** Matrix to be multiplied into the camera matrix. */
const componentMatrix = new Float32Array(16);

/**
 * Update the camera.
 */
export function updateCamera(): void {
  // Set up projection matrix.
  //
  // zNear: near Z clip plane
  // zFar: far Z clip plane
  // mx: slope of X clip planes, mx = tan(fovX / 2)
  // my: slope of Y clip planes, my = tan(fovY / 2)
  //
  // [ 1 / mx, 0, 0, 0 ]
  // [ 0, 1 / my, 0, 0 ]
  // [ 0, 0, -(far + near) / (far - near), -2 * far * near / (far - near) ]
  // [ 0, 0, -1, 0 ]
  const zNear = 0.1,
    zFar = 20;
  const mx = 0.7,
    my = (mx * canvas.clientHeight) / canvas.clientWidth;
  cameraMatrix.fill(0);
  cameraMatrix[0] = 0.5 / mx;
  cameraMatrix[5] = 0.5 / my;
  cameraMatrix[10] = (zNear + zFar) / (zNear - zFar);
  cameraMatrix[11] = -1;
  cameraMatrix[14] = (2 * zNear * zFar) / (zNear - zFar);

  // Rotate.
  rotationMatrix(componentMatrix, Axis.X, Math.PI * 0.25);
  matrixMultiply(cameraMatrix, cameraMatrix, componentMatrix);
  rotationMatrix(componentMatrix, Axis.Z, Math.PI * 0.25);
  matrixMultiply(cameraMatrix, cameraMatrix, componentMatrix);

  // Transpose.
  translationMatrix(componentMatrix, [-2, 2, -2]);
  matrixMultiply(cameraMatrix, cameraMatrix, componentMatrix);
}
