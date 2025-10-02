import { ApiService, DeleteService } from "..";

describe("DeleteService", () => {
  let api: ApiService;

  beforeEach(() => {
    api = new ApiService({ baseUrl: "https://example.com", token: "123" });
    fetchMock.resetMocks();
  });

  it("should return success on successful deletion", async () => {
    // Mock successful deletion with deleted: true response
    const mockResponse = { deleted: true };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const [data, error] = await DeleteService<typeof mockResponse>(api, "activities", 1);

    expect(error).toBeNull();
    expect(data).toEqual({ deleted: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/activities/delete/1/",
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          Authorization: "Token 123",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("should return response data when API returns additional content", async () => {
    const mockResponse = { deleted: true, message: "Item deleted successfully", id: 1 };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const [data, error] = await DeleteService<typeof mockResponse>(api, "activities", 1);

    expect(error).toBeNull();
    expect(data).toEqual(mockResponse);
    expect(data?.deleted).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/activities/delete/1/",
      expect.anything()
    );
  });

  it("should return error on failure", async () => {
    fetchMock.mockResponseOnce("Not Found", { status: 404 });

    const [data, error] = await DeleteService(api, "activities", 999);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("API Error");
    expect(error?.message).toContain("404");
  });

  it("should handle server errors correctly", async () => {
    fetchMock.mockResponseOnce("Internal Server Error", { status: 500 });

    const [data, error] = await DeleteService(api, "users", 1);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("500");
  });

  it("should handle 204 No Content response", async () => {
    // Some APIs might still return 204 No Content
    fetchMock.mockResponseOnce("", { status: 204 });

    const [data, error] = await DeleteService(api, "activities", 1);

    expect(error).toBeNull();
    expect(data).toBeNull(); // 204 returns null as per ApiService.request
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/activities/delete/1/",
      expect.objectContaining({
        method: "DELETE"
      })
    );
  });
});
