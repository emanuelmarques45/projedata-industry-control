import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/*.spec.ts"],
  setupFiles: ["./jest.setup.ts"],

  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};

export default config;
