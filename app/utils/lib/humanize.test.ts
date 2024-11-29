import { describe, expect, it } from "vitest";
import { humanize } from "./humanize";

describe("Ensure humanize():", function () {
  it("returns single word in PascalCase", () => {
    expect(humanize("country")).toEqual("Country");
  });

  it("returns multi word in PascalCase", () => {
    expect(humanize("countryTable")).toEqual("CountryTable");
  });
});
