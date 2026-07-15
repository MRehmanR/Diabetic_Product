import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { fetchBlogs, BUSINESS } from "@/lib/data";

export const Route = createFileRoute("/blog/")({
  loader: () => fetchBlogs(),
  head: () => ({
    meta: [
      { title: `Blog - ${BUSINESS.name}` },
      { name: "description", content: "Read Diabetics King articles about selling unused diabetic supplies safely." },
      { property: "og:title", content: "Diabetics King Blog" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = Route.useLoaderData();

  return (
    <Layout>
      <section className="gradient-soft border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent text-secondary shadow-soft">
            <BookOpen className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-4xl font-extrabold">Diabetics King Blog</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Helpful articles about selling unused diabetic supplies, shipping, inspection, and payment.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No blog posts are published yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="flex flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{post.author}</p>
                <h2 className="mt-3 text-xl font-extrabold leading-tight">{post.title}</h2>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                <Button asChild variant="ghost" className="mt-auto w-fit px-0 pt-6">
                  <Link to="/blog/$slug" params={{ slug: post.slug }}>
                    Read article <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
