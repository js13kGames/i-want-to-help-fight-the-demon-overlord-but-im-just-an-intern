import {
  Vector,
  scaleVector,
  lengthSquared,
  canonicalAngle,
  angleVector,
  zeroVector,
  distance,
  lerp,
} from '../lib/math';
import {
  Matrix,
  matrixNew,
  setIdentityMatrix,
  translateMatrix,
  rotateMatrixFromAngle,
  Axis,
  rotateMatrixFromDirection,
} from '../lib/matrix';
import { walk } from './walk';
import { clamp } from '../lib/util';
import { frameDT } from './time';

/** Parameters for a walker. */
export interface WalkerParameters {
  /** Walking speed, in meters per second. */
  readonly speed: number;

  /** Acceleration, in meters per second squared. */
  readonly acceleration: number;

  /** Turning speed, in radians per second. */
  readonly turnSpeed: number;
}

/** An object which can walk around the level. */
export interface Walker {
  /** The current position. Updated by update(). */
  pos: Readonly<Vector>;

  /** The direction the walker is facing. */
  facing: Readonly<Vector>;

  /** The transformation matrix. Updated by update(). */
  transform: Matrix;

  /**
   * Update the walker position.
   * @param params Walking parameters.
   * @param movement The amount of movement to apply relative to the walker's
   * speed, a vector with magnitude no larger than one.
   */
  update(params: WalkerParameters, movement: Readonly<Vector>): void;
}

/**
 * Create a walker. This is not a complete entity by itself, but is a component
 * which manages the movement of an entity.
 */
export function createWalker(pos: Vector): Walker {
  const transform = matrixNew();
  let angle = 0;
  let velocity = zeroVector;
  return {
    pos,
    transform,
    facing: angleVector(angle),

    update(params: WalkerParameters, movement: Readonly<Vector>): void {
      // Calculate the new velocity.
      const targetVelocity = scaleVector(movement, params.speed);
      const maxDeltaVelocity = params.acceleration * frameDT;
      const deltaVelocity = distance(velocity, targetVelocity);
      if (deltaVelocity <= maxDeltaVelocity) {
        velocity = targetVelocity;
      } else {
        velocity = lerp(
          velocity,
          targetVelocity,
          maxDeltaVelocity / deltaVelocity,
        );
      }

      // Calculate the new position.
      this.pos = walk(this.pos, scaleVector(velocity, frameDT));

      // Calculate the new facing angle.
      if (lengthSquared(velocity)) {
        const targetAngle = Math.atan2(velocity.y, velocity.x);
        let deltaAngle = canonicalAngle(targetAngle - angle);
        const turnAmount = params.turnSpeed * frameDT;
        deltaAngle = clamp(deltaAngle, -turnAmount, turnAmount);
        angle = canonicalAngle(angle + deltaAngle);
        this.facing = angleVector(angle);
      }

      // Set the model transform.
      setIdentityMatrix(transform);
      translateMatrix(transform, [this.pos.x, this.pos.y]);
      rotateMatrixFromAngle(transform, Axis.Z, angle + 0.5 * Math.PI);
      rotateMatrixFromDirection(transform, Axis.X, 0, 1);
    },
  };
}
