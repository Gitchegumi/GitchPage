# Blog Subscription/Mailing List Research

## Research Summary: Self-Hosted Mailing List Solutions for GitchPage

### User Story
As a blog reader, I want to subscribe to email alerts so that I can be notified when new posts are published on GitchPage.

---

## Top 3 Options Comparison

### 1. **Listmonk** (Recommended)
**GitHub:** https://github.com/knadh/listmonk  
**Stars:** ~19k | **Language:** Go | **License:** AGPL-3.0

**Pros:**
- Single binary deployment (extremely easy to self-host)
- High performance (handles millions of subscribers)
- Modern React-based admin dashboard
- Built-in analytics (opens, clicks, bounces)
- Visual drag-and-drop email template builder
- REST API for integration
- Supports multiple SMTP providers (AWS SES, SendGrid, etc.)
- PostgreSQL only dependency
- Template engine with Go templating + 100+ functions
- Double opt-in, list segmentation
- Transactional email support via Messenger API

**Cons:**
- Go templating language less familiar to frontend devs
- PostgreSQL required (no SQLite option)
- Smaller community than Mailtrain

**Integration with Next.js:**
- REST API for subscription forms
- Webhook support for post notifications
- Simple HTTP API calls from React components

---

### 2. **Keila**
**GitHub:** https://github.com/pentacent/keila  
**Stars:** ~2k | **Language:** Elixir | **License:** AGPL-3.0

**Pros:**
- Modern, beautiful UI
- Multiple editor options (Block editor, Markdown, MJML, plain text)
- Shopify Liquid templating (familiar to many devs)
- Built-in form builder with custom fields
- hCaptcha/Friendly Captcha support
- Public campaign archives feature
- Comprehensive REST API
- EU-hosted / GDPR friendly
- Automatic bounce and complaint handling
- Welcome emails support

**Cons:**
- Smaller community (2k vs 19k stars)
- Elixir runtime (less common skillset)
- Requires PostgreSQL

**Integration with Next.js:**
- REST API for subscriber management
- Form builder can generate embeddable forms
- JSON data model for personalization

---

### 3. **Mailtrain**
**GitHub:** https://github.com/Mailtrain-org/mailtrain  
**Stars:** ~5.7k | **Language:** Node.js | **License:** GPL-3.0

**Pros:**
- Built on Node.js (familiar stack for Next.js projects)
- Well-established (mature project)
- Good list management features
- Template support
- Decent community size

**Cons:**
- Slower development (last major updates sporadic)
- More complex multi-service architecture
- Less modern UI compared to Listmonk/Keila
- Requires Redis + MySQL/MariaDB

**Integration with Next.js:**
- Same language ecosystem
- API available for integrations

---

## Other Options Considered

### SendPortal (Laravel/PHP)
- 2.1k stars, MIT license
- PHP-based, requires Laravel knowledge
- Good for Laravel projects, less ideal for Next.js stack

### Ghost (Self-hosted)
- Full CMS with built-in newsletter
- Overkill if only needing newsletter feature
- Would require migrating from current blog setup

### Buttondown (SaaS)
- Not self-hosted
- Developer-friendly API
- Free tier: 100 subscribers
- $9/month for up to 1k subscribers

### NocoDB + n8n (DIY)
- Maximum flexibility
- Requires significant setup/maintenance
- More complex than dedicated newsletter tools

### RSS-to-Email (rss2email)
- Simple Python tool
- Command-line focused
- Minimal features, no web UI

---

## Recommendation: **Listmonk**

### Why Listmonk?
1. **Simplest deployment** - Single binary, Docker compose available
2. **Best performance** - Handles scale without complexity
3. **Modern UI** - Great admin experience
4. **Active development** - v6.1.0 released March 2026
5. **Perfect for blogs** - Designed for newsletters/mailing lists
6. **Easy API** - Simple REST calls from Next.js

### Architecture for GitchPage
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Next.js    │ ───▶ │  Listmonk   │ ───▶ │  SMTP/SES   │
│   (Blog)    │      │  (API)      │      │  (Send)     │
└─────────────┘      └─────────────┘      └─────────────┘
       │                     │
       │                     ▼
       │              ┌─────────────┐
       │              │ PostgreSQL  │
       │              │ (Data)      │
       │              └─────────────┘
       ▼
┌─────────────┐
│  Subscribe  │
│   Form      │
└─────────────┘
```

### Implementation Overview
1. Deploy Listmonk via Docker Compose
2. Configure SMTP provider (AWS SES free tier, SendGrid, etc.)
3. Create subscription form component in Next.js
4. Set up webhook/API call on new blog post publish
5. Create email template for new post alerts

---

## Acceptance Criteria
- [ ] Listmonk instance deployed and accessible
- [ ] Subscription form embedded in blog footer/sidebar
- [ ] Double opt-in workflow functional
- [ ] New post triggers email alert to subscribers
- [ ] Unsubscribe link works in all emails
- [ ] Basic analytics available (open/click rates)
