
import { ApiService, RetrieveService } from "..";

describe("RetrieveService", () => {
  let api: ApiService;

  beforeEach(() => {
    api = new ApiService({ baseUrl: "https://example.com", token: "123" });
    fetchMock.resetMocks();
  });

  it("should return data on success", async () => {
    const mockData = [{ id: 1, name: "Test" }];
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const [data, error] = await RetrieveService<typeof mockData>(api, "activities", 1);

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/activities/retrieve/1/",
      expect.anything()
    );
  });

  it("should return error on failure", async () => {
    fetchMock.mockResponseOnce("Server error", { status: 500 });

    const [data, error] = await RetrieveService(api, "activities", 1);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("API Error");
  });

  it("should append query parameters to URL", async () => {
    const mockData = { id: 1, name: "Test", foreign_keys: {} };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const queryParams = { 
      foreign_key_fields: "true", 
      related_fields: "true" 
    };

    const [data, error] = await RetrieveService<typeof mockData>(
      api, 
      "activities", 
      1, 
      queryParams
    );

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/activities/retrieve/1/?foreign_key_fields=true&related_fields=true",
      expect.anything()
    );
  });
});
