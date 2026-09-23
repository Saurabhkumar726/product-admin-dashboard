"use client";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full">
      <label
        htmlFor="product-search"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Search products
      </label>

      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by product name..."
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
      />
    </div>
  );
}