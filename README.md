# pumpwood-services

Biblioteca TypeScript para conectar e interagir com uma API Pumpwood. Fornece um cliente de alto nível (`PumpwoodClient`) e serviços individuais para operações CRUD, uploads, downloads e execução de actions.

## Instalação

```bash
npm install @murabei-data-science/pumpwood-services
```

## Início rápido

### Client-side (browser)

Crie o cliente **uma vez** como singleton e importe onde precisar:

```typescript
// src/lib/pumpwood.ts
import { PumpwoodClient } from "@murabei-data-science/pumpwood-services";

export const pumpwood = new PumpwoodClient({
  baseUrl: "https://api.seuapp.com/rest",
  token: () => localStorage.getItem("auth_token") ?? "",
  //       ↑ factory: reavaliada a cada request
});
```

### Server-side (Next.js Server Actions)

```typescript
// src/lib/pumpwood.server.ts
import { PumpwoodClient } from "@murabei-data-science/pumpwood-services";
import { cookies } from "next/headers";

async function getToken(): Promise<string> {
  return (await cookies()).get("auth_token")?.value ?? "";
}

export const pumpwood = new PumpwoodClient({
  baseUrl: process.env.NEXT_PUBLIC_APP_API_URL!,
  token: getToken,
});
```

### Uso direto na page / server action

```typescript
import { pumpwood } from "@/lib/pumpwood.server";

export async function fetchVariable(id: string) {
  const [data, error] = await pumpwood.retrieve<IMyModel>(
    "mymodel",
    Number.parseInt(id, 10),
    { foreign_key_fields: true, related_fields: true },
  );
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Nenhum dado retornado");
  return data;
}
```

---

## `PumpwoodClient` — referência completa

### `list`

```typescript
pumpwood.list<T>(modelClass, body?, queryParams?)
```

`POST /{modelClass}/list/` — listagem paginada com filtros.

```typescript
const [areas, error] = await pumpwood.list<GeoArea[]>("descriptiongeoarea", {
  filter_dict: { is_active: true },
  order_by: ["-created_at"],
  limit: 20,
  offset: 0,
});
if (error) throw new Error(error.message);
```

---

### `listWithoutPag`

```typescript
pumpwood.listWithoutPag<T>(modelClass, body?, queryParams?)
```

`POST /{modelClass}/list-without-pag/` — retorna **todos** os resultados sem paginação. Use para datasets pequenos (lookups, combos, versões).

```typescript
const [allAreas, error] = await pumpwood.listWithoutPag<GeoArea[]>(
  "descriptiongeoarea",
  {
    filter_dict: { is_active: true },
    fields: ["pk", "name"],
    order_by: ["name"],
  },
);
if (error) throw new Error(error.message);
```

---

### `retrieve`

```typescript
pumpwood.retrieve<T>(modelClass, pk, options?)
```

`GET /{modelClass}/retrieve/{pk}/` — busca um registro por pk.

`options` aceita booleans diretamente (convertidos para query params internamente):

```typescript
const [area, error] = await pumpwood.retrieve<GeoArea>(
  "descriptiongeoarea",
  1,
  { foreign_key_fields: true, related_fields: true },
);
if (error) throw new Error(error.message);
```

---

### `retrieveOptions`

```typescript
pumpwood.retrieveOptions<T>(modelClass, body?)
```

`POST /{modelClass}/retrieve-options/` — busca definições de campos, choices e regras de validação do modelo.

```typescript
const [options, error] = await pumpwood.retrieveOptions("descriptiongeoarea");
if (error) throw new Error(error.message);
```

---

### `save`

```typescript
pumpwood.save<T>(modelClass, body, options?)
```

`POST /{modelClass}/save/` — cria se `pk=null`, atualiza se `pk` existe.

```typescript
const [saved, error] = await pumpwood.save<GeoArea>(
  "descriptiongeoarea",
  { pk: null, name: "Nova Área" },
  { foreign_key_fields: true },
);
if (error) throw new Error(error.message);
```

---

### `delete`

```typescript
pumpwood.delete<T>(modelClass, pk);
```

`DELETE /{modelClass}/delete/{pk}/`

```typescript
const [, error] = await pumpwood.delete("descriptiongeoarea", 1);
if (error) throw new Error(error.message);
```

---

### `uploadFile`

```typescript
pumpwood.uploadFile<T>(modelClass, file, jsonData, queryParams?)
```

`POST /{modelClass}/save/` via `multipart/form-data`. O arquivo é enviado como `"file"` e os dados JSON como `"__json__"`.

```typescript
const file = new File(["conteúdo"], "data.csv", { type: "text/csv" });
const [result, error] = await pumpwood.uploadFile("documents", file, {
  origin: "USER_UPLOAD",
  format_type: "MELTED",
});
if (error) throw new Error(error.message);
```

