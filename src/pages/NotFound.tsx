import { Link } from "react-router";
import { PageHeader } from "../components/PageHeader";
import { usePageMeta } from "../usePageMeta";

export default function NotFound() {
  usePageMeta({
    title: "Page not found | Christina's Cello Studio",
    description: "That page doesn't exist.",
  });

  return (
    <>
      <PageHeader title="Page not found" />
      <section className="section">
        <div className="container prose">
          <p>That address doesn&rsquo;t match a page on this site.</p>
          <Link className="button button--dark" to="/">
            Go to the home page
          </Link>
        </div>
      </section>
    </>
  );
}
