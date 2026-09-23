"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProtectedRoute from "../../../components/ProtectedRoute";
import Navbar from "../../../components/Navbar";

import { getProductById } from "../../../services/productService";

const LOCAL_PRODUCTS_KEY = "admin_local_products";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] =
    useState("");

  /*
   * LOAD PRODUCT
   */

  useEffect(() => {
    if (!productId) {
      return;
    }

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError("");
        setProduct(null);

        /*
         * First check locally-created products.
         */

        try {
          const savedProducts =
            localStorage.getItem(
              LOCAL_PRODUCTS_KEY
            );

          if (savedProducts) {
            const localProducts =
              JSON.parse(savedProducts);

            if (Array.isArray(localProducts)) {
              const localProduct =
                localProducts.find(
                  (item) =>
                    String(item.id) ===
                    String(productId)
                );

              if (localProduct) {
                setProduct(localProduct);

                setSelectedImage(
                  localProduct.thumbnail ||
                    localProduct.images?.[0] ||
                    ""
                );

                setIsLoading(false);

                return;
              }
            }
          }
        } catch (localError) {
          console.error(
            "Failed to read local products:",
            localError
          );
        }

        /*
         * If the product isn't local,
         * fetch it from DummyJSON.
         */

        const data =
          await getProductById(
            productId
          );

        if (!data) {
          setError(
            "Product not found."
          );

          return;
        }

        setProduct(data);

        setSelectedImage(
          data.thumbnail ||
            data.images?.[0] ||
            ""
        );
      } catch (error) {
        console.error(
          "Failed to load product:",
          error
        );

        if (
          error.response?.status === 404
        ) {
          setError(
            "Product not found."
          );
        } else if (
          error.response?.data?.message
        ) {
          setError(
            error.response.data.message
          );
        } else {
          setError(
            "Failed to load product. Please try again."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  /*
   * LOADING
   */

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-100">
          <Navbar />

          <main className="mx-auto max-w-7xl p-4 md:p-8">
            <div className="flex min-h-96 items-center justify-center rounded-2xl bg-white shadow-sm">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                <p className="text-gray-600">
                  Loading product...
                </p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  /*
   * PRODUCT NOT FOUND / ERROR
   */

  if (error || !product) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-100">
          <Navbar />

          <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                📦
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                Product Not Found
              </h1>

              <p className="mt-3 text-gray-600">
                The product you're looking
                for doesn't exist or could
                not be loaded.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/products"
                  )
                }
                className="mt-6 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                ← Back to Products
              </button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  /*
   * PRODUCT IMAGES
   */

  const images =
    Array.isArray(product.images) &&
    product.images.length > 0
      ? product.images
      : product.thumbnail
      ? [product.thumbnail]
      : [];

  /*
   * REVIEWS
   */

  const reviews =
    Array.isArray(product.reviews)
      ? product.reviews
      : [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <main className="mx-auto max-w-7xl p-4 md:p-8">

          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={() =>
              router.push("/products")
            }
            className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            ← Back to Products
          </button>

          {/* PRODUCT DETAILS */}

          <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">

              {/* IMAGES */}

              <div>
                <div className="flex min-h-[350px] items-center justify-center rounded-xl bg-gray-50 p-6">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.title}
                      className="max-h-[350px] w-full object-contain"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-100 text-6xl">
                      📦
                    </div>
                  )}
                </div>

                {/* IMAGE THUMBNAILS */}

                {images.length > 0 && (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {images.map(
                      (image, index) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() =>
                            setSelectedImage(
                              image
                            )
                          }
                          className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50 p-1 transition ${
                            selectedImage ===
                            image
                              ? "border-black"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.title} ${
                              index + 1
                            }`}
                            className="h-full w-full object-contain"
                          />
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* INFORMATION */}

              <div>
                <div className="mb-3">
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                    {product.category}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  {product.title}
                </h1>

                {/* RATING */}

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-yellow-500">
                      ★
                    </span>

                    <span className="font-semibold text-gray-900">
                      {product.rating ??
                        "—"}
                    </span>
                  </div>

                  <span className="text-gray-300">
                    |
                  </span>

                  <span className="text-sm text-gray-600">
                    {product.stock ??
                      0}{" "}
                    in stock
                  </span>
                </div>

                {/* PRICE */}

                <div className="mt-6">
                  <p className="text-3xl font-bold text-gray-900">
                    $
                    {Number(
                      product.price || 0
                    ).toFixed(2)}
                  </p>
                </div>

                {/* DESCRIPTION */}

                <div className="mt-8 border-t pt-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Description
                  </h2>

                  <p className="mt-3 leading-7 text-gray-600">
                    {product.description ||
                      "No description available for this product."}
                  </p>
                </div>

                {/* PRODUCT INFORMATION */}

                <div className="mt-8 grid grid-cols-2 gap-4 border-t pt-6 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">
                      Brand
                    </p>

                    <p className="mt-1 font-medium capitalize text-gray-900">
                      {product.brand ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      SKU
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {product.sku ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Weight
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {product.weight
                        ? `${product.weight} g`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* REVIEWS */}

          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Reviews
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Customer feedback for this
                  product.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-yellow-500">
                  ★
                </span>{" "}
                <span className="font-semibold text-gray-900">
                  {product.rating ??
                    "—"}
                </span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <p className="text-gray-500">
                  No reviews available for
                  this product.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {reviews.map(
                  (review, index) => (
                    <article
                      key={`${review.reviewerName}-${index}`}
                      className="rounded-xl border border-gray-200 p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {review.reviewerName ||
                              "Anonymous"}
                          </h3>

                          {review.date && (
                            <p className="mt-1 text-xs text-gray-500">
                              {new Date(
                                review.date
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0">
                          <span className="text-yellow-500">
                            {"★".repeat(
                              Math.min(
                                5,
                                Math.max(
                                  0,
                                  Number(
                                    review.rating ||
                                      0
                                  )
                                )
                              )
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 leading-6 text-gray-600">
                        {review.comment ||
                          "No comment provided."}
                      </p>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}