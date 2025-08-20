# pumpwood-services

A package with a collection of services and utilities to connect to and interact with a Pumpwood backend API. This package simplifies API requests with a configurable service class and provides helper functions for safer asynchronous operations.

## Installation

Install the package using npm:

```bash
npm install pumpwood-services
```

## Usage

This package provides three main exports: `safeAwait`, `ApiService`, and `ListService`.

### `safeAwait`

A utility function that wraps a promise and returns a tuple `[data, error]`, avoiding the need for `try...catch` blocks for handling promise rejections.

**Example:**

```typescript
import { safeAwait } from 'pumpwood-services';

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
import { ApiService } from 'pumpwood-services';

// Configure the ApiService
const api = new ApiService({
  baseUrl: 'https://api.yourapp.com/v1',
  token: 'your-secret-token',
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
    const user = await api.request<User>('GET', `/users/${userId}/`);
    console.log('User found:', user);
    return user;
  } catch (error) {
    console.error('Failed to get user:', error.message);
  }
}

getUser(123);
```

### `ListService`

A convenience function that uses an `ApiService` instance to fetch a list of resources. It simplifies making `POST` requests to listing endpoints (e.g., `/your-model/list/`).

**Example:**

```typescript
import { ApiService, ListService } from 'pumpwood-services';

// Configure the ApiService
const api = new ApiService({
  baseUrl: 'https://api.yourapp.com/v1',
  token: 'your-secret-token',
});

// Define the expected item type in the list
interface Product {
  id: number;
  name: string;
  price: number;
}

async function listProducts() {
  // The response type is an array of Products
  const [products, error] = await ListService<Product[]>(api, 'product');

  if (error) {
    console.error('Failed to list products:', error.message);
    return;
  }

  if (products) {
    console.log('Products:', products);
  }
}

listProducts();
```

## API Reference

| Export         | Description                                                                                             |
|----------------|---------------------------------------------------------------------------------------------------------|
| `safeAwait`    | Wraps an async call in a try/catch block, returning a `[data, error]` tuple.                            |
| `ApiService`   | A class to configure and execute authenticated requests against a backend API.                          |
| `ListService`  | A function to fetch a list of items for a given model using an `ApiService` instance.                   |
| `HttpMethod`   | A type definition for HTTP methods: `"GET" | "POST" | "PUT" | "DELETE"`.                               |
| `ApiServiceConfig` | An interface for the `ApiService` constructor configuration object (`{ baseUrl: string, token: string }`). |
