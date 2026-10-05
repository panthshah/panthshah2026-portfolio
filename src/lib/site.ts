// Where the site lives. On Vercel this is the project's production address (the custom domain once it is attached);
// anywhere else it is the domain the site is built for.
export const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://panthshah.work";

// Every page, for the sitemap.
export const PAGES = ["/", "/about", "/playground", "/samsung", "/foundermatch", "/northeastern"] as const;
