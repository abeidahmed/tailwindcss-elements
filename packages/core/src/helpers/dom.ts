/**
 * Whether the element is disabled or not.
 */
export function isDisabled(element: Element) {
  return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';
}

/**
 * Sets an attribute on the element if there aren't any that is already defined.
 */
export function setSafeAttribute(element: Element, attribute: string, value: string) {
  if (!element.hasAttribute(attribute)) {
    element.setAttribute(attribute, value);
  }
}
