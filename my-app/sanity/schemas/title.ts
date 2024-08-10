import { defineField, defineType } from "sanity";

export default defineType({
  name: "title", //    used in query in _type first
  title: "Heading", //    used in schema as a Title
  type: "document",
  fields: [
    defineField({
      name: "h1", // used for api fetching time this name
      title: "Heading1", // used as title in schema
      type: "string",
    }),
  ],
});
