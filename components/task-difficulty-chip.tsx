import { Chip } from "@heroui/react";

const difficultyConfig: Record<1 | 2 | 3 | 4 | 5, { label: string; className: string }> = {
  1: { label: "ļoti viegls", className: "bg-green-100 text-green-800" },
  2: { label: "viegls", className: "bg-sky-100 text-sky-800" },
  3: { label: "vidēji grūts", className: "bg-violet-100 text-violet-800" },
  4: { label: "grūts", className: "bg-yellow-100 text-yellow-800" },
  5: { label: "ļoti grūts", className: "bg-red-100 text-red-800" },
};

export default function TaskDifficultyChip({ difficulty_rating }: { difficulty_rating: 1 | 2 | 3 | 4 | 5 }) {
  const config = difficultyConfig[difficulty_rating];
  if (!config) return null;

  return (
    <Chip className={config.className} size="sm" variant="flat">
      <span className="sm:hidden">{difficulty_rating}</span>
      <span className="hidden sm:inline">{config.label}</span>
    </Chip>
  );
}