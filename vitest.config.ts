import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 30000,
    include: ["src/**/*.{test,spec}.ts"],
    exclude: ["node_modules", "dist", ".omc", ".omx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "src/**/*.{test,spec}.ts",
        "src/__tests__/**",
        "**/*.d.ts",
        "**/*.config.{js,ts}",
        "src/index.ts",
      ],
    },
  },
});
