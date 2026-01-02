
import { ApiService, ExecuteActionService, ExecuteStaticActionService } from "..";

describe("ExecuteActionService", () => {
  let api: ApiService;

  beforeEach(() => {
    api = new ApiService({ baseUrl: "https://example.com", token: "123" });
    fetchMock.resetMocks();
  });

  it("should return data on success", async () => {
    const mockData = { status: "approved", message: "Action executed successfully" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const [data, error] = await ExecuteActionService<typeof mockData>({
      api: api,
      modelClass: "MaterialApprovalActivity",
      pk: 123,
      actionName: "review",
      parameters: { new_status: "approved" }
    });

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/MaterialApprovalActivity/actions/review/123/",
      expect.anything()
    );
  });

  it("should return error on failure", async () => {
    fetchMock.mockResponseOnce("Server error", { status: 500 });

    const [data, error] = await ExecuteActionService({
      api: api,
      modelClass: "MaterialApprovalActivity",
      pk: 123,
      actionName: "review",
      parameters: { new_status: "approved" }
    });

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("API Error");
  });

  it("should return error when modelClass is missing", async () => {
    const [data, error] = await ExecuteActionService({
      api: api,
      modelClass: "",
      pk: 123,
      actionName: "review",
      parameters: { new_status: "approved" }
    });

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("modelClass is required");
  });

  it("should return error when actionName is missing", async () => {
    const [data, error] = await ExecuteActionService({
      api: api,
      modelClass: "MaterialApprovalActivity",
      pk: 123,
      actionName: "",
      parameters: { new_status: "approved" }
    });

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("actionName is required");
  });

  it("should append query parameters to URL", async () => {
    const mockData = { status: "approved" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const queryParams = {
      include_details: "true",
      format: "json"
    };

    const [data, error] = await ExecuteActionService<typeof mockData>({
      api: api,
      modelClass: "MaterialApprovalActivity",
      pk: 123,
      actionName: "review",
      parameters: { new_status: "approved" },
      queryParams: queryParams
    });

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/MaterialApprovalActivity/actions/review/123/?include_details=true&format=json",
      expect.anything()
    );
  });

  it("should send parameters correctly", async () => {
    const mockData = { status: "approved" };
    const parameters = { new_status: "approved", comment: "Looks good" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    await ExecuteActionService<typeof mockData>({
      api: api,
      modelClass: "MaterialApprovalActivity",
      pk: 123,
      actionName: "review",
      parameters: parameters
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/MaterialApprovalActivity/actions/review/123/",
      expect.objectContaining({
        body: JSON.stringify(parameters),
        method: "POST"
      })
    );
  });

  it("should handle empty parameters", async () => {
    const mockData = { status: "success" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const [data, error] = await ExecuteActionService<typeof mockData>({
      api: api,
      modelClass: "MaterialApprovalActivity",
      pk: 123,
      actionName: "review"
    });

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/MaterialApprovalActivity/actions/review/123/",
      expect.objectContaining({
        body: JSON.stringify({}),
        method: "POST"
      })
    );
  });

  it("should handle pk=0 for static actions", async () => {
    const mockData = { total: 100, approved: 80 };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const [data, error] = await ExecuteActionService<typeof mockData>({
      api: api,
      modelClass: "MaterialApprovalActivity",
      pk: 0,
      actionName: "get_statistics",
      parameters: { year: 2024 }
    });

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/MaterialApprovalActivity/actions/get_statistics/0/",
      expect.anything()
    );
  });
});

describe("ExecuteStaticActionService", () => {
  let api: ApiService;

  beforeEach(() => {
    api = new ApiService({ baseUrl: "https://example.com", token: "123" });
    fetchMock.resetMocks();
  });

  it("should return data on success", async () => {
    const mockData = { total: 100, approved: 80, rejected: 20 };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const [data, error] = await ExecuteStaticActionService<typeof mockData>({
      api: api,
      modelClass: "MaterialApprovalActivity",
      actionName: "get_statistics",
      parameters: { year: 2024 }
    });

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/MaterialApprovalActivity/actions/get_statistics/0/",
      expect.anything()
    );
  });

  it("should return error on failure", async () => {
    fetchMock.mockResponseOnce("Server error", { status: 500 });

    const [data, error] = await ExecuteStaticActionService({
      api: api,
      modelClass: "MaterialApprovalActivity",
      actionName: "get_statistics",
      parameters: { year: 2024 }
    });

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("API Error");
  });

  it("should append query parameters to URL", async () => {
    const mockData = { total: 100 };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const queryParams = {
      format: "detailed",
      include_metadata: "true"
    };

    const [data, error] = await ExecuteStaticActionService<typeof mockData>({
      api: api,
      modelClass: "MaterialApprovalActivity",
      actionName: "get_statistics",
      parameters: { year: 2024 },
      queryParams: queryParams
    });

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/MaterialApprovalActivity/actions/get_statistics/0/?format=detailed&include_metadata=true",
      expect.anything()
    );
  });

  it("should handle empty parameters", async () => {
    const mockData = { status: "ok" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const [data, error] = await ExecuteStaticActionService<typeof mockData>({
      api: api,
      modelClass: "MaterialApprovalActivity",
      actionName: "health_check"
    });

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/MaterialApprovalActivity/actions/health_check/0/",
      expect.objectContaining({
        body: JSON.stringify({}),
        method: "POST"
      })
    );
  });
});
