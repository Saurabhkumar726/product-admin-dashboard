export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalProducts,
  onPageChange,
  onPageSizeChange,
}) {
  const startItem =
    totalProducts === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    currentPage * pageSize,
    totalProducts
  );

  const getPageNumbers = () => {
    const pages = [];

    for (let page = 1; page <= totalPages; page++) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-medium text-gray-900">
          {startItem}–{endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900">
          {totalProducts}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor="pageSize"
          className="text-sm text-gray-600"
        >
          Page size:
        </label>

        <select
          id="pageSize"
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(Number(event.target.value))
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`rounded-lg px-3 py-2 text-sm ${
              page === currentPage
                ? "bg-black text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}