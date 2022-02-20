export const isVisible = (elem: Element) => {
  return getComputedStyle(elem).display != 'none';
};