---

### `retrieveFile`

```typescript
pumpwood.retrieveFile(modelClass, pk, fileField?)
```

`GET /{modelClass}/retrieve-file/{pk}/?file-field={fileField}` — retorna `IFileData` (`{ blob, contentType }`).

⚠️ **Sempre use `try/finally` para revogar o URL e evitar memory leak:**

```typescript
const [fileData, error] = await pumpwood.retrieveFile("documents", 42, "file");
if (error) throw new Error(error.message);

const url = URL.createObjectURL(fileData!.blob);
try {
  window.open(url);
} finally {
  URL.revokeObjectURL(url);
}
```

---

### `executeAction`

```typescript
pumpwood.executeAction<T>({ modelClass, pk, actionName, parameters?, queryParams? })
```

`POST /{modelClass}/actions/{actionName}/{pk}/` — executa uma action em uma instância.

```typescript
const [result, error] = await pumpwood.executeAction({
  modelClass: "MaterialApprovalActivity",
  pk: 123,
  actionName: "review",
  parameters: { new_status: "approved" },
});
if (error) throw new Error(error.message);
```

---

### `executeStaticAction`

```typescript
pumpwood.executeStaticAction<T>({ modelClass, actionName, parameters?, queryParams? })
```

Wrapper de `executeAction` com `pk=0`. Para actions de classe que não operam em instância específica.

```typescript
const [stats, error] = await pumpwood.executeStaticAction({
  modelClass: "MaterialApprovalActivity",
  actionName: "get_statistics",
  parameters: { year: 2024 },
});
if (error) throw new Error(error.message);
```

---

### `executeActionFile`

```typescript
pumpwood.executeActionFile({ modelClass, pk, actionName, parameters?, queryParams? })
```

`POST /{modelClass}/actions/{actionName}/{pk}/` — action que retorna arquivo binário (Excel, PDF, CSV). Retorna `IFileData`.

⚠️ **Sempre revogue o URL após o download:**

```typescript
const [fileData, error] = await pumpwood.executeActionFile({
  modelClass: "Report",
  pk: 123,
  actionName: "export_excel",
});
if (error) throw new Error(error.message);

const url = URL.createObjectURL(fileData!.blob);
const a = document.createElement("a");
a.href = url;
a.download = "report.xlsx";
document.body.appendChild(a);
try {
  a.click();
} finally {
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

---

### `executeStaticActionFile`

```typescript
pumpwood.executeStaticActionFile({ modelClass, actionName, parameters?, queryParams? })
```

Wrapper de `executeActionFile` com `pk=0`. Para exports/geração de arquivos sem instância.

```typescript
const [fileData, error] = await pumpwood.executeStaticActionFile({
  modelClass: "DataExport",
  actionName: "generate_report",
  parameters: { year: 2024, format: "xlsx" },
});
if (error) throw new Error(error.message);

const url = URL.createObjectURL(fileData!.blob);
try {
  const a = document.createElement("a");
  a.href = url;
  a.download = "export.xlsx";
  a.click();
} finally {
  URL.revokeObjectURL(url);
}
```

---

### `loginWithCredentials`

```typescript
pumpwood.loginWithCredentials({ username, password });
```

`POST /registration/login/` — autentica com username e password, retorna o token.

```typescript
const [result, error] = await pumpwood.loginWithCredentials({
  username: "john",
  password: "secret",
});
if (error) throw new Error(error.message);

// Consumidor decide onde guardar o token (cookie, localStorage, etc.)
setCookie("PumpwoodAuthorization", result.token);
```

---

### `loginWithSSO`

```typescript
pumpwood.loginWithSSO(email);
```

`POST /registration/oauth2-login/` — inicia o fluxo SSO OAuth2, retorna a URL de redirecionamento.

```typescript
const [result, error] = await pumpwood.loginWithSSO("user@example.com");
if (error) throw new Error(error.message);

// Redireciona para o provider OAuth2
window.location.href = result.redirect_url;
```

---

### `getSSOToken`

```typescript
pumpwood.getSSOToken(url);
```

Troca a URL de callback SSO (após redirect do provider) pelo token e dados do usuário.

```typescript
// Chamado após o provider redirecionar de volta
const callbackUrl = `${baseUrl}/sso/callback/?code=xyz&state=abc`;
const [result, error] = await pumpwood.getSSOToken(callbackUrl);
if (error) throw new Error(error.message);

setCookie("PumpwoodAuthorization", result.token);
setCookie("user", JSON.stringify(result.user)); // { email, username }
```

---

## Serviços de baixo nível

Para quem precisa de controle direto, todos os serviços também são exportados individualmente e recebem um `ApiService` explícito:

```typescript
import { ApiService, ListService, RetrieveService } from "@murabei-data-science/pumpwood-services";

