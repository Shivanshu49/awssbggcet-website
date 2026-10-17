import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.ComponentProps<"div"> {
  size?: "default" | "wide" | "narrow";
}

export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  const maxW =
    size === "wide"
      ? "max-w-7xl"
      : size === "narrow"
        ? "max-w-4xl"
        : "max-w-6xl";

  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", maxW, className)}
      {...props}
    />
  );
}
