let globalId = 1000;
/**
 * Returns a random string.
 */
export default function uniqueId() {
  return `twc-${globalId++}`;
}
