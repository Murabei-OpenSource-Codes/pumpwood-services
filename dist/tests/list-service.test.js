"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe("ListService", () => {
    let api;
    beforeEach(() => {
        api = new __1.ApiService({ baseUrl: "https://example.com", token: "123" });
        fetchMock.resetMocks();
    });
    it("should return data on success", async () => {
        const mockData = [{ id: 1, name: "Test" }];
        fetchMock.mockResponseOnce(JSON.stringify(mockData));
        const [data, error] = await (0, __1.ListService)(api, "activities");
        expect(error).toBeNull();
        expect(data).toEqual(mockData);
        expect(fetchMock).toHaveBeenCalledWith("https://example.com/activities/list/", expect.anything());
    });
    it("should return error on failure", async () => {
        fetchMock.mockResponseOnce("Server error", { status: 500 });
        const [data, error] = await (0, __1.ListService)(api, "activities");
        expect(data).toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toContain("API Error");
    });
    it("should send body on request", async () => {
        const mockData = [{ id: 1, name: "Test" }];
        const body = { any: "thing" };
        fetchMock.mockResponseOnce(JSON.stringify(mockData));
        const [data, error] = await (0, __1.ListService)(api, "activities", body);
        expect(error).toBeNull();
        expect(data).toEqual(mockData);
        expect(fetchMock).toHaveBeenCalledWith("https://example.com/activities/list/", expect.objectContaining({
            body: JSON.stringify(body),
        }));
    });
});
//# sourceMappingURL=list-service.test.js.map