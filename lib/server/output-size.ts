export function outputSizeFor(width: number, height: number) {
  const ratio = width / height;
  if (ratio > 1.1) return "1536x1024" as const;
  if (ratio < 0.9) return "1024x1536" as const;
  return "1024x1024" as const;
}
