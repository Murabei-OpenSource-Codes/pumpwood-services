import { ListService, ApiService } from "..";

describe("ListService", () => {
  let api: ApiService;

  beforeEach(() => {
    api = new ApiService({ baseUrl: "https://example.com", token: "123" });
    fetchMock.resetMocks();
  });

  it("should return data on success", async () => {
    const mockData = [{ id: 1, name: "Test" }];
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const [data, error] = await ListService<typeof mockData>(api, "activities");

    console.log("==> should return data on success", data)

    expect(error).toBeNull();
    expect(data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/activities/list/",
      expect.anything()
    );
  });

  it("should return error on failure", async () => {
    fetchMock.mockResponseOnce("Server error", { status: 500 });

    const [data, error] = await ListService(api, "activities");

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toContain("API Error");
  });
});
