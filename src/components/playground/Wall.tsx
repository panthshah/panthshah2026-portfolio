import { getImageProps } from "next/image";
import type { Post } from "@/app/playground/posts";
import { WallPlayer } from "./WallPlayer";
import s from "./playground.module.css";

// Tall phone recordings sit inside a 4:5 frame instead of running very long.
const frame = ({ w, h }: Post) => (h / w <= 1.25 ? w / h : 4 / 5);
// Roughly how tall a post is in a 360px column: its film, its words (about 46 characters a line), the date row and the gap.
const height = (p: Post) => 360 / frame(p) + 20 * (1 + Math.floor(p.text.length / 46) + (p.text.match(/\n/g)?.length ?? 0)) + 88;

/** Newest first: each post goes into whichever column is shortest so far. */
function columns(posts: Post[], n: number) {
  const cols: Post[][] = Array.from({ length: n }, () => []), tall = new Array<number>(n).fill(0);
  for (const p of posts) {
    const i = tall.indexOf(Math.min(...tall));
    cols[i].push(p);
    tall[i] += height(p);
  }
  return cols;
}

const Arrow = () => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" /></svg>
);
const Speaker = () => (
  <>
    <svg className={s.off} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L73.55,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V175.09l42.08,46.29a8,8,0,1,0,11.84-10.76ZM32,96H72v64H32ZM144,207.64,88,164.09V95.89l56,61.6Zm42-63.77a24,24,0,0,0,0-31.72,8,8,0,1,1,12-10.57,40,40,0,0,1,0,52.88,8,8,0,0,1-12-10.59Zm-80.16-76a8,8,0,0,1,1.4-11.23l39.85-31A8,8,0,0,1,160,32v74.83a8,8,0,0,1-16,0V48.36l-26.94,21A8,8,0,0,1,105.84,67.91ZM248,128a79.9,79.9,0,0,1-20.37,53.34,8,8,0,0,1-11.92-10.67,64,64,0,0,0,0-85.33,8,8,0,1,1,11.92-10.67A79.83,79.83,0,0,1,248,128Z" /></svg>
    <svg className={s.on} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM32,96H72v64H32ZM144,207.64,88,164.09V91.91l56-43.55Zm54-106.08a40,40,0,0,1,0,52.88,8,8,0,0,1-12-10.58,24,24,0,0,0,0-31.72,8,8,0,0,1,12-10.58ZM248,128a79.9,79.9,0,0,1-20.37,53.34,8,8,0,0,1-11.92-10.67,64,64,0,0,0,0-85.33,8,8,0,1,1,11.92-10.67A79.83,79.83,0,0,1,248,128Z" /></svg>
  </>
);

function Card({ post }: { post: Post }) {
  const file = `/playground/${post.id}`;
  // the cover, at the column's size; the film itself only downloads once the post is near the screen
  const cover = getImageProps({ src: `${file}.jpg`, alt: "", width: post.w, height: post.h, sizes: "(min-width: 1280px) 30vw, (min-width: 700px) 46vw, 100vw" }).props;
  return (
    <article className={s.post}>
      <div className={s.clip} style={{ aspectRatio: frame(post) }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- srcset from getImageProps */}
        <img src={cover.src} srcSet={cover.srcSet} sizes={cover.sizes} alt="" loading="lazy" decoding="async" />
        <video data-src={`${file}.mp4`} muted loop playsInline preload="none" aria-label={`Film: ${post.text.split("\n")[0].slice(0, 90) || "prototype"}`} />
        <button type="button" className={s.sound} aria-pressed="false" aria-label="Sound"><Speaker /></button>
      </div>
      <p className={s.say}>{post.text}</p>
      <p className={s.by}>
        <time dateTime={post.date}>{post.shown}</time>
        <a href={`https://x.com/panthshah_/status/${post.id}`} target="_blank" rel="noopener noreferrer">View on X<Arrow /></a>
      </p>
    </article>
  );
}

/**
 * The wall: Panth's posts in staggered columns, every film playing while it is on screen.
 * The page is built ahead of time, so the wall is laid out three times (three, two and one column) and the
 * screen's width picks one; the other two are not shown, are not read out, and download nothing.
 */
export function Wall({ posts }: { posts: Post[] }) {
  return (
    <WallPlayer className={s.walls}>
      {[3, 2, 1].map((n) => (
        <div key={n} data-xr={n === 3 ? "Playground / Wall" : undefined} className={`${s.wall} ${s[`w${n}`]}`}>
          {columns(posts, n).map((col, i) => (
            <div key={i} className={s.col}>
              {col.map((p) => <Card key={p.id} post={p} />)}
            </div>
          ))}
        </div>
      ))}
    </WallPlayer>
  );
}
