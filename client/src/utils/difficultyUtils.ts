import type { Voyage } from "../types/Voyage";

export const getDifficultyClass = (
  difficulty: Voyage['difficulty']
): string => {
  const difficultyClass: Record<Exclude<Voyage['difficulty'], null>, string> = {
    Easy: "badge-success",
    Moderate: "badge-warning",
    Hard: "badge-error",
  };
  // Return fallback if null or not matched
  return difficulty ? difficultyClass[difficulty] : "badge-ghost";
};
