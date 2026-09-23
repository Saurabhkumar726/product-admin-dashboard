"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProtectedRoute from "../../components/ProtectedRoute";
import Navbar from "../../components/Navbar";
import ProductTable from "../../components/ProductTable";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import FilterSort from "../../components/FilterSort";
import ProductFormModal from "../../components/ProductFormModal";
import ConfirmModal from "../../components/ConfirmModal";

import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

import useDebounce from "../../hooks/useDebounce";

const VALID_PAGE_SIZES = [10, 20, 50];

const LOCAL_PRODUCTS_KEY = "admin_local_products";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
   * URL STATE
   */

  const getValidPage = () => {
    const page = Number(searchParams.get("page"));

    if (!Number.isInteger(page) || page < 1) {
      return 1;
    }

    return page;
  };

  const getValidPageSize = () => {
    const limit = Number(searchParams.get("limit"));

    if (!VALID_PAGE_SIZES.includes(limit)) {
      return 10;
    }

    return limit;
  };

  const currentPage = getValidPage();
  const pageSize = getValidPageSize();

  const urlSearch = searchParams.get("search") || "";
  const selectedCategory =
    searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("order") || "";

  /*
   * SEARCH
   */

  const [searchInput, setSearchInput] =
    useState(urlSearch);

  const debouncedSearch = useDebounce(
    searchInput,
    500
  );

  /*
   * PRODUCTS
   */

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] =
    useState(0);

  /*
   * LOCAL PRODUCTS
   *
   * DummyJSON mutations are simulated.
   * Products created by our dashboard are
   * persisted locally using localStorage.
   */

  const [localProducts, setLocalProducts] =
    useState([]);

  const [
    isLocalProductsLoaded,
    setIsLocalProductsLoaded,
  ] = useState(false);

  /*
   * CATEGORIES
   */

  const [categories, setCategories] =
    useState([]);

  /*
   * UI STATES
   */

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isCategoriesLoading,
    setIsCategoriesLoading,
  ] = useState(true);

  const [error, setError] = useState("");
  const [categoryError, setCategoryError] =
    useState("");

  /*
   * ADD PRODUCT
   */

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [
    isAddingProduct,
    setIsAddingProduct,
  ] = useState(false);

  /*
   * EDIT PRODUCT
   */

  const [
    isEditModalOpen,
    setIsEditModalOpen,
  ] = useState(false);

  const [
    editingProduct,
    setEditingProduct,
  ] = useState(null);

  const [
    isUpdatingProduct,
    setIsUpdatingProduct,
  ] = useState(false);

  /*
   * DELETE PRODUCT
   */

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [
    productToDelete,
    setProductToDelete,
  ] = useState(null);

  const [
    isDeletingProduct,
    setIsDeletingProduct,
  ] = useState(false);

  /*
   * MUTATION FEEDBACK
   */

  const [
    mutationMessage,
    setMutationMessage,
  ] = useState("");

  const [
    mutationError,
    setMutationError,
  ] = useState("");

  const totalPages = Math.ceil(
    totalProducts / pageSize
  );

  /*
   * SAVE LOCAL PRODUCTS
   */

  const saveLocalProducts = (
    productsToSave
  ) => {
    try {
      localStorage.setItem(
        LOCAL_PRODUCTS_KEY,
        JSON.stringify(productsToSave)
      );
    } catch (error) {
      console.error(
        "Failed to save local products:",
        error
      );
    }
  };

  /*
   * LOAD LOCAL PRODUCTS
   */

  useEffect(() => {
    try {
      const savedProducts =
        localStorage.getItem(
          LOCAL_PRODUCTS_KEY
        );

      if (savedProducts) {
        const parsedProducts =
          JSON.parse(savedProducts);

        if (Array.isArray(parsedProducts)) {
          setLocalProducts(parsedProducts);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load local products:",
        error
      );
    } finally {
      setIsLocalProductsLoaded(true);
    }
  }, []);

  /*
   * UPDATE URL
   */

  const updateUrl = ({
    page = currentPage,
    limit = pageSize,
    search = urlSearch,
    category = selectedCategory,
    sort = sortBy,
    order = sortOrder,
  } = {}) => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (search.trim()) {
      params.set(
        "search",
        search.trim()
      );
    }

    if (category.trim()) {
      params.set(
        "category",
        category.trim()
      );
    }

    if (sort.trim()) {
      params.set(
        "sortBy",
        sort.trim()
      );
    }

    if (order.trim()) {
      params.set(
        "order",
        order.trim()
      );
    }

    router.push(
      `/products?${params.toString()}`
    );
  };

  /*
   * KEEP SEARCH INPUT SYNCHRONIZED
   */

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  /*
   * DEBOUNCED SEARCH
   */

  useEffect(() => {
    if (
      debouncedSearch.trim() ===
      urlSearch.trim()
    ) {
      return;
    }

    updateUrl({
      page: 1,
      limit: pageSize,
      search: debouncedSearch,
      category: "",
      sort: sortBy,
      order: sortOrder,
    });
  }, [debouncedSearch]);

  /*
   * LOAD CATEGORIES
   */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        setCategoryError("");

        const data =
          await getCategories();

        setCategories(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );

        setCategoryError(
          "Failed to load categories."
        );
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  /*
   * LOAD PRODUCTS
   */

  useEffect(() => {
    if (!isLocalProductsLoaded) {
      return;
    }

    const controller =
      new AbortController();

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError("");

        /*
         * Find local products that match the
         * current search/category.
         */

        const matchingLocalProducts =
          localProducts.filter(
            (product) => {
              const matchesSearch =
                !urlSearch.trim() ||
                product.title
                  ?.toLowerCase()
                  .includes(
                    urlSearch
                      .trim()
                      .toLowerCase()
                  );

              const matchesCategory =
                !selectedCategory.trim() ||
                product.category ===
                  selectedCategory;

              return (
                matchesSearch &&
                matchesCategory
              );
            }
          );

        const localCount =
          matchingLocalProducts.length;

        /*
         * Local products are treated as being
         * at the beginning of the combined list.
         *
         * Calculate which local products belong
         * to the current page.
         */

        const localStart =
          (currentPage - 1) *
          pageSize;

        const localEnd =
          localStart + pageSize;

        const localProductsForPage =
          matchingLocalProducts.slice(
            localStart,
            localEnd
          );

        /*
         * Calculate how many server products
         * are needed to fill the current page.
         */

        const serverSkip = Math.max(
          0,
          localStart - localCount
        );

        const serverLimit =
          pageSize -
          localProductsForPage.length;

        let data = {
          products: [],
          total: 0,
        };

        /*
         * Only request the server if this page
         * still needs server products.
         */

        if (serverLimit > 0) {
          /*
           * SEARCH
           */

          if (urlSearch.trim()) {
            data =
              await searchProducts({
                query:
                  urlSearch.trim(),
                limit: serverLimit,
                skip: serverSkip,
                signal:
                  controller.signal,
              });
          }

          /*
           * CATEGORY
           */

          else if (
            selectedCategory.trim()
          ) {
            data =
              await getProductsByCategory({
                category:
                  selectedCategory,
                limit: serverLimit,
                skip: serverSkip,
                sortBy:
                  sortBy || undefined,
                order:
                  sortOrder || undefined,
                signal:
                  controller.signal,
              });
          }

          /*
           * NORMAL PRODUCTS
           */

          else {
            data = await getProducts({
              limit: serverLimit,
              skip: serverSkip,
              sortBy:
                sortBy || undefined,
              order:
                sortOrder || undefined,
              signal:
                controller.signal,
            });
          }
        } else {
          /*
           * We still need the server total
           * for pagination if the current page
           * contains only local products.
           */

          if (urlSearch.trim()) {
            data =
              await searchProducts({
                query:
                  urlSearch.trim(),
                limit: 1,
                skip: 0,
                signal:
                  controller.signal,
              });
          } else if (
            selectedCategory.trim()
          ) {
            data =
              await getProductsByCategory({
                category:
                  selectedCategory,
                limit: 1,
                skip: 0,
                sortBy:
                  sortBy || undefined,
                order:
                  sortOrder || undefined,
                signal:
                  controller.signal,
              });
          } else {
            data = await getProducts({
              limit: 1,
              skip: 0,
              sortBy:
                sortBy || undefined,
              order:
                sortOrder || undefined,
              signal:
                controller.signal,
            });
          }
        }

        if (
          controller.signal.aborted
        ) {
          return;
        }

        const serverProducts =
          data.products || [];

        const serverTotal =
          data.total || 0;

        /*
         * Combine local + server products.
         */

        const combinedProducts = [
          ...localProductsForPage,
          ...serverProducts,
        ];

        setProducts(
          combinedProducts.slice(
            0,
            pageSize
          )
        );

        /*
         * Total = server products + local products.
         */

        const combinedTotal =
          serverTotal + localCount;

        setTotalProducts(
          combinedTotal
        );

        /*
         * INVALID PAGE PROTECTION
         */

        const calculatedTotalPages =
          Math.ceil(
            combinedTotal / pageSize
          );

        if (
          calculatedTotalPages > 0 &&
          currentPage >
            calculatedTotalPages
        ) {
          updateUrl({
            page:
              calculatedTotalPages,
            limit: pageSize,
            search: urlSearch,
            category:
              selectedCategory,
            sort: sortBy,
            order: sortOrder,
          });
        }
      } catch (error) {
        if (
          error.code ===
            "ERR_CANCELED" ||
          controller.signal.aborted
        ) {
          return;
        }

        console.error(
          "Failed to load products:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Failed to load products. Please try again."
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [
    currentPage,
    pageSize,
    urlSearch,
    selectedCategory,
    sortBy,
    sortOrder,
    localProducts,
    isLocalProductsLoaded,
  ]);

  /*
   * ADD PRODUCT
   */

  const handleAddProduct = async (
    productData
  ) => {
    try {
      setIsAddingProduct(true);
      setMutationError("");
      setMutationMessage("");

      console.log(
        "Adding product:",
        productData
      );

      const createdProduct =
        await addProduct(
          productData
        );

      console.log(
        "Product created successfully:",
        createdProduct
      );

      /*
       * DummyJSON POST is simulated.
       * Mark the product as local.
       */

      const productToAdd = {
        ...createdProduct,
        ...productData,
        _isLocal: true,
      };

      /*
       * Save product to localStorage.
       */

      setLocalProducts(
        (previous) => {
          const updated = [
            productToAdd,
            ...previous,
          ];

          saveLocalProducts(
            updated
          );

          return updated;
        }
      );

      setIsAddModalOpen(false);

      setMutationMessage(
        "Product added successfully."
      );

      setTimeout(() => {
        setMutationMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Add product failed:",
        error
      );

      if (
        error.code ===
        "ECONNABORTED"
      ) {
        setMutationError(
          "The request timed out. Please try again."
        );
      } else if (
        error.response?.data
          ?.message
      ) {
        setMutationError(
          error.response.data.message
        );
      } else if (error.message) {
        setMutationError(
          error.message
        );
      } else {
        setMutationError(
          "Failed to add product. Please try again."
        );
      }
    } finally {
      setIsAddingProduct(false);
    }
  };

  /*
   * OPEN EDIT MODAL
   */

  const handleOpenEdit = (
    product
  ) => {
    setMutationError("");
    setMutationMessage("");

    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  /*
   * CLOSE EDIT MODAL
   */

  const handleCloseEdit = () => {
    if (isUpdatingProduct) {
      return;
    }

    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  /*
   * UPDATE PRODUCT
   */

  const handleUpdateProduct =
    async (productData) => {
      if (!editingProduct) {
        return;
      }

      try {
        setIsUpdatingProduct(true);
        setMutationError("");
        setMutationMessage("");

        console.log(
          "Updating product:",
          editingProduct.id,
          productData
        );

        /*
         * LOCAL PRODUCT
         */

        if (
          editingProduct._isLocal
        ) {
          const productToUpdate = {
            ...editingProduct,
            ...productData,
          };

          setLocalProducts(
            (previous) => {
              const updated =
                previous.map(
                  (product) =>
                    product.id ===
                    editingProduct.id
                      ? productToUpdate
                      : product
                );

              saveLocalProducts(
                updated
              );

              return updated;
            }
          );

          setProducts(
            (previous) =>
              previous.map(
                (product) =>
                  product.id ===
                  editingProduct.id
                    ? productToUpdate
                    : product
              )
          );

          setIsEditModalOpen(
            false
          );

          setEditingProduct(null);

          setMutationMessage(
            "Product updated successfully."
          );

          setTimeout(() => {
            setMutationMessage("");
          }, 3000);

          return;
        }

        /*
         * REAL DUMMYJSON PRODUCT
         */

        const updatedProduct =
          await updateProduct(
            editingProduct.id,
            productData
          );

        console.log(
          "Product updated successfully:",
          updatedProduct
        );

        const productToUpdate = {
          ...editingProduct,
          ...updatedProduct,
          ...productData,
        };

        setProducts(
          (previous) =>
            previous.map(
              (product) =>
                product.id ===
                editingProduct.id
                  ? productToUpdate
                  : product
            )
        );

        setIsEditModalOpen(
          false
        );

        setEditingProduct(null);

        setMutationMessage(
          "Product updated successfully."
        );

        setTimeout(() => {
          setMutationMessage("");
        }, 3000);
      } catch (error) {
        console.error(
          "Update product failed:",
          error
        );

        if (
          error.code ===
          "ECONNABORTED"
        ) {
          setMutationError(
            "The update request timed out. Please try again."
          );
        } else if (
          error.response?.data
            ?.message
        ) {
          setMutationError(
            error.response.data.message
          );
        } else if (
          error.message
        ) {
          setMutationError(
            error.message
          );
        } else {
          setMutationError(
            "Failed to update product. Please try again."
          );
        }
      } finally {
        setIsUpdatingProduct(
          false
        );
      }
    };

  /*
   * OPEN DELETE MODAL
   */

  const handleOpenDelete = (
    product
  ) => {
    setMutationError("");
    setMutationMessage("");

    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  /*
   * CLOSE DELETE MODAL
   */

  const handleCloseDelete = () => {
    if (isDeletingProduct) {
      return;
    }

    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  /*
   * DELETE PRODUCT
   */

  const handleDeleteProduct =
    async () => {
      if (!productToDelete) {
        return;
      }

      try {
        setIsDeletingProduct(true);
        setMutationError("");
        setMutationMessage("");

        console.log(
          "Deleting product:",
          productToDelete.id
        );

        /*
         * LOCAL PRODUCT
         */

        if (
          productToDelete._isLocal
        ) {
          setLocalProducts(
            (previous) => {
              const updated =
                previous.filter(
                  (product) =>
                    product.id !==
                    productToDelete.id
                );

              saveLocalProducts(
                updated
              );

              return updated;
            }
          );

          setProducts(
            (previous) =>
              previous.filter(
                (product) =>
                  product.id !==
                  productToDelete.id
              )
          );

          setTotalProducts(
            (previous) =>
              Math.max(
                previous - 1,
                0
              )
          );

          setIsDeleteModalOpen(
            false
          );

          setProductToDelete(
            null
          );

          setMutationMessage(
            "Product deleted successfully."
          );

          setTimeout(() => {
            setMutationMessage("");
          }, 3000);

          return;
        }

        /*
         * REAL DUMMYJSON PRODUCT
         */

        await deleteProduct(
          productToDelete.id
        );

        console.log(
          "Product deleted successfully:",
          productToDelete.id
        );

        setProducts(
          (previous) =>
            previous.filter(
              (product) =>
                product.id !==
                productToDelete.id
            )
        );

        setTotalProducts(
          (previous) =>
            Math.max(
              previous - 1,
              0
            )
        );

        setIsDeleteModalOpen(
          false
        );

        setProductToDelete(
          null
        );

        setMutationMessage(
          "Product deleted successfully."
        );

        setTimeout(() => {
          setMutationMessage("");
        }, 3000);
      } catch (error) {
        console.error(
          "Delete product failed:",
          error
        );

        if (
          error.response?.data
            ?.message
        ) {
          setMutationError(
            error.response.data.message
          );
        } else if (
          error.message
        ) {
          setMutationError(
            error.message
          );
        } else {
          setMutationError(
            "Failed to delete product. Please try again."
          );
        }
      } finally {
        setIsDeletingProduct(
          false
        );
      }
    };

  /*
   * CATEGORY CHANGE
   */

  const handleCategoryChange = (
    category
  ) => {
    setSearchInput("");

    updateUrl({
      page: 1,
      limit: pageSize,
      search: "",
      category,
      sort: sortBy,
      order: sortOrder,
    });
  };

  /*
   * SORT CHANGE
   */

  const handleSortChange = (
    value
  ) => {
    const [
      newSortBy,
      newSortOrder,
    ] = value.split(":");

    updateUrl({
      page: 1,
      limit: pageSize,
      search: urlSearch,
      category:
        selectedCategory,
      sort:
        newSortBy || "",
      order:
        newSortOrder || "",
    });
  };

  /*
   * PAGE CHANGE
   */

  const handlePageChange = (
    page
  ) => {
    if (page < 1) {
      return;
    }

    if (
      totalPages > 0 &&
      page > totalPages
    ) {
      return;
    }

    updateUrl({
      page,
      limit: pageSize,
      search: urlSearch,
      category:
        selectedCategory,
      sort: sortBy,
      order: sortOrder,
    });
  };

  /*
   * PAGE SIZE CHANGE
   */

  const handlePageSizeChange = (
    size
  ) => {
    if (
      !VALID_PAGE_SIZES.includes(
        size
      )
    ) {
      return;
    }

    updateUrl({
      page: 1,
      limit: size,
      search: urlSearch,
      category:
        selectedCategory,
      sort: sortBy,
      order: sortOrder,
    });
  };

  /*
   * RENDER
   */

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <main className="mx-auto max-w-7xl p-4 md:p-8">

          {/* HEADER */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Product Dashboard
              </h1>

              <p className="mt-2 text-gray-600">
                Manage your products from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMutationError("");
                setMutationMessage("");
                setIsAddModalOpen(true);
              }}
              className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              + Add Product
            </button>
          </div>

          {/* SUCCESS MESSAGE */}

          {mutationMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {mutationMessage}
            </div>
          )}

          {/* MUTATION ERROR */}

          {mutationError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {mutationError}
            </div>
          )}

          {/* SEARCH */}

          <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            <SearchBar
              value={searchInput}
              onChange={
                setSearchInput
              }
            />
          </div>

          {/* FILTER + SORT */}

          <div className="mb-6">
            {isCategoriesLoading ? (
              <div className="rounded-xl bg-white p-4 text-sm text-gray-500 shadow-sm">
                Loading categories...
              </div>
            ) : (
              <FilterSort
                categories={
                  categories
                }
                selectedCategory={
                  selectedCategory
                }
                onCategoryChange={
                  handleCategoryChange
                }
                sortBy={sortBy}
                sortOrder={
                  sortOrder
                }
                onSortChange={
                  handleSortChange
                }
                isSearchActive={Boolean(
                  urlSearch.trim()
                )}
              />
            )}

            {categoryError && (
              <p className="mt-2 text-sm text-red-600">
                {categoryError}
              </p>
            )}
          </div>

          {/* LOADING */}

          {isLoading && (
            <div className="flex min-h-64 items-center justify-center rounded-xl bg-white shadow-sm">
              <p className="text-gray-600">
                Loading products...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!isLoading &&
            error && (
              <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                <p className="mb-4 text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Retry
                </button>
              </div>
            )}

          {/* EMPTY */}

          {!isLoading &&
            !error &&
            products.length === 0 && (
              <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                <p className="text-gray-600">
                  No products found.
                </p>

                {(urlSearch ||
                  selectedCategory) && (
                  <p className="mt-2 text-sm text-gray-400">
                    Try changing your search or
                    category filter.
                  </p>
                )}
              </div>
            )}

          {/* PRODUCTS */}

          {!isLoading &&
            !error &&
            products.length > 0 && (
              <>
                <ProductTable
                  products={
                    products
                  }
                  onEdit={
                    handleOpenEdit
                  }
                  onDelete={
                    handleOpenDelete
                  }
                />

                <div className="space-y-4">
                  {products.map(
                    (product) => (
                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                        onEdit={
                          handleOpenEdit
                        }
                        onDelete={
                          handleOpenDelete
                        }
                      />
                    )
                  )}
                </div>

                <Pagination
                  currentPage={
                    currentPage
                  }
                  totalPages={
                    totalPages
                  }
                  pageSize={
                    pageSize
                  }
                  totalProducts={
                    totalProducts
                  }
                  onPageChange={
                    handlePageChange
                  }
                  onPageSizeChange={
                    handlePageSizeChange
                  }
                />
              </>
            )}
        </main>

        {/* ADD PRODUCT MODAL */}

        <ProductFormModal
          isOpen={
            isAddModalOpen
          }
          mode="add"
          categories={
            categories
          }
          isSubmitting={
            isAddingProduct
          }
          onClose={() =>
            setIsAddModalOpen(
              false
            )
          }
          onSubmit={
            handleAddProduct
          }
        />

        {/* EDIT PRODUCT MODAL */}

        <ProductFormModal
          isOpen={
            isEditModalOpen
          }
          mode="edit"
          product={
            editingProduct
          }
          categories={
            categories
          }
          isSubmitting={
            isUpdatingProduct
          }
          onClose={
            handleCloseEdit
          }
          onSubmit={
            handleUpdateProduct
          }
        />

        {/* DELETE CONFIRMATION MODAL */}

        <ConfirmModal
          isOpen={
            isDeleteModalOpen
          }
          title="Delete Product"
          message={
            productToDelete
              ? `Are you sure you want to delete "${productToDelete.title}"? This action cannot be undone.`
              : "Are you sure you want to delete this product?"
          }
          isDeleting={
            isDeletingProduct
          }
          onCancel={
            handleCloseDelete
          }
          onConfirm={
            handleDeleteProduct
          }
        />
      </div>
    </ProtectedRoute>
  );
}