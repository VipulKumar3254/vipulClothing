/** Shared brand palette. Import these values in JavaScript or use the matching
 * --color-* custom properties in stylesheets. */
export const colors = Object.freeze({
  ink: "#1b1b1e",
  inkStrong: "#142005",
  text: "#45483f",
  muted: "#75786e",
  line: "#dedfd8",
  paper: "#fbf8fc",
  surface: "#ffffff",
  surfaceSoft: "#f6f2f7",
  surfaceMuted: "#eae7eb",
  olive: "#283618",
  oliveLight: "#45513a",
  gold: "#ffdea1",
  goldText: "#745b22",
  sale: "#ba1a1a",
});

export const colorStyle = Object.freeze(
  Object.fromEntries(
    Object.entries(colors).map(([name, value]) => [
      `--color-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      value,
    ])
  )
);

export default colors;
