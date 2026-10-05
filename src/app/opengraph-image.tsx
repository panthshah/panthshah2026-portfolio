import { contentType, shareImage, size } from "@/lib/og";

export { contentType, size };
export const alt = "Hi, I am Panth, a data driven designer shaping experiences for B2B and B2C Enterprises.";

export default function Image() {
  return shareImage({ title: "Hi, I am Panth, a data driven designer shaping experiences for B2B and B2C Enterprises." });
}
