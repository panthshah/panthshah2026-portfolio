// The character's camera framings (SVG viewBoxes), shared by the engine and the copter without pulling in the rig.
export const VIEW = { full: "-15.5 -7.5 31 40.5", nav: "-12.6 -2.4 25.2 25.2" } as const;
export type BotView = keyof typeof VIEW;
