# Data Model: Blog Post

## Entity: Blog Post

Represents a single article on the site, identified by its MDX file.

### Attributes:
- **title**: String. The title of the blog post.
- **slug**: String. A URL-friendly identifier for the blog post.
- **date**: String (YYYY-MM-DD). The publication date of the blog post.
- **author**: String. The author of the blog post (e.g., "Mathew 'Gitchegumi' Lindholm").
- **description**: String. A brief summary or description of the blog post.
- **category**: String. The category of the blog post (e.g., "tech", "faith", "life", "opinion").
- **tags**: Array of Strings. Keywords or labels associated with the blog post.
- **featureImage**: String. The path to the feature image for the blog post (e.g., "/images/blog/<slug>.png").
- **content**: String. The main body content of the blog post, written in MDX format.
