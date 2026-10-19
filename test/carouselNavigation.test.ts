import { describe, expect, it } from "vitest";
import { getWrappedIndex } from "../app/utils/carouselNavigation";

const next = (index: number) => getWrappedIndex(index + 1, 5);
const previous = (index: number) => getWrappedIndex(index - 1, 5);

describe("Aurora City carousel navigation", () => {
  it("moves forward through cards 1 to 5", () => {
    const sequence = [0, next(0), next(1), next(2), next(3)];

    expect(sequence).toEqual([0, 1, 2, 3, 4]);
  });

  it("moves backward through cards 5 to 1", () => {
    const sequence = [4, previous(4), previous(3), previous(2), previous(1)];

    expect(sequence).toEqual([4, 3, 2, 1, 0]);
  });

  it("wraps from card 5 to card 1", () => {
    expect(next(4)).toBe(0);
  });

  it("wraps from card 1 to card 5", () => {
    expect(previous(0)).toBe(4);
  });

  it("supports moving from card 3 to card 4 and back to card 3", () => {
    const cardFour = next(2);

    expect(cardFour).toBe(3);
    expect(previous(cardFour)).toBe(2);
  });
});
