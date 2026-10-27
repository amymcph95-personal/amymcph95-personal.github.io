import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

export { getSeo, workToMarkdown } from "./seo";
export { works } from "./data/works";
export { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, PERSON, EXPERIENCE, TOOLS, BIO, EMAIL, LINKEDIN_URL, AVAILABILITY } from "./data/site";

/** Renders the app for a URL to an HTML string (used by scripts/prerender.mjs). */
export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
