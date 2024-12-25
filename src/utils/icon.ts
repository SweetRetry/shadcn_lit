import { createElement, IconNode } from "lucide";

export const createLucideIcon = (
  node: IconNode,
  { width, height }: { width?: number; height?: number } = {
    width: 24,
    height: 24,
  },
) => {
  const icon = createElement(node);
  icon.setAttribute("width", `${width}px`);
  icon.setAttribute("height", `${height}px`);
  return icon;
};
