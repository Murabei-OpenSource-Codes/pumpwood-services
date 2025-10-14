# pumpwood-services

A package with a collection of services and utilities to connect to and interact with a Pumpwood backend API. This package simplifies API requests with a configurable service class and provides helper functions for safer asynchronous operations.

## Installation

Install the package using npm:

```bash
npm install pumpwood-services
```

## Usage

This package provides main exports: `safeAwait`, `ApiService`, `ListService`, `RetrieveService`, `SaveService`, `DeleteService`, and `UploadFileService`.

### `safeAwait`

A utility function that wraps a promise and returns a tuple `[data, error]`, avoiding the need for `try...catch` blocks for handling promise rejections.

**Example:**

```typescript
import { safeAwait } from "pumpwood-services";

async function fetchData() {
  // This might throw an error
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve("Some data");
    } else {
      reject(new Error("Failed to fetch data"));
    }
  });
}

async function main() {
  const [data, error] = await safeAwait(fetchData());

  if (error) {
    console.error("An error occurred:", error.message);
    return;
  }

  console.log("Success:", data);
}

main();
```

### `ApiService`

A class for making authenticated requests to your API. It handles setting the base URL, authentication tokens, and standardizing requests.

**Example:**

```typescript
import { ApiService } from "pumpwood-services";

// Configure the ApiService
const api = new ApiService({
  baseUrl: "https://api.yourapp.com/v1",
  token: "your-secret-token",
});

async function getUser(userId: number) {
  // Define the expected response type
  interface User {
    id: number;
    name: string;
    email: string;
  }

  try {
    // Make a GET request
    const user = await api.request<User>("GET", `/users/${userId}/`);
    console.log("User found:", user);
    return user;
  } catch (error) {
    console.error("Failed to get user:", error.message);
  }
}

getUser(123);
```

### `ListService`

A convenience function that uses an `ApiService` instance to fetch a list of resources. It simplifies making `POST` requests to listing endpoints (e.g., `/your-model/list/`).

**Signature:**

```typescript
ListService<T>(
  api: ApiService,
  modelClass: string,
  body?: any,
  queryParams?: Record<string, string>
): Promise<[T | null, Error | null]>
```

**Example:**

```typescript
import { ApiService, ListService } from "pumpwood-services";

const api = new ApiService({
  baseUrl: "https://api.yourapp.com/v1",
  token: "your-secret-token",
});

interface Product {
  id: number;
  name: string;
  price: number;
}

async function listProducts() {
  const [products, error] = await ListService<Product[]>(api, "product");

  if (error) {
    console.error("Failed to list products:", error.message);
    return;
  }

  console.log("Products:", products);
}
```

### `RetrieveService`

A convenience function that uses an `ApiService` instance to fetch a single resource by its ID. It simplifies making `GET` requests to retrieve endpoints (e.g., `/your-model/retrieve/{id}/`).

**Signature:**

```typescript
RetrieveService<T>(
  api: ApiService,
  modelClass: string,
  pk: number,
  queryParams?: Record<string, string>
): Promise<[T | null, Error | null]>
```

**Example:**

```typescript
import { ApiService, RetrieveService } from 'pumpwood-services';

const api = new ApiService({
  baseUrl: 'https://api.yourapp.com/v1',
  token: 'your-secret-token',
});

interface User {
  id: number;
  name: string;
  email: string;
};e<User>(
    api,
    'users',
    userId,
    { foreign_key_fields: 'true', related_fields: 'true' }
  );

  if (error) {
    console.error('Failed to get user:', error.message);
    return;
  }

  console.log('User:', user);
}
```

### `SaveService`

A convenience function that uses an `ApiService` instance to create or update a resource. It simplifies making `POST` requests to save endpoints (e.g., `/your-model/save/`).

**Signature:**

```typescript
SaveService<T>(
  api: ApiService,
  modelClass: string,
  body: Record<any, any>,
  queryParams?: Record<string, string>
): Promise<[T | null, Error | null]>
```

**Example:**

