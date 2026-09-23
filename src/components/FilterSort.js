"use client";

export default function FilterSort({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  sortOrder,
  onSortChange,
}) {
  return (
    <div className="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:grid-cols-2">
      {/* CATEGORY */}

      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Category
        </label>

        <select
          id="category"
          value={selectedCategory}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
        >
          <option value="">All categories</option>

          {categories.map((category) => (
            <option
              key={category.slug}
              value={category.slug}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* SORT */}

      <div>
        <label
          htmlFor="sort"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Sort by
        </label>

        <select
          id="sort"
          value={`${sortBy}:${sortOrder}`}
          onChange={(event) =>
            onSortChange(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
        >
          <option value=":">Default</option>

          <option value="title:asc">
            Title — A to Z
          </option>

          <option value="title:desc">
            Title — Z to A
          </option>

          <option value="price:asc">
            Price — Low to High
          </option>

          <option value="price:desc">
            Price — High to Low
          </option>

          <option value="rating:asc">
            Rating — Low to High
          </option>

          <option value="rating:desc">
            Rating — High to Low
          </option>
        </select>
      </div>
    </div>
  );
}