import fs from 'fs';
import path from 'path';

describe('Blog Post Metadata', () => {
  const blogPostPath = path.join(process.cwd(), 'src', 'app', 'blog', 'tech', 'devlog-2-violence-of-action.mdx');

  it('should have correctly structured metadata', () => {
    // This test will initially fail because the file is not yet created (T006).
    // Even if the file existed, the metadata extraction would fail until implemented.

    expect(fs.existsSync(blogPostPath)).toBe(true); // Expect file to exist (will fail initially)

    const content = fs.readFileSync(blogPostPath, 'utf-8');
    const metadataRegex = /export const metadata = ({[^}]*});/s;
    const match = content.match(metadataRegex);

    expect(match).toBeDefined();
    if (!match) return; // To satisfy TypeScript, though expect().toBeDefined() handles the test failure

    const metadataString = match[1];

    // Extract values directly using regex
        const getMetadataValue = (key: string, type: 'string' | 'array') => {
      let value: string | string[] | null = null;
      if (type === 'string') {
        const regex = new RegExp(`${key}:\s*(.*?)(?:,|\n)`); // Capture non-greedy until comma or newline
        const match = metadataString.match(regex);
        if (match) {
          value = match[1].trim().replace(/^"|"$/g, '').replace(/^'|'$/g, ''); // Trim and remove quotes
        }
      } else if (type === 'array') {
        const regex = new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`); // Matches any character including newlines non-greedily
        const match = metadataString.match(regex);
        if (match) {
          value = match[1].split(',').map(item => item.trim().replace(/^"|"$/g, ''));
        }
      } else {
        throw new Error('Invalid type for getMetadataValue');
      }

      if (value === null) {
        throw new Error(`Metadata key "${key}" not found or invalid format.`);
      }
      return value;
    };

    const title = getMetadataValue('title', 'string');
    expect(title).toBe('Devlog 2: Unit Selection and Information Display');

    const slug = getMetadataValue('slug', 'string');
    expect(slug).toBe('devlog-2-violence-of-action');

    const date = getMetadataValue('date', 'string');
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const author = getMetadataValue('author', 'string');
    expect(author).toBe('Mathew \'Gitchegumi\' Lindholm'); // Note: The MDX file has "Mathew \"Gitchegumi\" Lindholm"

    const description = getMetadataValue('description', 'string');
    expect(description.length).toBeGreaterThan(0);

    const category = getMetadataValue('category', 'string');
    expect(category).toBe('tech');

    const tags = getMetadataValue('tags', 'array');
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);

    const featureImage = getMetadataValue('featureImage', 'string');
    expect(featureImage).toBe('/images/blog/devlog-2-violence-of-action.png');
  });
});