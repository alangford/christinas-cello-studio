// Runs after `vite build`. For every route it writes dist/<route>/index.html with that page's own
// <title>, description, canonical URL and social tags, so that:
//   - S3 static website hosting serves every page URL directly (no rewrite rules needed)
//   - each page keeps its own search-result title and description
// It also writes 404.html, sitemap.xml and robots.txt.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const data = JSON.parse(await readFile(path.join(root, "src/content/routes.json"), "utf8"));
const siteUrl = (process.env.SITE_URL || data.siteUrl).replace(/\/+$/, "");

const escape = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const seoBlock = ({ title, description, url, noindex = false }) =>
  [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${escape(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escape(data.siteName)}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${escape(url)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
  ].join("\n    ");

const template = await readFile(path.join(dist, "index.html"), "utf8");
const marker = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
if (!marker.test(template)) {
  throw new Error("dist/index.html is missing the <!--seo:start--> / <!--seo:end--> markers.");
}
const render = (meta) => template.replace(marker, `<!--seo:start-->\n    ${seoBlock(meta)}\n    <!--seo:end-->`);

for (const route of data.routes) {
  const url = route.path === "/" ? siteUrl : `${siteUrl}${route.path}`;
  const html = render({ title: route.title, description: route.description || data.defaultDescription, url });
  const target = route.path === "/" ? path.join(dist, "index.html") : path.join(dist, route.path, "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html);
}

await writeFile(
  path.join(dist, "404.html"),
  render({
    title: `Page not found | ${data.siteName}`,
    description: data.defaultDescription,
    url: siteUrl,
    noindex: true,
  }),
);

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  data.routes
    .map((r) => `  <url><loc>${escape(r.path === "/" ? siteUrl + "/" : siteUrl + r.path)}</loc></url>`)
    .join("\n") +
  `\n</urlset>\n`;
await writeFile(path.join(dist, "sitemap.xml"), sitemap);
await writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

console.log(`[prerender] Wrote ${data.routes.length} route pages, 404.html, sitemap.xml and robots.txt for ${siteUrl}`);
