import { defineField, defineType } from "sanity";

export const destination = defineType({
  name: "destination",
  title: "Destination",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "planet",
      title: "Planet",
      type: "string",
      initialValue: "Velora-7",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "City", value: "city" },
          { title: "Coast", value: "coast" },
          { title: "Adventure", value: "adventure" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "A short promotional slogan for the destination.",
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.max(1200),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "altText",
      title: "Image alt text",
      type: "string",
      description: "Accessible description used when a hero image is provided.",
      validation: (Rule) =>
        Rule.max(180).custom((value, context) => {
          const parent = context.parent as { heroImage?: unknown } | undefined;

          if (parent?.heroImage && !value) {
            return "Alt text is required when a hero image is provided.";
          }

          return true;
        }),
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [
        {
          type: "string",
          validation: (Rule) => Rule.required().max(120),
        },
      ],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first on the website.",
      initialValue: 0,
      validation: (Rule) => Rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "heroImage",
    },
  },
});
