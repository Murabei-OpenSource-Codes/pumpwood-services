import { safeAwait } from "..";

describe("safeAwait", () => {
  it("should return data and null error on success", async () => {
    const [data, error] = await safeAwait(Promise.resolve("ok"));

    expect(data).toBe("ok");
    expect(error).toBeNull();
  });

  it("should return null data and error on failure", async () => {
    const testError = new Error("fail");
    const [data, error] = await safeAwait(Promise.reject(testError));

    expect(data).toBeNull();
    expect(error).toBe(testError);
  });
});
