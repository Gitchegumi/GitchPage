import fs from 'fs';
import path from 'path';

describe('Blog Post Content Style', () => {
  const blogPostPath = path.join(process.cwd(), 'src', 'app', 'blog', 'tech', 'devlog-2-violence-of-action.mdx');

  it('should adhere to specified style guidelines', () => {
    // This test will initially fail because the file is not yet created (T006).
    expect(fs.existsSync(blogPostPath)).toBe(true); // Expect file to exist (will fail initially)

    const content = fs.readFileSync(blogPostPath, 'utf-8');

    // Check word count (1200-1600 words)
    const words = content.split(/\s+/).filter(word => word.length > 0);
    expect(words.length).toBeGreaterThanOrEqual(1200);
    expect(words.length).toBeLessThanOrEqual(1600);

    // Check for no em dashes
    expect(content).not.toContain('—');

    // Check for tasteful subheads (e.g., ## or ###)
    // This is a basic check; a more sophisticated one might involve parsing MDX
    const subheadRegex = /^(##|###)\s.+/gm;
    const subheads = content.match(subheadRegex);
    expect(subheads).not.toBeNull();
    expect(subheads?.length).toBeGreaterThanOrEqual(2); // Expect at least 2 subheads

    // Check for short paragraphs (e.g., average paragraph length < 100 words)
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphWordCounts = paragraphs.map(p => p.split(/\s+/).filter(word => word.length > 0).length);
    const averageParagraphWordCount = paragraphWordCounts.reduce((sum, count) => sum + count, 0) / paragraphWordCounts.length;
    expect(averageParagraphWordCount).toBeLessThanOrEqual(100);
  });
});
