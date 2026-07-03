# Deploying faisalmohamed.us

Zero-build static site → GitHub → Cloudflare Pages. ~15 minutes, $0/month.

## 1. Push to GitHub (account: faisalm8208-tech)

1. Create a new repo at github.com/faisalm8208-tech → name it `faisalmohamed.us` (public or private both work).
2. Upload everything inside this `website/` folder to the repo root (drag-and-drop on github.com works, or git push).

## 2. Connect Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorize GitHub, select the `faisalmohamed.us` repo.
3. Build settings: **Framework preset: None** · Build command: *(leave empty)* · Output directory: `/`.
4. Deploy. You'll get a `*.pages.dev` preview URL.

## 3. Point the domain

1. In the Pages project → **Custom domains → Add** → `faisalmohamed.us` (and `www.faisalmohamed.us`).
2. Since DNS is already on Cloudflare, records are created automatically. HTTPS is automatic.
3. ⚠️ This does NOT affect your email (MX records for hireme@/career@ stay untouched).

## 4. Activate the placeholders (when ready)

| Item | How |
|---|---|
| Contact form | Create free form at formspree.io → replace `YOUR_FORM_ID` in `consulting.html` |
| Comments + guestbook | Enable Discussions on the repo → generate snippet at giscus.app → paste into `post.html` and `about.html` (commented block is already there) |
| Résumé download | Add `Faisal_Mohamed_Resume.pdf` to repo root → update link in `experience.html` |
| Photos | Drop files in `images/` per `images/README.txt` → ask Claude to wire them in |
| Blog posts | Finish drafts in `blog/posts/*.md`, set `"draft": false` in `blog/posts.json` |
| Analytics | Cloudflare dashboard → Web Analytics → add snippet before `</body>` on each page |

## Publishing a new blog post later

1. Write `blog/posts/my-new-post.md`
2. Add an entry to `blog/posts.json` (slug, title, date, tags, excerpt)
3. Commit → Cloudflare auto-deploys in ~30 seconds
