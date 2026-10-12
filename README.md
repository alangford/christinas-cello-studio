# Christina's Cello Studio

A React + TypeScript website built with Vite. Page content and images are stored in this project; the build does not fetch content or assets from Wix.

## Requirements

Node.js 20.19+ (or 22.12+).

## Local development and build

```bash
npm install
npm run dev       # start the local development server
npm run build     # type-check and create the production site in dist/
npm run preview   # preview the production build locally
```

The production build is a single-page application: `dist/index.html` is the only HTML entry point, with shared JavaScript/CSS and image assets alongside it. It does not generate a separate folder and `index.html` for every route. Deployment is intentionally not configured here; choose the S3 deployment process separately.

### Hosting on both domains

The app can be served on either `www.christinascellostudio.com` or `christina.alangford.io`; domain acceptance is configured in DNS and the hosting layer, not in the Vite build. If using S3 behind CloudFront:

1. Add both hostnames as **Alternate domain names (CNAMEs)** on the same CloudFront distribution.
2. Attach an ACM TLS certificate in **US East (N. Virginia / us-east-1)** that covers both hostnames.
3. Point the DNS records for both hostnames to that CloudFront distribution.
4. Configure a CloudFront Function or equivalent rewrite so requests for client-side routes (such as `/about` or `/lessons`) serve `/index.html`. Without this fallback, direct visits or refreshes on those paths can return 404 from S3.

The canonical SEO URL remains `https://www.christinascellostudio.com`. The alternate domain can still serve the app; if you want it to redirect to the canonical domain instead, configure that as a separate CloudFront redirect rule.

## Editing content

- Page text lives in `src/pages/`.
- Page titles and descriptions: `src/content/routes.json`.
- Photos and their alt text: `src/content/images.json`; image files are in `public/images/`.
- Phone, email and social links: `src/content/site.ts`.
- Colours and type sizes: `src/styles/tokens.css`.
- Testimonials and their paired images: `src/pages/Testimonials.tsx`.
- The pluckable strings on the home page are in `src/components/Strings.tsx`. Remove `<Strings />` from `src/pages/Home.tsx` to take them out.

## Contact form

A static site has nowhere to receive form posts. By default the form opens the visitor's email app with the message filled in. To have it send directly instead, copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT` to a service that accepts a JSON POST with `name`, `email` and `message`. Rebuild after changing it.
