import { Chip } from "@nextui-org/react";

export default function TaskDifficultyChip({ difficulty_rating }: { difficulty_rating: 1 | 2 | 3 | 4 | 5 }) {
    switch (difficulty_rating) {
    case 1:
      return (
        <Chip className="bg-green-100 text-green-800" size="sm" variant="flat">
          ļoti viegls
        </Chip>
      );
    case 2:
      return (
        <Chip className="bg-sky-100 text-sky-800" size="sm" variant="flat">
          viegls
        </Chip>
      );
    case 3:
      return (
        <Chip className="bg-violet-100 text-violet-800" size="sm" variant="flat">
          vidēji grūts
        </Chip>
      );
    case 4:
      return (
        <Chip className="bg-yellow-100 text-yellow-800" size="sm" variant="flat">
          grūts
        </Chip>
      );
    case 5:
      return (
        <Chip className="bg-red-100 text-red-800" size="sm" variant="flat">
          ļoti grūts
        </Chip>
      );
    default:
      return null;
  }
}