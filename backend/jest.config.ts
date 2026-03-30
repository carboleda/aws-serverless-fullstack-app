import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          strict: true,
          esModuleInterop: true,
          module: "commonjs",
          target: "ES2020",
          lib: ["ES2020"],
          moduleResolution: "node",
          paths: {
            "@/*": ["./src/*"],
          },
        },
      },
    ],
  },
};

export default config;
