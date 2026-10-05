import { contentType, shareImage, size } from "@/lib/og";

export { contentType, size };
export const alt = "Experiments, as I posted them.";

export default function Image() {
  return shareImage({ title: "Experiments, as I posted them.", label: "Playground" });
}
