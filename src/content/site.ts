import data from "./routes.json";

export const site = {
  name: data.siteName,
  email: "kenley.christina@gmail.com",
  phone: "(503) 396-9021",
  phoneHref: "tel:+15033969021",
  facebook: "https://www.facebook.com/profile.php?id=100094879916978",
  instagram: "https://www.instagram.com/christinas.cello.studio/",
  copyright: "©2019 by Christina's Cello Studio.",
};

export const nav = data.routes.map(({ path, label }) => ({ path, label }));

export function routeMeta(path: string) {
  const route = data.routes.find((r) => r.path === path);
  if (!route) throw new Error(`Unknown route: ${path}`);
  return {
    title: route.title,
    description: route.description || data.defaultDescription,
  };
}
