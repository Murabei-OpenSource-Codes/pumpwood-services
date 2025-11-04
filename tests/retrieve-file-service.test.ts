import { ApiService, RetrieveFileService, IFileData } from "../index";

// Mock global fetch
global.fetch = jest.fn();

describe("RetrieveFileService", () => {
  let api: ApiService;

  beforeEach(() => {
    api = new ApiService({ 
      baseUrl: "https://example.com", 
      token: "test-token-123" 
    });
    jest.clearAllMocks();
  });

  it("should return file data on success", async () => {
    // Mock file content
    const fileContent = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const blob = new Blob([fileContent], { type: "text/plain" });
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      blob: async () => blob,
    });

    const [fileData, error] = await RetrieveFileService(
      api, 
      "documents", 
      123, 
      "file"
    );

    expect(error).toBeNull();
    expect(fileData).not.toBeNull();
    expect(fileData?.data).toEqual(Array.from(fileContent));
    expect(fileData?.contentType).toBe("text/plain");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/documents/retrieve-file/123/?file-field=file",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Token test-token-123",
        }),
      })
    );
  });

  it("should use default file field", async () => {
    const fileContent = new Uint8Array([1, 2, 3]);
    const blob = new Blob([fileContent], { type: "application/octet-stream" });
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      blob: async () => blob,
    });

    const [fileData, error] = await RetrieveFileService(
      api, 
      "documents", 
      456
    );

    expect(error).toBeNull();
    expect(fileData).not.toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/documents/retrieve-file/456/?file-field=file",
      expect.anything()
    );
  });

  it("should return error on HTTP failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: async () => "File not found",
    });

    const [fileData, error] = await RetrieveFileService(
      api, 
      "documents", 
      999, 
      "attachment"
    );

    expect(fileData).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("API Error");
    expect(error?.message).toContain("404");
  });

  it("should handle different file types", async () => {
    const pdfContent = new Uint8Array([37, 80, 68, 70]); // PDF header
    const blob = new Blob([pdfContent], { type: "application/pdf" });
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      blob: async () => blob,
    });

    const [fileData, error] = await RetrieveFileService(
      api, 
      "reports", 
      789, 
      "pdf_file"
    );

    expect(error).toBeNull();
    expect(fileData?.contentType).toBe("application/pdf");
    expect(fileData?.data).toEqual(Array.from(pdfContent));
    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/reports/retrieve-file/789/?file-field=pdf_file",
      expect.anything()
    );
  });

  it("should handle empty file field validation", async () => {
    const [fileData, error] = await RetrieveFileService(
      api, 
      "documents", 
      123, 
      ""
    );

    expect(fileData).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("fileField is required");
  });

  it("should return serializable data for SSR", async () => {
    const imageContent = new Uint8Array([255, 216, 255, 224]); // JPEG header
    const blob = new Blob([imageContent], { type: "image/jpeg" });
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      blob: async () => blob,
    });

    const [fileData, error] = await RetrieveFileService(
      api, 
      "images", 
      321, 
      "photo"
    );

    expect(error).toBeNull();
    expect(fileData).not.toBeNull();
    
    // Verifica que é serializável (pode ser convertido para JSON)
    const serialized = JSON.stringify(fileData);
    const deserialized: IFileData = JSON.parse(serialized);
    
    expect(deserialized.data).toEqual(fileData?.data);
    expect(deserialized.contentType).toBe(fileData?.contentType);
  });
});
