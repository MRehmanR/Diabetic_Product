import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { fetchBlog, BUSINESS } from "@/lib/data";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await fetchBlog(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} - ${BUSINESS.name}` : `Blog - ${BUSINESS.name}` },
      { name: "description", content: loaderData?.excerpt ?? "" },
      { property: "og:title", content: loaderData?.title ?? "Blog" },
      { property: "og:description", content: loaderData?.excerpt ?? "" },
      { property: "og:url", content: loaderData ? `/blog/${loaderData.slug}` : "/blog" },
    ],
    links: loaderData ? [{ rel: "canonical", href: `/blog/${loaderData.slug}` }] : [],
  }),
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Blog post not found</h1>
        <Button asChild className="mt-6"><Link to="/blog">Back to blog</Link></Button>
      </div>
    </Layout>
  ),
  component: BlogDetail,
});

function BlogDetail() {
  const post = Route.useLoaderData();
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout>
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/blog"><ArrowLeft className="h-4 w-4" /> Back to blog</Link>
        </Button>

        <div className="rounded-[2rem] border border-border/60 bg-card p-6 shadow-soft sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">{post.author}</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight">{post.title}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> {date}
          </div>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
          <div className="mt-8 whitespace-pre-line text-base leading-8 text-foreground">
            {post.content}
          </div>
        </div>
      </article>
    </Layout>
  );
}
