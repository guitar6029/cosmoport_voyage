export type AstroPopTheme =
  | "atomic-cherry"
  | "solar-citrus"
  | "lunar-lime"
  | "neptune-berry";

export interface AstroPopArtwork {
  label: string;
  pose: string;
  src: string;
  alt: string;
}

export interface AstroPopFlavor {
  id: string;
  name: string;
  description: string;
  slogan: string;
  theme: AstroPopTheme;
  artwork: AstroPopArtwork;
}

export const ASTROPOP_FLAVORS = [
  {
    id: "atomic-cherry-fizz",
    name: "Atomic Cherry Fizz",
    description:
      "A bright, bubbling cherry soda with enough sparkle to power your next trip around the moon.",
    slogan: "A Cherry Blast from Tomorrow!",
    theme: "atomic-cherry",
    artwork: {
      label: "Bottle and Astro Kid artwork",
      pose: "Astro Kid hugging a bottle",
      src: "/images/astro-pop/drinks/AstroPop Atomic Cherry Fizz.png",
      alt: "Vintage Atomic Cherry Fizz advertisement showing Astro Kid hugging a red AstroPop soda bottle.",
    },
  },
  {
    id: "solar-citrus-spark",
    name: "Solar Citrus Spark",
    description:
      "A golden citrus refresher that brings a little sunshine to every interplanetary picnic.",
    slogan: "Sunshine in Every Sip!",
    theme: "solar-citrus",
    artwork: {
      label: "Bottle and Astro Kid artwork",
      pose: "Astro Kid pointing toward a sunburst",
      src: "/images/astro-pop/drinks/Solar Citrus Spark Retro Poster.png",
      alt: "Vintage Solar Citrus Spark advertisement showing Astro Kid pointing toward a sunburst beside an orange AstroPop soda bottle.",
    },
  },
  {
    id: "lunar-lime-lift",
    name: "Lunar Lime Lift",
    description:
      "A cool mint-lime fizz with a crisp, refreshing lift for high-flying afternoons.",
    slogan: "A Little Lift in Every Bottle!",
    theme: "lunar-lime",
    artwork: {
      label: "Bottle and Astro Kid artwork",
      pose: "Astro Kid floating beside a bottle",
      src: "/images/astro-pop/drinks/AstroPop Lunar Lime Lift Retro Ad.png",
      alt: "Vintage Lunar Lime Lift advertisement showing Astro Kid floating beside a green AstroPop soda bottle.",
    },
  },
  {
    id: "neptune-berry-fizz",
    name: "Neptune Berry Fizz",
    description:
      "A juicy berry soda in ocean-blue hues, made for splashy adventures among the stars.",
    slogan: "A Splash from the Stars!",
    theme: "neptune-berry",
    artwork: {
      label: "Bottle and Astro Kid artwork",
      pose: "Astro Kid leaning against a bottle",
      src: "/images/astro-pop/drinks/Neptune Berry Fizz Space Adventure.png",
      alt: "Vintage Neptune Berry Fizz advertisement showing Astro Kid leaning against a blue AstroPop soda bottle.",
    },
  },
] satisfies readonly AstroPopFlavor[];
