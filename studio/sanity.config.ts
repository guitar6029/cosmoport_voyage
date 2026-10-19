import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "CosmoPort Voyage",
  projectId: "v8u0eztb",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
