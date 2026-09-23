"use client";

import Link from "next/link";

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md md:hidden">
      {/* Product Header */}
      <div className="flex gap-4">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          <img
            src={
              product.thumbnail ||
              product.images?.[0] ||
              "/placeholder-product.png"
            }
            alt={product.title || "Product"}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = "/placeholder-product.png";
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900">
            {product.title || "Untitled Product"}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            ID: {product.id}
          </p>

          <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700">
            {product.category || "N/A"}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Price</p>
          <p className="mt-1 font-semibold text-gray-900">
            ${Number(product.price || 0).toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Stock</p>
          <p
            className={`mt-1 font-semibold ${
              Number(product.stock) > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {product.stock ?? 0}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Rating</p>

          <div className="mt-1 flex items-center gap-1">
            <span className="text-yellow-500">★</span>

            <span className="font-semibold text-gray-900">
              {product.rating ?? "N/A"}
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Brand</p>

          <p className="mt-1 truncate font-medium text-gray-900">
            {product.brand || "N/A"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {/* View */}
        <Link
          href={`/products/${product.id}`}
          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-center text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          View
        </Link>

        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Edit
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}