import { type SchemaTypeDefinition } from "sanity";
import title from "./schemas/title";
import product from "./schemas/product";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [title, product],
};
