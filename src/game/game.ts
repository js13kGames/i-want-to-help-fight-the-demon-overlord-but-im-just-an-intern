import { resetTime, updateTime } from './time';
import { resetColliders, updateColliders, colliders } from './physics';
import { updateCamera } from './camera';
import {
  EntityBase,
  entities,
  particlesInstances,
  modelInstances,
  resetEntities,
} from './entity';

/** Remove dead entities from a list. */
export function clearDead<T extends EntityBase>(list: T[]): void {
  let i = 0;
  let j = 0;
  while (i < list.length) {
    const obj = list[i++];
    if (!obj.isDead) {
      list[j++] = obj;
    }
  }
  list.length = j;
}

/** Reset the game. This makes it ready for a new level. */
export function resetGame(): void {
  resetTime();
  resetEntities();
  resetColliders();
}

/** Update the game state. */
export function updateGame(curTimeMS: DOMHighResTimeStamp): void {
  updateTime(curTimeMS);
  for (const entity of entities) {
    entity.update();
  }
  updateColliders();
  clearDead(entities);
  clearDead(colliders);
  clearDead(particlesInstances);
  clearDead(modelInstances);
  updateCamera();
}