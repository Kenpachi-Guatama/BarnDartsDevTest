import { NewsList } from "@/components/news/NewsList";
import { getNews } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-red-500 mb-6">News</h1>

      <NewsList news={news} />
    </div>
  );
}
