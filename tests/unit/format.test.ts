describe("formatNumber", () => {
  it("formats millions", () => expect(formatNumber(1000000)).toBe("1,000,000"));
