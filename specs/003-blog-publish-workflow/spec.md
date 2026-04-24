# Feature Specification: Blog Publish Workflow

**Feature Branch**: `003-blog-publish-workflow`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User description: "I need to build out the workflow for posting a new blog. Blogs are written in ERPNext. I need to set up a Newsletter that automatically alerts subscribers from "Blog Subscribers" and "Website" email groups that a blog post was posted. The posting also needs to trigger a rebuild of the website through github actions so that the home page updates with new posts. I have n8n in the stack if needed."

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story

A blog author publishes a new post in ERPNext. Without any manual steps, subscribers in the "Blog Subscribers" and "Website" email groups receive a newsletter email notifying them of the new post. Simultaneously, the GitchPage website automatically rebuilds so the homepage reflects the new post within a reasonable time.

### Acceptance Scenarios

1. **Given** a blog post exists in draft state in ERPNext, **When** the author publishes it, **Then** a newsletter email is automatically sent to all subscribers in both the "Blog Subscribers" and "Website" email groups containing the post title, a brief summary, and a link to read the full post.

2. **Given** a blog post is published in ERPNext, **When** the publish event occurs, **Then** a website rebuild is triggered within 1 minute, and the homepage displays the new post within 10 minutes of publishing.

3. **Given** a subscriber exists in the "Blog Subscribers" email group but not "Website", **When** a blog post is published, **Then** that subscriber still receives the newsletter.

4. **Given** a subscriber exists in both email groups, **When** a blog post is published, **Then** that subscriber receives only one newsletter email (no duplicates).

5. **Given** the website rebuild or newsletter send fails, **When** the failure occurs, **Then** the failure is logged and the site administrator is notified so the issue can be addressed.

6. **Given** a blog post is unpublished or reverted to draft, **When** the status change occurs, **Then** no newsletter or rebuild is triggered.

### Edge Cases

- What happens if a subscriber's email address is invalid or bounces?
- How does the system handle a rebuild that is already in progress when a new publish event arrives?
- What happens if the newsletter send partially fails (some recipients receive it, others do not)?
- What if ERPNext fires duplicate publish events for the same post?

---

## Clarifications

### Session 2026-04-23

- Q: Should the newsletter be sent using ERPNext's native Newsletter feature or via n8n directly? → A: ERPNext native Newsletter — n8n creates a Newsletter record in ERPNext pointing at the two email groups, then triggers ERPNext to send it.
- Q: If a newsletter send or rebuild trigger fails, should the system automatically retry before alerting the admin? → A: One automatic retry before alerting the admin.
- Q: How should the system notify the site administrator when a failure persists after retry? → A: Email to the admin via ERPNext's outbound email.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST automatically detect when a blog post is published in ERPNext and initiate the downstream workflow without any manual intervention from the author.

- **FR-002**: The system MUST send a newsletter email to all active subscribers in both the "Blog Subscribers" and "Website" email groups when a blog post is published. The newsletter MUST be created and sent using ERPNext's native Newsletter feature; the automation middleware's role is to create the Newsletter record and trigger the send via ERPNext's API.

- **FR-003**: The newsletter email MUST include at minimum: the blog post title, a short excerpt or description, and a direct link to read the full post on the blog.

- **FR-004**: Deduplication of recipients across the two email groups is handled by ERPNext's native Newsletter feature when the Newsletter record references both groups.

- **FR-005**: The system MUST trigger a website rebuild so that the homepage reflects the newly published post.

- **FR-006**: The system MUST NOT send a newsletter or trigger a rebuild when a blog post is saved as draft, updated while in draft, or unpublished.

- **FR-007**: The system MUST log the outcome of each newsletter send and each rebuild trigger (success or failure) for audit and troubleshooting purposes.

- **FR-008**: In the event of a newsletter send failure or rebuild trigger failure, the system MUST automatically retry the failed action once before notifying the site administrator. If the retry also fails, the system MUST send a failure notification email to the site administrator via ERPNext's outbound email, including sufficient context (post title, failed action, error detail) to diagnose and resolve the issue manually.

- **FR-009**: The system MUST prevent duplicate newsletters from being sent if the same publish event is received more than once (idempotency).

### Key Entities

- **Blog Post**: Content item authored in ERPNext with a title, body, excerpt, category, and publish status (draft / published).
- **Email Group**: A named list of subscriber email addresses maintained in ERPNext. Two groups are in scope: "Blog Subscribers" and "Website".
- **Subscriber**: An individual with an email address who belongs to one or more email groups and has opted in to receive notifications.
- **Newsletter**: An outbound email sent to a list of subscribers announcing a new blog post, containing the post title, excerpt, and link.
- **Website Rebuild**: An automated process that regenerates the public-facing website so new content is reflected on the homepage.
- **Workflow Event**: The signal emitted when a blog post is published that initiates the newsletter and rebuild steps.
- **Automation Log**: A record of each workflow execution capturing the trigger, actions taken, and outcomes (success or failure).

---

## Success Criteria *(mandatory)*

- A blog post published in ERPNext results in a newsletter email delivered to all qualifying subscribers within 5 minutes, with no manual steps required by the author.
- The website homepage reflects the newly published post within 15 minutes of the publish event.
- Subscribers in both email groups receive exactly one newsletter email per published post (no duplicates, no omissions).
- 100% of publish events generate a log entry capturing the trigger, actions taken, and outcomes.
- Failures in the newsletter send or rebuild trigger are surfaced to the administrator within 5 minutes of the failure.
- The workflow correctly ignores draft saves, draft updates, and unpublish events — no false triggers.

---

## Assumptions *(mandatory)*

- ERPNext supports outbound webhooks that can be configured to fire on blog post publish events.
- The "Blog Subscribers" email group either already exists in ERPNext or will be created as part of this feature; the "Website" email group already exists with active subscribers.
- The automation middleware (n8n) can receive incoming webhook calls from ERPNext, merge subscriber lists, deduplicate emails, send newsletters via ERPNext, and call the GitHub Actions API to trigger a rebuild.
- A GitHub personal access token (PAT) with sufficient permissions to trigger the GitHub Actions workflow dispatch will be provisioned and stored securely in the automation middleware.
- The GitHub Actions workflow for building and deploying the website already exists and supports being triggered via the workflow dispatch API.
- Subscriber opt-in and list management (adding/removing subscribers) is handled separately by existing ERPNext functionality and is out of scope for this feature.
- The newsletter email will be sent through ERPNext's existing email infrastructure (not a third-party ESP).
- Email bounce handling and unsubscribe mechanics are governed by ERPNext's built-in behavior and are out of scope for this feature.

---

## Out of Scope

- Creating or modifying the GitHub Actions build/deploy workflow itself.
- Subscriber sign-up, opt-out, or list management flows.
- Editing or formatting blog posts — authoring remains entirely within ERPNext.
- Social media sharing or cross-posting to external platforms.
- Analytics or tracking of newsletter open rates and click-throughs.
- Removing dead API routes (`/api/subscribe`, `/api/webhook`, `/api/contact`) — tracked separately.
