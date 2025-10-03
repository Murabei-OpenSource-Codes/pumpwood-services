"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe("RetrieveService", () => {
    let api;
    beforeEach(() => {
        api = new __1.ApiService({ baseUrl: "https://example.com", token: "123" });
        fetchMock.resetMocks();
    });
    it("should return data on success", async () => {
        const mockData = [{ id: 1, name: "Test" }];
        fetchMock.mockResponseOnce(JSON.stringify(mockData));
        const [data, error] = await (0, __1.RetrieveService)(api, "activities", 1);
        expect(error).toBeNull();
        expect(data).toEqual(mockData);
        expect(fetchMock).toHaveBeenCalledWith("https://example.com/activities/retrieve/1/", expect.anything());
    });
    it("should return error on failure", async () => {
        fetchMock.mockResponseOnce("Server error", { status: 500 });
        const [data, error] = await (0, __1.RetrieveService)(api, "activities", 1);
        expect(data).toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toContain("API Error");
    });
});
//# sourceMappingURL=retrieve-service.test.js.map