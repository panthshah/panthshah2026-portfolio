import { contentType, shareImage, size } from "@/lib/og";

export { contentType, size };
export const alt = "Auditing accessibility across Northeastern University websites";

export default function Image() {
  return shareImage({ title: "Auditing accessibility across Northeastern University websites", label: "Northeastern University", accent: "#c9452f" });
}
