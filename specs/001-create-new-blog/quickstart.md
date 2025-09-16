# Quickstart Guide: Create New Blog Post

This guide outlines the steps to quickly verify the successful creation of a new blog post MDX file.

## Verification Steps

1.  **Verify MDX File Creation and Content Readiness**
    *   **Given**: The site owner intends to create a new blog post.
    *   **When**: The new MDX file `src/app/blog/tech/devlog-2-violence-of-action.mdx` is generated with the specified metadata and content.
    *   **Then**: Confirm that the blog post file exists at the correct path and is ready for review and publication.

2.  **Verify Metadata Structure**
    *   **Given**: The new blog post MDX file has been created.
    *   **When**: The `export const metadata` block is populated with:
        *   `title: "Devlog 2"`
        *   `slug: "devlog-2-violence-of-action"`
        *   `date: "YYYY-MM-DD"` (a valid date format)
        *   `author: "Mathew 'Gitchegumi' Lindholm"`
        *   `description` (a non-empty string)
        *   `category: "tech"`
        *   `tags` (an array of strings)
        *   `featureImage: "/images/blog/devlog-2-violence-of-action.png"`
    *   **Then**: Ensure that all metadata fields are present and correctly structured within the `export const metadata` block.

3.  **Verify Content Adherence to Style Guidelines**
    *   **Given**: The content of the blog post has been written.
    *   **When**: The content is reviewed for adherence to the site's voice, word count (1200-1600 words), use of short paragraphs, absence of em dashes, and presence of tasteful subheads.
    *   **Then**: Confirm that the content meets all specified stylistic requirements.
