# Storefront API Architecture Guide

This document explains the internal architecture and data flow of the Storefront API (`v2`). It is designed to help developers understand how requests are processed, how data is retrieved, and how the system ensures security and performance.

## 🏗️ High-Level Architecture

The Storefront API is built on **Convex**, utilizing its HTTP hosting capabilities to expose standard REST-ful endpoints. Unlike the internal Admin Dashboard which interacts directly with Convex functions via WebSockets, the Storefront API provides a universal HTTP interface accessible by any frontend framework (Next.js, React, Vue, Mobile Apps).

```mermaid
graph TD
    Client[Storefront Client\n(Netlify / Vercel)]
    
    subgraph Convex Cloud
        HTTP[HTTP Router\n(convex/http.ts)]
        
        subgraph Public API Layer
            Products[products.ts]
            Cats[categories.ts]
            Cart[cart.ts]
            Orders[orders.ts]
        end
        
        DB[(Convex Database)]
    end
    
    Client -- GET /products --> HTTP
    Client -- POST /checkout --> HTTP
    
    HTTP -- runQuery --> Products
    HTTP -- runMutation --> Cart
    
    Products -- db.query --> DB
    Cart -- db.insert --> DB
```

---

## 🔄 Request Life Cycle

When a user visits the storefront, here is exactly what happens for a typical request (e.g., "Show me T-Shirts"):

1.  **Request Entry (`http.ts`)**:
    *   The request hits `https://<deployment>.convex.cloud/api/store/nike/products`.
    *   The `http.route` handler intercepts it using `pathPrefix: "/api/store/"`.
    *   It parses the URL to extract:
        *   `orgSlug` ("nike")
        *   `resource` ("products")
        *   `resourceId` (optional)
    
2.  **Routing Logic**:
    *   The handler switches based on the `method` (GET, POST) and `resource`.
    *   It validates that `orgSlug` is present.
    *   It orchestrates the call to the internal Convex function (Query or Mutation).

3.  **Authentication & Security**:
    *   **Public Access**: Most endpoints (Products, Categories) are public and require no auth headers.
    *   **Session Access**: Cart operations require a `sessionId` passed in the body or query params. This ID owns the cart.
    *   **Order Security**: To view an order status, the API requires **both** the `orderNumber` AND the `email` associated with that order. This prevents random guessing of order IDs.

4.  **Database Query (`convex/public/*.ts`)**:
    *   The request is passed to a specific public query, e.g., `api.public.products.list`.
    *   This query:
        *   Looks up the Organization by `slug`.
        *   Checks if the Organization is active.
        *   Queries the `products` table using indexes (e.g., `by_orgId_status`).
        *   Applies filters (category, price range).
        *   Fetches related data (Variants, Stock).
        *   Returns a clean JSON object.

5.  **Response**:
    *   The `http.ts` wrapper converts the result into a standard JSON Response.
    *   It adds **CORS headers** (`Access-Control-Allow-Origin: *`) so your Netlify frontend can read the data.

---

## 🧩 Key Components

### 1. The Router (`convex/http.ts`)
This file is the "Traffic Cop". It defines the URL structure and directs traffic. It does **not** contain business logic; it just calls the appropriate internal function.

### 2. Public Queries (`convex/public/`)
These files contain the actual business logic exposed to the world.
*   `products.ts`: Verification of stock, searching, filtering.
*   `categories.ts`: Organizing navigation trees.
*   `cart.ts`: Managing temporary shopping sessions.
*   `orders.ts`: Secure lookup of order history.

### 3. Database Schema (`convex/schema.ts`)
The API relies heavily on these specific indexes for performance:
*   `products.by_orgId_status`: Fast retrieval of active products.
*   `categories.by_orgId_slug`: Quick category lookups.
*   `orders.by_orgId`: Scoping orders to a store.

---

## 🛒 The Shopping Cart Flow

The Cart is unique because it's **session-based**, not user-based.

1.  **Frontend**: Generates a random UUID (`sessionId`) on first load.
2.  **Add Item**: Sends `sessionId` + `productId` + `variantId`.
3.  **Backend**:
    *   Checks if a cart exists for this `sessionId`.
    *   If not, creates a new `carts` record.
    *   Adds/Updates `cartItems` record.
4.  **Checkout**:
    *   Takes the `cartId`.
    *   Calculates totals.
    *   Creates an `orders` record.
    *   **Crucial Step**: It copies the current product prices at the moment of purchase (snapshot), ensuring historical accuracy even if prices change later.

---

## 🚀 Deployment & Scaling

*   **Serverless**: Each API request spins up an isolated execution environment.
*   **Caching**: Convex automatically caches query results. If 100 users request the same "T-Shirts" page, the database is queried only once, and the result is cached for split-second delivery.
*   **Real-time Ready**: While this API is HTTP-based, the underlying data is reactive. The Admin Dashboard sees orders *instantly* as they come in through this API.
