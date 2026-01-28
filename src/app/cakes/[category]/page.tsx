import CategoryClientPage from './category-client-page';

export const dynamic = 'force-dynamic';

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return <CategoryClientPage categoryId={params.category} />;
}
