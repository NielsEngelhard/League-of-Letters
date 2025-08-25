import { WordFormatValidator } from "./word-format-validator";

describe("Validate normal letters are not changed", () => {
  const testCases = [
    { input: "", expected: "" },
    { input: "normalword", expected: "normalword" },
    { input: "something", expected: "something" },
    { input: "aBcSDeoCXyyZ", expected: "aBcSDeoCXyyZ" },
  ];

  test.each(testCases)(
    "should keep normal letters unchanged: $input",
    ({ input, expected }) => {
      const result = WordFormatValidator.removeDiacritics(input);
      expect(result).toBe(expected);
    }
  );
});

describe("Validate diacritic letters are changed", () => {
  const testCases = [
    // Accents & umlauts
    { input: "àáâãäå", expected: "aaaaaa" },
    { input: "ÀÁÂÃÄÅ", expected: "AAAAAA" },
    { input: "çÇ", expected: "cC" },
    { input: "éèêëÉÈÊË", expected: "eeeeEEEE" },
    { input: "ïîìíÏÎÌÍ", expected: "iiiiIIII" },
    { input: "öòóôõÖÒÓÔÕ", expected: "oooooOOOOO" },
    { input: "üùúûÜÙÚÛ", expected: "uuuuUUUU" },
    { input: "ÿŸ", expected: "yY" },

    // Special Latin
    { input: "ñÑ", expected: "nN" },
    { input: "Øresund", expected: "Oresund" },
    { input: "smørrebrød", expected: "smorrebrod" },
    { input: "Straße", expected: "Strasse" },

    // Mixed words
    { input: "façade", expected: "facade" },
    { input: "Crème Brûlée", expected: "Creme Brulee" },
    { input: "piñata", expected: "pinata" },
    { input: "über", expected: "uber" },
    { input: "Škoda", expected: "Skoda" },
    { input: "Żubrówka", expected: "Zubrowka" },
    { input: "Český", expected: "Cesky" },

    // Dutch words
    { input: "café", expected: "cafe" },
    { input: "reünie", expected: "reunie" },
    { input: "egoïstisch", expected: "egoistisch" },
    { input: "maïs", expected: "mais" },
    { input: "financiën", expected: "financien" },
    { input: "opgeëist", expected: "opgeeist" },
  ];

  test.each(testCases)(
    "should normalize diacritics: $input -> $expected",
    ({ input, expected }) => {
      const result = WordFormatValidator.removeDiacritics(input);
      expect(result).toBe(expected);
    }
  );
});
