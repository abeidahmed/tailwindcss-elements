/**
 * Checks if `value` is empty.
 *
 * @example
 *
 * isEmpty(null)
 * // => true
 *
 * isEmpty(true)
 * // => true
 *
 * isEmpty(1)
 * // => true
 *
 * isEmpty('abc')
 * // => false
 *
 * isEmpty({ a: 1 })
 * // => false
 *
 * isEmpty([1, 2, 3])
 * // => false
 *
 * isEmpty({})
 * // => true
 *
 */
export function isEmpty(value: unknown): boolean {
  if (value === null) return true;

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  for (const key in value) {
    if (Object.hasOwnProperty.call(value, key)) {
      return false;
    }
  }

  return true;
}
