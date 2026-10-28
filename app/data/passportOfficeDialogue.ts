export type StellaState = "idle" | "talking" | "happy" | "welcome";
export type PassportOfficeChoice = "apply" | "returning" | "browse";

export interface DialogueScreen {
  stella: StellaState;
  lines: string[];
  choices?: { id: PassportOfficeChoice; label: string }[];
}

export const PASSPORT_OFFICE_DIALOGUE: Record<"opening" | PassportOfficeChoice, DialogueScreen> = {
  opening: {
    stella: "welcome",
    lines: ["Oh! A visitor! Welcome to the CosmoPort Passport Bureau! How can I help you today?"],
    choices: [
      { id: "apply", label: "I'd like to apply for a passport!" },
      { id: "returning", label: "I'm a returning traveler." },
      { id: "browse", label: "Just looking around." },
    ],
  },
  apply: {
    stella: "happy",
    lines: [
      "Splendid! A new traveler! Let's get your paperwork started.",
      "The application counter is being prepared. Please check back soon for the next chapter of your voyage.",
    ],
  },
  returning: {
    stella: "happy",
    lines: [
      "Welcome back! Always a pleasure to see a familiar face!",
      "Returning-traveler passport inspection will be available in a later story.",
    ],
  },
  browse: {
    stella: "talking",
    lines: [
      "Of course! Feel free to look around. Just don't disturb the paperwork robot—he's having a difficult morning.",
    ],
  },
};

export const openingDialogueStep = (): "opening" => "opening";
export const dialogueFor = (step: "opening" | PassportOfficeChoice): DialogueScreen => PASSPORT_OFFICE_DIALOGUE[step];
