/**
 * Whether the element is disabled or not.
 */
export function isDisabled(element: Element) {
  return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';
}