```typescript
import { ApiService, SaveService } from "pumpwood-services";

const api = new ApiService({
  baseUrl: "https://api.yourapp.com/v1",
  token: "your-secret-token",
});

interface Product {
  id?: number;
  name: string;
  price: number;
}

async function saveProduct(productData: Product) {
  const [product, error] = await SaveService<Product>(
    api,
    "product",
    productData
  );

  if (error) {
    console.error("Failed to save product:", error.message);
    return;
  }

  console.log("Product saved:", product);
}
```

### `DeleteService`

A convenience function that uses an `ApiService` instance to delete a single resource by its ID. It simplifies making `DELETE` requests to delete endpoints (e.g., `/your-model/delete/{id}/`).

**Example:**

```typescript
import { ApiService, DeleteService } from "pumpwood-services";

// Configure the ApiService
const api = new ApiService({
  baseUrl: "https://api.yourapp.com/v1",
  token: "your-secret-token",
});

async function deleteProduct(productId: number) {
  // The response type can be void or a confirmation message
  const [response, error] = await DeleteService(api, "product", productId);

  if (error) {
    console.error("Failed to delete product:", error.message);
    return;
  }

  console.log("Product deleted successfully");
}

deleteProduct(123);
```

### `UploadFileService`

A convenience function that uses an `ApiService` instance to upload a file with associated JSON data. It simplifies making file upload requests to save endpoints (e.g., `/your-model/save/`).

**Signature:**

```typescript
UploadFileService<T>(
  api: ApiService,
  modelClass: string,
  file: File,
  jsonData: Record<string, any>,
  queryParams?: Record<string, string>
): Promise<[T | null, Error | null]>
```

**Example:**

```typescript
import { ApiService, UploadFileService } from "pumpwood-services";

const api = new ApiService({
  baseUrl: "https://api.yourapp.com/v1",
  token: "your-secret-token",
});

interface UploadResponse {
  id: number;
  filename: string;
  url: string;
}

async function uploadDocument(file: File) {
  const jsonData = {
    origin: "USER_UPLOAD",
    format_type: "MELTED",
    description: "Important document",
  };

  const [response, error] = await UploadFileService<UploadResponse>(
    api,
    "documents",
    file,
    jsonData
  );

  if (error) {
    console.error("Failed to upload file:", error.message);
    return;
  }

  console.log("File uploaded successfully:", response);
}

// Usage with file input
const fileInput = document.querySelector('input[type="file"]');
fileInput?.addEventListener('change', (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    uploadDocument(file);
  }
});
```

**Notes:**
- The file is sent as `FormData` with the file attached as `"file"` and the JSON data as `"__json__"` (stringified).
- The `Content-Type` header is automatically set by the browser to `multipart/form-data` with the appropriate boundary.
- This follows the Pumpwood backend convention for file uploads.

## Query Parameters

`ListService`, `RetrieveService`, `SaveService`, and `UploadFileService` support optional query parameters as the last parameter. Query parameters are passed as a `Record<string, string>` object and are automatically URL-encoded.

**Example:**

```typescript
const [user, error] = await RetrieveService<User>(api, "users", 123, {
  foreign_key_fields: "true",
  related_fields: "true",
});
// URL: /users/retrieve/123/?foreign_key_fields=true&related_fields=true
```

## API Reference

| Export              | Description                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `safeAwait`         | Wraps an async call in a try/catch block, returning a `[data, error]` tuple.                        |
| `ApiService`        | A class to configure and execute authenticated requests against a backend API.                      |
| `ListService`       | A function to fetch a list of items for a given model. Supports optional body and query parameters. |
| `RetrieveService`   | A function to fetch a single item by ID. Supports optional query parameters.                        |
| `SaveService`       | A function to create or update an item. Supports optional query parameters.                         |
| `DeleteService`     | A function to delete a single item by ID.                                                           |
| `UploadFileService` | A function to upload a file with JSON data to a model endpoint. Supports optional query parameters. |
| `HttpMethod`        | A type definition for HTTP methods: `"GET" \| "POST" \| "PUT" \| "DELETE"`.                         |
