import { createElement, IconNode } from "lucide";

export const createLucideIcon = (
  node: IconNode,
  { width, height }: { width?: number; height?: number } = {
    width: 20,
    height: 20,
  },
) => {
  const icon = createElement(node);
  icon.setAttribute("width", `${width}px`);
  icon.setAttribute("height", `${height}px`);
  return icon;
};
