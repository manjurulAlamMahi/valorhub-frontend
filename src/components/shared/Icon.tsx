import type { CSSProperties, MouseEventHandler } from "react";
import { ReactSVG } from "react-svg";

interface IconProps {
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<Element>;
  src: string;
}

const Icon = ({ src, className, style, onClick }: IconProps) => {
  return (
    <ReactSVG
      src={src}
      beforeInjection={(svg) => {
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        if (className) {
          className.split(" ").forEach((cls) => {
            if (cls) svg.classList.add(cls);
          });
        }
        if (style) Object.assign(svg.style, style);
      }}
      wrapper="span"
      style={{ display: "flex" }}
      onClick={onClick as MouseEventHandler<Element>}
    />
  );
};

export default Icon;
