export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  author?: string;
  description?: string;
  category?: string;
  tags?: string[];
  keywords?: string[];
  featureImage?: string;
  erpUrl?: string; // Full ERPNext URL for posts hosted on ERPNext
};
