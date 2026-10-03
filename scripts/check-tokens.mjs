// Fails if any class uses an arbitrary value (e.g. `gap-[13px]`, `text-[#333]`)
// instead of a design token from src/app/globals.css.
// Opt a line out with a trailing `// token-ok: <reason>` comment.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src";
const EXT = /\.(tsx?|jsx?|mdx?)$/;
const ARBITRARY = /\b[a-z][\w-]*-\[[^\]\s]+\](?!:)/g; // values, not variants like data-[x]:

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : EXT.test(name) ? [path] : [];
  });
}

const problems = [];
for (const file of walk(ROOT)) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (line.includes("token-ok:")) return;
      for (const match of line.matchAll(ARBITRARY)) {
        problems.push(`${file}:${i + 1}  ${match[0]}`);
      }
    });
}

if (problems.length) {
  console.error(`Off-token values (use a step from globals.css):\n${problems.join("\n")}`);
  process.exit(1);
}
console.log("check:tokens ✓ no off-token values");
