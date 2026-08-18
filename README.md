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
  const [data, error] = await pumpwood.retrieve<IMyModel>({
    modelClass: "mymodel",
    pk: Number.parseInt(id, 10),
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Nenhum dado retornado");
  return data;
}
```

---

## Parâmetros achatados

Todos os métodos CRUD recebem **um único objeto** com `modelClass` explícito
e todos os demais parâmetros no **topo** — sem wrapper `body`. A única
exceção é o payload arbitrário de `save` (`body`) e de `uploadFile`
(`jsonData`), que ficam aninhados porque os campos do modelo colidiriam com
os parâmetros de controle.

```typescript
await pumpwood.list({
  modelClass: modelClass.DATA_INPUT_GEO_DATABASE_VARIABLE,
  filter_dict: filters,
  exclude_dict: { pk__in: excludePks },
  fields: ["pk", "description"],
  order_by: [ordering],
  limit: PAGE_SIZE,
  foreign_key_fields: false,
  related_fields: false,
});
```

O client decide o canal HTTP de cada parâmetro, alinhado ao backend
Pumpwood:

| Método | Canal dos parâmetros |
| ------ | -------------------- |
| `list`, `listWithoutPag`, `listByChunks`, `aggregate` | POST body (exceto `base_filter_skip`, que vai na query em `list*`) |
| `retrieve`, `save`, `uploadFile`, `delete`, `retrieveFile` | query params |

### Defaults

| Campo | Default | Métodos |
| ----- | ------- | ------- |
| `filter_dict` | `{}` | `list`, `listWithoutPag`, `listByChunks`, `aggregate` |
| `exclude_dict` | `{}` | `list`, `listWithoutPag`, `listByChunks`, `aggregate` |
| `limit` | `50` | `list` |
| `chunkSize` | `100` | `listByChunks` |
| `maxItems` | omitido (sem limite total) | `listByChunks` |
| `order_by` | omitido (sem ordenação explícita) | `list`, `listWithoutPag` |
| `order_by` | `[]` | `aggregate` |
| `show_deleted` | `false` | `aggregate` |
| `fields` | omitido (retorna o serializer completo) | todos |
| `default_fields` | `false` | `list`, `listWithoutPag`, `listByChunks`, `retrieve`, `save` |
| `foreign_key_fields` | `true` | `list`, `listWithoutPag`, `listByChunks`, `retrieve`, `save`, `uploadFile` |
| `related_fields` | `true` | `list`, `listWithoutPag`, `listByChunks`, `retrieve`, `save`, `uploadFile` |

Para trazer só o essencial, passe `foreign_key_fields: false` e
`related_fields: false` explicitamente.

### Paginação

| Método | Quando usar |
| ------ | ----------- |
| `list` | UI paginada / load more manual (`exclude_dict.pk__in`) |
| `listByChunks` | Buscar o conjunto completo em chunks (FK selects, exports) |
| `listWithoutPag` | Datasets pequenos conhecidos, um único request |

`list` **não** aceita `offset`. A paginação Pumpwood é feita excluindo as
pks já carregadas:

```typescript
await pumpwood.list({
  modelClass: "mymodel",
  exclude_dict: { pk__in: loadedPks },
  limit: 50,
});
```

### `extraOptions`

Escape hatch para qualquer parâmetro ainda não tipado pela lib. Os valores
viajam pelo **mesmo canal** dos demais parâmetros do método (POST body em
`list*`, query params nos outros):

```typescript
await pumpwood.list({
  modelClass: "mymodel",
  extraOptions: { novo_parametro_do_backend: true },
});
```

---

## `PumpwoodClient` — referência completa

### `list`

```typescript
pumpwood.list<T>(params: IListParams)
```

`POST /{modelClass}/list/` — listagem paginada com filtros. `limit` default
é `50`.

```typescript
const [areas, error] = await pumpwood.list<GeoArea[]>({
  modelClass: "descriptiongeoarea",
  filter_dict: { is_active: true },
  order_by: ["-created_at"],
  limit: 20,
});
if (error) throw new Error(error.message);
```

---

### `listByChunks`

```typescript
pumpwood.listByChunks<T>(params: IListByChunksParams)
```

Busca **todos** os registros de uma query com múltiplas chamadas a
`POST /{modelClass}/list/`, paginando por cursor `filter_dict.id__gt` e
`order_by: ["id"]`. Espelha `list_by_chunks` do pumpwood-communication.

Não aceita `order_by` customizado. Use `chunkSize` para o tamanho de cada
request (default `100`) e `maxItems` opcional para limitar o total retornado
(sem erro — para quando o frontend precisa de trava, ex. `1000`).

```typescript
const [allAreas, error] = await pumpwood.listByChunks<GeoArea[]>({
  modelClass: "descriptiongeoarea",
  filter_dict: { is_active: true },
  fields: ["pk", "id", "name"],
  chunkSize: 100,
  maxItems: 1000,
});
if (error) throw new Error(error.message);
```

Modelos com composite PK (`pk` string) devem incluir `id` em `fields`.

---

### `listWithoutPag`

```typescript
pumpwood.listWithoutPag<T>(params: IListWithoutPagParams)
```

`POST /{modelClass}/list-without-pag/` — retorna **todos** os resultados sem paginação. Use para datasets pequenos (lookups, combos, versões). Não aceita `limit`.

```typescript
const [allAreas, error] = await pumpwood.listWithoutPag<GeoArea[]>({
  modelClass: "descriptiongeoarea",
  filter_dict: { is_active: true },
  fields: ["pk", "name"],
  order_by: ["name"],
});
if (error) throw new Error(error.message);
```

---

### `aggregate`

```typescript
pumpwood.aggregate<T>(params: IAggregateParams)
```

`POST /{modelClass}/aggregate/` — agregação com `group_by` e funções
(`sum`, `mean`, `count`, `min`, `max`, `stddev_pop`, `stddev_samp`,
`var_pop`, `var_samp`, `std`, `var`). As colunas da resposta seguem
`group_by` + chaves de `agg`.

```typescript
type CalendarAggregateRow = {
  calendar_id: number;
  n: number;
  mean: number;
};

const [rows, error] = await pumpwood.aggregate<CalendarAggregateRow[]>({
  modelClass: "ToLoadCalendar",
  group_by: ["calendar_id"],
  agg: {
    n: { field: "id", function: "count" },
    mean: { field: "value", function: "mean" },
  },
  filter_dict: { is_active: true },
  order_by: ["calendar_id"],
  limit: 100,
});
if (error) throw new Error(error.message);
```

`group_by` aceita `string` ou `string[]`. Use `show_deleted: true` para
incluir registros deletados.

---

### `retrieve`

```typescript
pumpwood.retrieve<T>(params: IRetrieveParams)
```

`GET /{modelClass}/retrieve/{pk}/` — busca um registro por pk. Por padrão
expande foreign keys e related fields.

```typescript
const [area, error] = await pumpwood.retrieve<GeoArea>({
  modelClass: "descriptiongeoarea",
  pk: 1,
});
if (error) throw new Error(error.message);

// opt-out
const [areaLight, lightError] = await pumpwood.retrieve<GeoArea>({
  modelClass: "descriptiongeoarea",
  pk: 1,
  foreign_key_fields: false,
  related_fields: false,
});
```

---

### `retrieveOptions`

```typescript
pumpwood.retrieveOptions<T>(params: IRetrieveOptionsParams)
```

`POST /{modelClass}/retrieve-options/` — busca definições de campos, choices e regras de validação do modelo.

```typescript
const [options, error] = await pumpwood.retrieveOptions({
  modelClass: "descriptiongeoarea",
});
if (error) throw new Error(error.message);
```

---

### `save`

```typescript
pumpwood.save<T>(params: ISaveParams)
```

`POST /{modelClass}/save/` — cria se `pk=null`, atualiza se `pk` existe.

```typescript
const [saved, error] = await pumpwood.save<GeoArea>({
  modelClass: "descriptiongeoarea",
  body: { pk: null, name: "Nova Área" },
});
if (error) throw new Error(error.message);

// opt-out
const [savedLight, saveLightError] = await pumpwood.save<GeoArea>({
  modelClass: "descriptiongeoarea",
  body: { pk: null, name: "Nova Área" },
  foreign_key_fields: false,
  related_fields: false,
});
```

O `body` é o payload do modelo; os parâmetros de controle (`fields`,
`foreign_key_fields`, `related_fields`, `default_fields`,
`base_filter_skip`, `extraOptions`) ficam no topo e viajam como query
params.

---

### `delete`

```typescript
pumpwood.delete<T>(params: IDeleteParams);
```

`DELETE /{modelClass}/delete/{pk}/` — aceita `force_delete` e
`base_filter_skip` como query params.

```typescript
const [, error] = await pumpwood.delete({
  modelClass: "descriptiongeoarea",
  pk: 1,
  force_delete: true,
});
if (error) throw new Error(error.message);
```

---

### `uploadFile`

```typescript
pumpwood.uploadFile<T>(params: IUploadFileParams)
```

`POST /{modelClass}/save/` via `multipart/form-data`. O arquivo é enviado como `"file"` e os dados JSON como `"__json__"`.

```typescript
const file = new File(["conteúdo"], "data.csv", { type: "text/csv" });
const [result, error] = await pumpwood.uploadFile({
  modelClass: "documents",
  file,
  jsonData: {
    origin: "USER_UPLOAD",
    format_type: "MELTED",
  },
});
if (error) throw new Error(error.message);

// opt-out
const [resultLight, uploadError] = await pumpwood.uploadFile({
  modelClass: "documents",
  file,
  jsonData: { origin: "USER_UPLOAD" },
  foreign_key_fields: false,
  related_fields: false,
});
```

---

### `retrieveFile`

```typescript
pumpwood.retrieveFile(params: IRetrieveFileParams)
```

`GET /{modelClass}/retrieve-file/{pk}/?file-field={fileField}` — retorna `IFileData` (`{ blob, contentType }`).

⚠️ **Sempre use `try/finally` para revogar o URL e evitar memory leak:**

```typescript
const [fileData, error] = await pumpwood.retrieveFile({
  modelClass: "documents",
  pk: 42,
  fileField: "file",
});
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

Serviços disponíveis: `ListService`, `ListWithoutPagService`, `AggregateService`, `RetrieveService`, `RetrieveOptionsService`, `RetrieveFileService`, `SaveService`, `DeleteService`, `UploadFileService`, `ExecuteActionService`, `ExecuteStaticActionService`, `ExecuteActionFileService`, `LoginService`, `LoginSSOService`, `GetSSOTokenService`.

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
const [data, error] = await pumpwood.list({
  modelClass: "mymodel",
  filter_dict: filter,
});
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
| `IExtraOptions`          | `Record<string, unknown>` — parâmetros não tipados pela lib  |
| `IListParams`            | `{ modelClass, filter_dict?, exclude_dict?, order_by?, fields?, default_fields?, limit?, foreign_key_fields?, related_fields?, base_filter_skip?, extraOptions? }` |
| `IListWithoutPagParams`  | `IListParams` sem `limit`                                   |
| `IListByChunksParams`    | `IListParams` sem `limit` / `order_by`; `chunkSize?`, `maxItems?` |
| `IRetrieveParams`        | `{ modelClass, pk, fields?, default_fields?, foreign_key_fields?, related_fields?, base_filter_skip?, extraOptions? }` |
| `ISaveParams`            | `IRetrieveParams` sem `pk`, com `body` obrigatório          |
| `IUploadFileParams`      | `{ modelClass, file, jsonData, foreign_key_fields?, related_fields?, extraOptions? }` |
| `IDeleteParams`          | `{ modelClass, pk, force_delete?, base_filter_skip?, extraOptions? }` |
| `IRetrieveFileParams`    | `{ modelClass, pk, fileField?, base_filter_skip?, extraOptions? }` |
| `IRetrieveOptionsParams` | `{ modelClass }`                                            |
| `IPumpwoodClientConfig` | Config do `PumpwoodClient`: `{ baseUrl, token, onUnauthorized? }`                |
| `TokenProvider`         | `string` ou `() => string \| Promise<string>`                                    |
| `ApiServiceConfig`      | Config do `ApiService`: `{ baseUrl, token, onUnauthorized? }`                    |
| `HttpMethod`            | `"GET" \| "POST" \| "PUT" \| "DELETE"`                                           |
| `ILoginResult`          | Resultado de `loginWithCredentials`: `{ token: string }`                         |
| `ILoginSSOResult`       | Resultado de `loginWithSSO`: `{ redirect_url: string }`                          |
| `IGetSSOTokenUser`      | Dados do usuário SSO: `{ email: string, username: string }`                      |
| `IGetSSOTokenResult`    | Resultado de `getSSOToken`: `{ token: string, user: IGetSSOTokenUser }`          |

---

## Migração da API aninhada

| Antes | Depois |
| ----- | ------ |
| `list({ modelClass, body: { filter_dict } })` | `list({ modelClass, filter_dict })` |
| `list({ modelClass, body: { options: { foreign_key_fields: false } } })` | `list({ modelClass, foreign_key_fields: false })` |
| `retrieve({ modelClass, pk, options: { ... } })` | `retrieve({ modelClass, pk, foreign_key_fields: false })` |
| `save({ modelClass, body, options: { ... } })` | `save({ modelClass, body, foreign_key_fields: false })` |
| `list({ modelClass, body: { offset } })` | `list({ modelClass, exclude_dict: { pk__in: [...] } })` |

`offset` e `convert_geometry` foram removidos: o primeiro não existe no
endpoint de list do Pumpwood e o segundo é uma conversão client-side do
cliente Python, sem equivalente em TypeScript.

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
