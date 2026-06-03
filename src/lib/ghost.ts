import GhostContentAPI from '@tryghost/content-api';

// Initialize the Ghost API client
export const ghostClient = new GhostContentAPI({
  url: process.env.GHOST_URL || 'https://blog.gitchegumi.com',
  key: process.env.GHOST_CONTENT_API_KEY || '',
  version: 'v5.0',
});

export interface GhostPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  feature_image: string | null;
  published_at: string;
  url: string;
  primary_tag?: {
    name: string;
    slug: string;
  } | null;
}

/**
 * Fetches the most recent posts for the homepage.
 * Forces no-store to ensure fresh data on every build.
 */
export async function getLatestPosts(limit: number = 3): Promise<GhostPost[]> {
  try {
    const posts: any[] = await (ghostClient.posts.browse as any)({
      limit: limit.toString() as any,
      include: ['tags', 'authors'],
      cache: 'no-store',
    });
    
    return posts.map(post => ({
      id: post.id,
      title: post.title || '',
      slug: post.slug,
      excerpt: post.excerpt || post.custom_excerpt || '',
      feature_image: post.feature_image || null,
      published_at: post.published_at || '',
      url: post.url || `https://blog.gitchegumi.com/${post.slug}`,
      primary_tag: post.primary_tag ? {
        name: post.primary_tag.name || '',
        slug: post.primary_tag.slug || '',
      } : null
    }));
  } catch (error) {
    console.error('Error fetching latest posts from Ghost:', error);
    return [];
  }
}

/**
 * Fetches a single post by slug.
 */
export async function getPostBySlug(slug: string): Promise<GhostPost | null> {
  try {
    const post = await ghostClient.posts.read(
      { slug },
      { include: ['tags', 'authors'] }
    );
    
    if (!post) return null;

    return {
      id: post.id,
      title: post.title || '',
      slug: post.slug,
      excerpt: post.excerpt || post.custom_excerpt || '',
      feature_image: post.feature_image || null,
      published_at: post.published_at || '',
      url: post.url || `https://blog.gitchegumi.com/${post.slug}`,
      primary_tag: post.primary_tag ? {
        name: post.primary_tag.name || '',
        slug: post.primary_tag.slug || '',
      } : null
    };
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}" from Ghost:`, error);
    return null;
  }
}
