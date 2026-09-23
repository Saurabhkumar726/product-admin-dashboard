# Product Admin Dashboard

A responsive Product Admin Dashboard built with **Next.js, React, Tailwind CSS, Axios, and DummyJSON API**.

The dashboard allows authenticated users to manage products with search, category filtering, sorting, pagination, CRUD operations, and detailed product views.

---

## 🚀 Features

### Authentication
- Login using DummyJSON authentication API
- Protected product dashboard
- Logout functionality
- Authentication token stored locally
- Axios automatically attaches the authentication token to API requests
- Login error handling

### Product Management
- View products in a responsive dashboard
- Desktop table layout
- Mobile card layout
- Product image, title, category, price, rating, and stock
- View detailed product information
- Product reviews
- Product not-found handling

### Search & Filtering
- Debounced product search
- Category filtering
- Search and category filtering can be used together
- Sorting by:
  - Title
  - Price
  - Rating
- Ascending and descending sorting
- Search/filter/sort state stored in the URL

### Pagination
- API-based pagination using `limit` and `skip`
- Page navigation
- Previous / Next buttons
- Page size options:
  - 10
  - 20
  - 50
- Current result count displayed

### CRUD Operations
- Add product
- Edit product
- Delete product
- Delete confirmation modal
- Form validation
- Loading states during mutations
- Success and error messages

### Responsive Design
- Desktop product table
- Mobile product cards
- Responsive search and filter controls
- Responsive product details page

### Error & Loading Handling
- Loading states
- Empty states
- API error messages
- Retry option
- Invalid product ID handling
- Invalid pagination values handled safely

---

## 🛠️ Tech Stack

- **Next.js**
- **React**
- **JavaScript**
- **Tailwind CSS**
- **Axios**
- **DummyJSON API**
- **LocalStorage**
- **Next.js App Router**

---

## 📁 Project Structure

```text
product-admin-dashboard/
│
├── public/
│   └── placeholder-product.png
│
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.js
│   │   │
│   │   ├── products/
│   │   │   ├── page.js
│   │   │   └── [id]/
│   │   │       └── page.js
│   │   │
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   │
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── ProtectedRoute.js
│   │   ├── ProductTable.js
│   │   ├── ProductCard.js
│   │   ├── Pagination.js
│   │   ├── SearchBar.js
│   │   ├── FilterSort.js
│   │   ├── ProductFormModal.js
│   │   └── ConfirmModal.js
│   │
│   ├── hooks/
│   │   └── useDebounce.js
│   │
│   ├── lib/
│   │   └── axios.js
│   │
│   └── services/
│       ├── authService.js
│       └── productService.js
│
├── package.json
└── README.md