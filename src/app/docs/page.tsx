import { DocumentsList } from "@/components/docs/DocumentsList";
import { getDocuments } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DocsPage() {
  const documents = await getDocuments();

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Documents</h1>

      <DocumentsList documents={documents} />
    </div>
  );
}
