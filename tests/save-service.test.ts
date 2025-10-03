
import { ApiService, SaveService } from "..";

describe("SaveService", () => {
  let api: ApiService;

  beforeEach(() => {
    api = new ApiService({ baseUrl: "https://example.com", token: "123" });
    fetchMock.resetMocks();
  });

  it("should return data on success", async () => {
    const mockData = { id: 1, name: "Test", email: "test@example.com" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const [data, error] = await SaveService<typeof mockData>(
      api, 
      "users", 
      { name: "Test", email: "test@example.com" }
    );

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/users/save/",
      expect.anything()
    );
  });

  it("should return error on failure", async () => {
    fetchMock.mockResponseOnce("Server error", { status: 500 });

    const [data, error] = await SaveService(
      api, 
      "users", 
      { name: "Test" }
    );

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("API Error");
  });

  it("should append query parameters to URL", async () => {
    const mockData = { id: 1, name: "Test", email: "test@example.com" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const queryParams = { 
      return_full: "true", 
      validate: "strict" 
    };

    const [data, error] = await SaveService<typeof mockData>(
      api, 
      "users",
      { name: "Test", email: "test@example.com" },
      queryParams
    );

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/users/save/?return_full=true&validate=strict",
      expect.anything()
    );
  });

  it("should send body correctly", async () => {
    const mockData = { id: 1, name: "Test" };
    const requestBody = { name: "Test", email: "test@example.com" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    await SaveService<typeof mockData>(api, "users", requestBody);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/users/save/",
      expect.objectContaining({
        body: JSON.stringify(requestBody),
        method: "POST"
      })
    );
  });
});
