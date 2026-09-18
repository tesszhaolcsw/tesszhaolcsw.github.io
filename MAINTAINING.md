# Tess Zhao website: editing guide

## Sign in

1. Go to https://app.pagescms.org and sign in with the GitHub account that has access to `tesszhaolcsw/tesszhaolcsw.github.io`.
2. If prompted, install or authorize the Pages CMS GitHub App for this repository.
3. Open the repository and choose the `main` branch.

## Create an article

Choose **English articles** or **中文文章**, then choose **New**. Complete the title, summary, date, and article body. New articles start as drafts.

Use a short, stable filename when Pages CMS asks for one. The public URL is based on that filename, so changing it later can break saved links.

## Draft versus publish

- **Save** writes the article to GitHub.
- If **Keep as draft** is on, the article remains private from the generated site, article lists, RSS feeds, and sitemap.
- To publish, turn **Keep as draft** off and save again.
- GitHub Actions then rebuilds the site. Allow several minutes.

A future publication date does not publish by itself. Tess must turn off the draft setting and save, unless a separate scheduled workflow is added later.

## Images and alt text

Upload only images intended for public viewing. Add concise alt text describing the meaningful visual content. Do not begin with “image of.” Decorative images may have an empty description only when the site template intentionally treats them as decorative.

## Verify deployment

Open the repository’s **Actions** tab and select the latest “Build and deploy website” run. A green check means the build completed. Then verify the article on the live site and on a phone-sized screen.

If a run fails, leave the article as a draft and request technical help. Do not repeatedly edit workflow or code files in Pages CMS.

## Privacy and safety

Never upload client names, contact details, intake responses, identifiable case material, clinical notes, credentials, API keys, or private documents. Git history may retain a file even after it is removed. Scheduling, intake, payments, and secure messages belong in approved external systems—not in this repository or Pages CMS.

## Restore an earlier version

GitHub keeps every saved change. In the repository, open the file’s **History**, choose the last correct version, and use GitHub’s revert option or ask a technical maintainer to restore it. Avoid force-pushing or deleting history.

## What Pages CMS does not edit

Pages CMS intentionally exposes article content and public article images only. Layout, navigation code, CSS, scripts, and deployment settings remain protected in the repository. Ask a technical maintainer for design or structural changes.
