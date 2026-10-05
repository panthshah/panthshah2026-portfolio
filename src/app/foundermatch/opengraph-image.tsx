import { contentType, shareImage, size } from "@/lib/og";

export { contentType, size };
export const alt = "Founder Match connects entrepreneurs with compatible co-founders";

export default function Image() {
  return shareImage({ title: "Founder Match connects entrepreneurs with compatible co-founders", label: "Founderway", accent: "#6b4fd0" });
}
