import { listAllReviews } from "@/lib/reviews";
import { ReviewCard } from "@/components/admin/ReviewCard";

export default async function AdminReviewsPage() {
  const reviews = await listAllReviews();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-forest-dark">口コミ管理</h1>
        <p className="text-sm text-charcoal-soft">
          アンケートで掲載許可をいただいた口コミです。公開するとトップページに表示されます。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {reviews.length === 0 && (
          <p className="col-span-2 rounded-2xl bg-white p-10 text-center text-sm text-charcoal-soft shadow-sm">
            まだ口コミがありません。
          </p>
        )}
      </div>
    </div>
  );
}
