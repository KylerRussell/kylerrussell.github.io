# kylerrussell.github.io

Personal site of Kyler Russell — built with [Jekyll](https://jekyllrb.com/) and deployed to GitHub Pages by GitHub Actions.

## Editing content

Everything on the site comes from YAML files in `_data/`:

| File | What it holds |
| --- | --- |
| `_data/research.yml` | **Research** — the three-pillar triad on the home page |
| `_data/projects.yml` | **Personal projects** — AlphaSlayer (feature panel), k8s cluster and dotfiles (spec-sheet cards) |
| `_data/work.yml` | **Work** — ComfyCup and client work |
| `_data/experience.yml` | **Experience** — education / roles |
| `_data/archive.yml` | High-school / Engineering Academy work (archive page only) |

Two flags control where an entry appears:

- `current: true` — show it on the **home page**. Remove it (or set `false`) when something is no longer recent; it stays on the archive page.
- `active: true` — mark it as ongoing (pulsing "Active" badge on the archive page).

Every entry also needs `year:` (the year it started, as a string like `"2026"`). The **archive page** (`/archive/`, `archive/index.html`) merges all four data files and groups them by that year automatically.

Site-wide details (name, email, social handles, the "now active" radar lines, résumé link) live in `_config.yml`.

### Writing

Add Markdown files to `_posts/` named `YYYY-MM-DD-title.md`. A **Writing** link appears in the nav automatically once there is at least one post. See `_drafts/example-post.md` for front matter.

### Images

`assets/img/` holds web-sized images (≈1400 px, ~150 KB). Original full-resolution photos stay in `assets/images/`, which is excluded from the built site.

## Running locally

```sh
bundle install
bundle exec jekyll serve --livereload
# → http://localhost:4000
```

## Structure

```
_config.yml        site settings
_data/             page content (YAML)
_includes/         head, nav, footer
_layouts/          default, page, post
assets/css/site.css
assets/js/site.js  archive photo carousel + lightbox
index.html         home page
archive/index.html everything, grouped by year
writing/index.html blog index
```
