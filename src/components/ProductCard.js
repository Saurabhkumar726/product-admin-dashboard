export default function ProductCard({
  product,
  onEdit,
  onDelete,
}) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-sm md:hidden">
      <div className="flex gap-4">
        {product.thumbnail ? (
            <img
                src={product.thumbnail}
                alt={product.title}
                className="h-20 w-20 rounded-lg object-cover"
                onError={(event) => {
                event.currentTarget.style.display =
                    "none";
                }}
            />
            ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl">
                📦
            </div>
            )}

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-gray-900">
            {product.title}
          </h2>

          <p className="mt-1 text-sm capitalize text-gray-500">
            {product.category}
          </p>

          <p className="mt-2 font-semibold text-gray-900">
            ${product.price}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm text-gray-600">
        <div className="flex gap-4">
          <span>
            ⭐ {product.rating ?? "—"}
          </span>

          <span>
            Stock: {product.stock}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(product)}
            className="rounded-lg border border-red-200 px-3 py-1.5 font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}