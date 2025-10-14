import { ApiService, UploadFileService } from "../index";

// Mock global fetch
global.fetch = jest.fn();

describe("UploadFileService", () => {
  let api: ApiService;
  const mockFile = new File(["file content"], "test.txt", { type: "text/plain" });

  beforeEach(() => {
    api = new ApiService({
      baseUrl: "https://api.example.com",
      token: "test-token-123",
    });
    jest.clearAllMocks();
  });

  it("should upload file successfully", async () => {
    const mockResponse = {
      id: 1,
      filename: "test.txt",
      origin: "USER_UPLOAD",
      format_type: "MELTED",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const jsonData = {
      origin: "USER_UPLOAD",
      format_type: "MELTED",
    };

    const [data, error] = await UploadFileService(
      api,
      "documents",
      mockFile,
      jsonData
    );

    if (error) {
      throw new Error(`Unexpected error: ${error.message}`);
    }

    if (!data) {
      throw new Error("Data should not be null");
    }

    expect(error).toBeNull();
    expect(data).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    expect(fetchCall[0]).toBe("https://api.example.com/documents/save/");
    
    const fetchOptions = fetchCall[1];
    expect(fetchOptions.method).toBe("POST");
    expect(fetchOptions.headers.Authorization).toBe("Token test-token-123");
    expect(fetchOptions.body).toBeInstanceOf(FormData);

    const formData = fetchOptions.body as FormData;
    expect(formData.get("file")).toBe(mockFile);
    expect(formData.get("__json__")).toBe(JSON.stringify(jsonData));
  });

  it("should return error when file is not provided", async () => {
    const [data, error] = await UploadFileService(
      api,
      "documents",
      null as any,
      { origin: "USER_UPLOAD" }
    );

    expect(data).toBeNull();
    if (!error) {
      throw new Error("Error should not be null");
    }
    expect(error.message).toBe("UploadFileService: file is required");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should handle API error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: async () => "Invalid file format",
    });

    const [data, error] = await UploadFileService(
      api,
      "documents",
      mockFile,
      { origin: "USER_UPLOAD" }
    );

    expect(data).toBeNull();
    if (!error) {
      throw new Error("Error should not be null");
    }
    expect(error.message).toContain("API Error: 400 Bad Request");
  });

  it("should include query parameters when provided", async () => {
    const mockResponse = { id: 1, filename: "test.txt" };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const queryParams = { version: "v2", compress: "true" };

    const [data, error] = await UploadFileService(
      api,
      "documents",
      mockFile,
      { origin: "USER_UPLOAD" },
      queryParams
    );

    if (error) {
      throw new Error(`Unexpected error: ${error.message}`);
    }

    expect(error).toBeNull();
    expect(data).toEqual(mockResponse);

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    expect(fetchCall[0]).toBe(
      "https://api.example.com/documents/save/?version=v2&compress=true"
    );
  });

  it("should handle different file types", async () => {
    const imageFile = new File(["image data"], "photo.jpg", { type: "image/jpeg" });
    const mockResponse = { id: 2, filename: "photo.jpg" };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const [data, error] = await UploadFileService(
      api,
      "images",
      imageFile,
      { origin: "USER_UPLOAD" }
    );

    if (error) {
      throw new Error(`Unexpected error: ${error.message}`);
    }

    expect(error).toBeNull();
    expect(data).toEqual(mockResponse);

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const formData = fetchCall[1].body as FormData;
    expect(formData.get("file")).toBe(imageFile);
  });

  it("should handle complex jsonData", async () => {
    const complexJsonData = {
      origin: "USER_UPLOAD",
      format_type: "MELTED",
      metadata: {
        tags: ["important", "document"],
        category: "finance",
      },
      permissions: ["read", "write"],
    };

    const mockResponse = { id: 3, filename: "test.txt" };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const [data, error] = await UploadFileService(
      api,
      "documents",
      mockFile,
      complexJsonData
    );

    if (error) {
      throw new Error(`Unexpected error: ${error.message}`);
    }

    expect(error).toBeNull();
    expect(data).toEqual(mockResponse);

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const formData = fetchCall[1].body as FormData;
    expect(formData.get("__json__")).toBe(JSON.stringify(complexJsonData));
  });
});
