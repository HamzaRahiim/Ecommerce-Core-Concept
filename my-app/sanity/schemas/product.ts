import { defineField, defineType } from "sanity";

export default defineType({
  name: "product", //    used in query in _type first
  title: "Product", //    used in schema as a Title
  type: "document",
  fields: [
    defineField({
      name: "name", // used for api fetching time this name
      title: "name", // used as title in schema
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
    }),
  ],
});
