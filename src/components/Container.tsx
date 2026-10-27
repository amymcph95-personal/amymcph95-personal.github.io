import type { ReactNode } from "react";

/**
 * Shared content width. Figma content column is 1264px inside a 1600px frame,
 * so we cap at 1264px and use responsive gutters below that.
 */
export default function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return (
    <Tag className={`mx-auto w-full max-w-[1264px] px-5 sm:px-8 lg:px-10 xl:px-0 ${className}`}>
      {children}
    </Tag>
  );
}
