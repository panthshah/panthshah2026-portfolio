import { contentType, shareImage, size } from "@/lib/og";

export { contentType, size };
export const alt = "Making Product Comparison Actually Work on Samsung.com";

export default function Image() {
  return shareImage({ title: "Making Product Comparison Actually Work on Samsung.com", label: "Samsung Electronics", accent: "#2f5bcf" });
}
