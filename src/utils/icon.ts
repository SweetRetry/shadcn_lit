import { createElement, IconNode } from "lucide";

export const createLucideIcon = (
  node: IconNode,
  {
    width,
    height,
    size,
  }: { width?: number; height?: number; size?: number } = {
    width: 20,
    height: 20,
  },
) => {
  const icon = createElement(node);
  icon.setAttribute("width", `${width || size}px`);
  icon.setAttribute("height", `${height || size}px`);
  return icon;
};
