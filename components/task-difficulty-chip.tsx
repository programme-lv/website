import { Chip } from "@heroui/react";

const difficultyConfig: Record<1 | 2 | 3 | 4 | 5, { label: string; className: string }> = {
  1: { label: "vienkāršs", className: "bg-green-100 text-green-800" },
  2: { label: "iesildošs", className: "bg-sky-100 text-sky-800" },
  3: { label: "viltīgs", className: "bg-violet-100 text-violet-800" },
  4: { label: "sarežģīts", className: "bg-yellow-100 text-yellow-800" },
  5: { label: "ezoterisks", className: "bg-red-100 text-red-800" },
};

type TaskDifficultyChipProps = {
  descriptionId?: string;
  difficulty_rating: 1 | 2 | 3 | 4 | 5;
  size?: "sm" | "md" | "lg";
};

export default function TaskDifficultyChip({
  descriptionId,
  difficulty_rating,
  size = "sm",
}: TaskDifficultyChipProps) {
  const config = difficultyConfig[difficulty_rating];
  if (!config) return null;

  const description = `${config.label} (${difficulty_rating}/5)`;
  return (
    <Chip className={config.className} size={size} variant="soft" title={description}>
      <span id={descriptionId} className="sr-only">{description}</span>
      <span className="sm:hidden" aria-hidden>{difficulty_rating}</span>
      <span className="hidden sm:inline font-normal px-0.5" aria-hidden>{config.label}</span>
    </Chip>
  );
}
