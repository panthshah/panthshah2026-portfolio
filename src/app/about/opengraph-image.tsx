import { contentType, shareImage, size } from "@/lib/og";

export { contentType, size };
export const alt = "Hi, I'm Panth.";

export default function Image() {
  return shareImage({ title: "Hi, I'm Panth.", label: "About" });
}
