"use client";

import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  price: "",
  category: "",
  stock: "",
  description: "",
};

export default function ProductFormModal({
  isOpen,
  mode = "add",
  product = null,
  categories = [],
  isSubmitting = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && product) {
      setForm({
        title: product.title || "",
        price: product.price ?? "",
        category: product.category || "",
        stock: product.stock ?? "",
        description: product.description || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [isOpen, mode, product]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      title: form.title.trim(),
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      description: form.description.trim(),
    });
  };

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit Product" : "Add Product"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Update the product information."
                : "Create a new product."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label
              htmlFor="product-title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="product-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Product title"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="product-price"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Price
              </label>

              <input
                id="product-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="99.99"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="product-stock"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Stock
              </label>

              <input
                id="product-stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="100"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="product-category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category
            </label>

            <select
              id="product-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
            >
              <option value="">Select category</option>

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

          <div>
            <label
              htmlFor="product-description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="product-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              disabled={isSubmitting}
              placeholder="Product description"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}