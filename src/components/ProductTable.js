"use client";

import Link from "next/link";

export default function ProductTable({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Product
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Category
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Price
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Stock
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Rating
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition hover:bg-gray-50"
              >
                {/* Product */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                      <img
                        src={
                          product.thumbnail ||
                          product.images?.[0] ||
                          "/placeholder-product.png"
                        }
                        alt={product.title || "Product"}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src =
                            "/placeholder-product.png";
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="max-w-[240px] truncate font-medium text-gray-900">
                        {product.title || "Untitled Product"}
                      </p>

                      <p className="text-xs text-gray-500">
                        ID: {product.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                    {product.category || "N/A"}
                  </span>
                </td>

                {/* Price */}
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">
                    ${Number(product.price || 0).toFixed(2)}
                  </span>
                </td>

                {/* Stock */}
                <td className="px-6 py-4">
                  <span
                    className={`font-medium ${
                      Number(product.stock) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock ?? 0}
                  </span>
                </td>

                {/* Rating */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium text-gray-700">
                      {product.rating ?? "N/A"}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* View */}
                    <Link
                      href={`/products/${product.id}`}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      View
                    </Link>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}