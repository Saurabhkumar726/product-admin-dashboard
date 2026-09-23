export default function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <div className="hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
      <table className="w-full text-left">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Product
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Category
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Price
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Rating
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Stock
            </th>

            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {products.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  {product.thumbnail ? (
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-12 w-12 rounded-lg object-cover"
                        onError={(event) => {
                        event.currentTarget.style.display =
                            "none";
                        }}
                    />
                    ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-lg">
                        📦
                    </div>
                    )}

                  <span className="font-medium text-gray-900">
                    {product.title}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 text-sm capitalize text-gray-600">
                {product.category}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                ${product.price}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                ⭐ {product.rating ?? "—"}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {product.stock}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
  );
}