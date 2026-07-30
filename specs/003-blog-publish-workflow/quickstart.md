# Quickstart & Manual Verification: Blog Publish Workflow

**Date**: 2026-04-23 | **Feature**: `003-blog-publish-workflow`

This guide describes how to manually verify the complete blog publish workflow after implementation. All steps are executable without code knowledge.

---

## Prerequisites

Before running verification:

- [ ] ERPNext webhook is configured and active (Setup → Integrations → Webhooks)
- [ ] n8n workflow is active (not paused)
- [ ] "Blog Subscribers" email group exists in ERPNext with at least one test address
- [ ] "Website" email group has at least one subscriber
- [ ] GitHub PAT is stored in n8n credentials and has `workflow` scope
- [ ] A test email address you can check is subscribed to one of the groups

---

## Smoke Test: Full Happy Path

### Step 1 — Create a test blog post in ERPNext

1. Go to `https://erp.gitchegumi.com/app/blog-post/new-blog-post-1`
2. Fill in:
   - **Title**: `Workflow Smoke Test — [today's date]`
   - **Blog Intro**: `This is a test post to verify the automated publish workflow.`
   - **Blog Category**: any existing category
3. Leave `Published` unchecked (draft state)
4. Click **Save** — confirm no newsletter is triggered (check n8n executions; should see no new execution or an execution that halted at the guard)

### Step 2 — Publish the post

1. Check the **Published** checkbox on the blog post
2. Click **Save**
3. Note the timestamp

### Step 3 — Verify n8n execution

1. Go to `https://n8n.gitchegumi.com` → open the Blog Publish Workflow
2. Click **Executions** tab
3. Confirm a new execution appeared within 10 seconds of the save
4. Confirm all nodes show green (success)
5. Confirm the idempotency check node shows "not duplicate — proceeding"

### Step 4 — Verify newsletter was created in ERPNext

1. Go to `https://erp.gitchegumi.com/app/newsletter`
2. Confirm a Newsletter record exists with subject `New Post: Workflow Smoke Test — [today's date]`
3. Open the record and confirm:
   - Both "Blog Subscribers" and "Website" email groups are listed
   - `Email Sent` is checked

### Step 5 — Verify newsletter email received

1. Check the inbox of your test email address
2. Confirm an email arrived with subject `New Post: Workflow Smoke Test — [today's date]`
3. Confirm the email contains:
   - The post title as a heading
   - The blog intro text
   - A working link to `https://gitchegumi.com/blog/...`
4. Confirm only ONE email was received (no duplicates, even if subscribed to both groups)

### Step 6 — Verify GitHub Actions rebuild was triggered

1. Go to `https://github.com/Gitchegumi/GitchPage/actions`
2. Confirm a new "Deploy Next.js site to Pages" workflow run appeared within 1 minute of the publish
3. Wait for the run to complete (typically 2–8 minutes)
4. Go to `https://gitchegumi.com` and confirm the new post appears on the homepage

---

## Idempotency Test

1. With the same post still published, open the blog post in ERPNext and save it again (no field changes needed)
2. Check n8n executions — a new execution should appear but halt at the idempotency check
3. Confirm NO second newsletter email arrives in your inbox
4. Confirm NO second GitHub Actions run was triggered

---

## Failure / Retry Test (optional — requires temporarily breaking a credential)

1. In n8n, temporarily change the GitHub PAT credential to an invalid value
2. Publish a new test blog post
3. Observe n8n execution: GitHub dispatch branch should fail, retry after 30s, fail again, then trigger admin notification
4. Check `mat@gitchegumi.com` inbox for a failure alert email
5. Restore the correct GitHub PAT credential
6. Confirm the newsletter was still sent successfully (the two branches are independent)

---

## Cleanup After Testing

1. Unpublish the test blog post (uncheck Published, Save)
2. Delete the test Newsletter record from ERPNext (or leave for audit trail)
3. Optionally delete the test GitHub Actions run from the Actions tab
