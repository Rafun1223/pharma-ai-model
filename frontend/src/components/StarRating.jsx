function StarRating({ rating, totalReviews }) {
  const fullStars = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= fullStars ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      ))}
      <span className="text-sm text-gray-500 ml-1">
        {rating > 0 ? rating.toFixed(1) : "No ratings yet"}
        {totalReviews > 0 && ` (${totalReviews})`}
      </span>
    </div>
  );
}

export default StarRating;
