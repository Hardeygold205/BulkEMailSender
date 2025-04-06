import React from "react";
import Box from "@/components/Box";

export default function BackgroundGrid() {
  const rows = 12;
  const cols = 12;
  const boxes = Array.from({ length: rows * cols }, (_, i) => <Box key={i} />);

  return (
    <div className="absolute hidden lg:grid inset-0 z-0 grid-cols-12 gap-4 p-4 pointer-events-none">
      {boxes}
    </div>
  );
}