const api = new ApiService({ baseUrl: "...", token: "..." });

const [items, error] = await ListService<Item[]>(api, "mymodel", {
  filter_dict: {},
});
```

Serviços disponíveis: `ListService`, `ListWithoutPagService`, `RetrieveService`, `RetrieveOptionsService`, `RetrieveFileService`, `SaveService`, `DeleteService`, `UploadFileService`, `ExecuteActionService`, `ExecuteStaticActionService`, `ExecuteActionFileService`, `LoginService`, `LoginSSOService`, `GetSSOTokenService`.

---

## Erros de autenticação (401)

Quando o token expira ou é inválido, a API retorna **401**. Configure `onUnauthorized` **uma vez** no `PumpwoodClient` para limpar a sessão e redirecionar ao login:

### Server-side (Next.js Server Actions)

```typescript
// src/lib/pumpwood.server.ts
import { PumpwoodClient } from "@murabei-data-science/pumpwood-services";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getToken() {
  return (await cookies()).get("PumpwoodAuthorization")?.value ?? "";
}

async function logout() {
  (await cookies()).delete("PumpwoodAuthorization");
  (await cookies()).delete("user");
  redirect("/login?session-expired=true");
}

export const pumpwood = new PumpwoodClient({
  baseUrl: process.env.API_URL!,
  token: getToken,
  onUnauthorized: logout,
});
```

### Client-side (browser)

```typescript
export const pumpwood = new PumpwoodClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  token: () => localStorage.getItem("auth_token") ?? "",
  onUnauthorized: () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/login?session-expired=true";
  },
});
```

Uso normal — a lib chama `onUnauthorized` automaticamente antes de retornar o erro:

```typescript
const [data, error] = await pumpwood.list("mymodel", filter);
if (error) throw new Error(error.message);
```

### Uso low-level (`ApiService` direto)

```typescript
const api = new ApiService({
  baseUrl: "...",
  token: "...",
  onUnauthorized: logout,
});

// ou, sem callback:
import { isUnauthorizedError } from "@murabei-data-science/pumpwood-services";

if (isUnauthorizedError(error)) await logout();
```

O campo `error.status` (401) e o helper `isUnauthorizedError(error)` também estão disponíveis no `IErrorDict` retornado pelos serviços.

> Endpoints de login (`loginWithCredentials`, `loginWithSSO`, `getSSOToken`) **não** disparam `onUnauthorized` — 401 nesses casos significa credenciais inválidas, não sessão expirada.

---

## Tipos exportados

| Tipo / Interface        | Descrição                                                                        |
| ----------------------- | -------------------------------------------------------------------------------- |
| `IErrorDict`            | Formato padronizado de erro: `{ message, type, payload, status?, ... }`           |
| `UnauthorizedHandler`   | Callback `() => void \| Promise<void>` para sessão expirada (401)                  |
| `IFileData`             | Dados de arquivo: `{ blob: Blob, contentType: string }`                          |
| `IRetrieveOptions`      | Opções para `retrieve` e `save`: `{ foreign_key_fields?, related_fields?, ... }` |
| `ISaveOptions`          | Alias tipado para opções de `save` (mesma forma que `IRetrieveOptions`)          |
| `IPumpwoodClientConfig` | Config do `PumpwoodClient`: `{ baseUrl, token, onUnauthorized? }`                |
| `TokenProvider`         | `string` ou `() => string \| Promise<string>`                                    |
| `ApiServiceConfig`      | Config do `ApiService`: `{ baseUrl, token, onUnauthorized? }`                    |
| `HttpMethod`            | `"GET" \| "POST" \| "PUT" \| "DELETE"`                                           |
| `ILoginResult`          | Resultado de `loginWithCredentials`: `{ token: string }`                         |
| `ILoginSSOResult`       | Resultado de `loginWithSSO`: `{ redirect_url: string }`                          |
| `IGetSSOTokenUser`      | Dados do usuário SSO: `{ email: string, username: string }`                      |
| `IGetSSOTokenResult`    | Resultado de `getSSOToken`: `{ token: string, user: IGetSSOTokenUser }`          |

---

## Memory leak — downloads com Blob URL

Toda operação que retorna `IFileData` (Blob) requer que o URL criado por `URL.createObjectURL` seja revogado após o uso. Sem isso, o browser mantém a referência ao Blob em memória até o fechamento da aba.

**Padrão correto:**

```typescript
const url = URL.createObjectURL(blob);
try {
  // usa o url
} finally {
  URL.revokeObjectURL(url); // sempre executado, mesmo em caso de erro
}
```

Para detalhes e o caso especial de Next.js Server Actions (serialização Blob → `number[]`), veja [`docs/adr-execute-action-file.md`](./docs/adr-execute-action-file.md).
