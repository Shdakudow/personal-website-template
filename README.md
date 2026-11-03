# Jupiter Yao — Personal website

A responsive personal site with About, Research, Classes at Cornell, Projects, and a GitHub profile link. Built with plain HTML, CSS, and JavaScript. No package installation is needed. Run `python3 scripts/build.py` after content changes; GitHub Actions also runs it before publishing.

The coat of arms sits in the top-left header. The introduction uses the original photo of Locke 洛克 and Melody 魅洛迪 from IMG_1591, framed with a CSS crop that preserves the photograph. Locke’s caption includes the requested memorial note.

## Customize

Edit `dist/content.js` to update the introduction, GitHub URL, optional email, experience, education, publications, teaching, achievements, languages, certifications, skills, personal interests, opportunities, courses, and projects. The compact About overview includes Computational Imaging Lab experience and the Fall 2025–Spring 2027 degree dates alongside the introduction. Publications include DE-VJEPA (under review at TMLR, with its public code repository) and H2DF (with verified arXiv and PDF links). Teaching, achievements, and language qualifications share a compact section. The IMC Prosperity 4 result is listed as Top 1%. Certificate dates are omitted because they are not recalled. Confirmed skills appear in the overview; personal interests sit below the introduction, and the footer includes the opportunity interests. The course list contains Jupiter Yao’s Cornell coursework; selected projects include GAT with Graph-Aware Features and the ViT–Swin Interactive Demo.

You can also ask Codex to add a class with its name, professor, and semester, or to update the introduction.

Course format:

```js
{
  code: "CS 1234",
  title: "Your course title",
  term: "Spring 2027",
  professor: "Professor name",
  source: "https://classes.cornell.edu/browse/roster/SP27/class/CS/1234"
}
```

This format is an example, not a claim that CS 1234 is a Cornell course. Courses appear in two columns on desktop, stacked on mobile. Each semester has an expandable heading and compact entries showing course code, class name, and professor. The newest semester in each column starts open; other semesters can be expanded individually. Semesters run newest first. Class names link to the official semester roster used to verify the instructor. Search works by class name, course code, professor, or semester, opens matching semesters, and hides groups without matches. The A&S advising seminar and transfer credits are omitted. Grades, GPA, student identifiers, and transcript files are not included.

Add projects through the `projects` array. Set `draft: true` to hide an entry. Use each project’s `links` array for separate public demo and code URLs. The GAT project links to its public repository under kalvin1019; the ViT–Swin project links to both its live demo and repository. The Projects section and navigation link stay hidden until a published entry exists. The contact link uses the configured Cornell email. Set `cv` to a public HTTP(S) URL to show a CV link; it stays hidden while empty. Content is rendered as text; source URLs accept only HTTP(S).

## Preview locally

From this directory, regenerate the initial HTML and start the preview:

```sh
python3 scripts/build.py
python3 -m http.server 8767 --directory dist --bind 127.0.0.1
```

Open http://127.0.0.1:8767. The site uses local system fonts and requires no external font service.

## GitHub Pages

Push this repository to GitHub with a `main` branch. In the repository's **Settings → Pages**, select **GitHub Actions** as the build source. The included workflow publishes `dist/` whenever you push to `main`; you can also run it manually from the Actions tab.

Use a repository called `Shdakudow.github.io` for the account homepage, or another name for a project website. All asset paths are relative, so either works. Replace the account name if needed.

The template has no server, sign-in, or browser editing system. Updates are made in the source file, directly or through a request to Codex, then published by a Git push.

## Google Search

The build includes the profile, education, experience, research, and project content directly in the HTML. JavaScript refreshes these entries and provides class search and the additional background lists. `siteUrl`, `pageTitle`, and `siteDescription` in `dist/content.js` configure the canonical URL, title, description, social metadata, ProfilePage structured data, and single-page `dist/sitemap.xml`. If the public URL changes, update `siteUrl` and rebuild.

For indexing, add `https://shdakudow.github.io/personal-website-template/` as a **URL prefix** property in [Google Search Console](https://search.google.com/search-console). Use its **HTML tag** verification method, put the supplied meta tag in the document head outside the generated `search-metadata` block, publish, and verify. Then inspect the homepage and request indexing; submit `https://shdakudow.github.io/personal-website-template/sitemap.xml` under Sitemaps. Google controls indexing and timing; publication or a sitemap does not guarantee inclusion.

A project-level `robots.txt` would not control crawling: crawlers read it at the host root. The root currently returns 404, which does not block crawling, so no ineffective project-level file is included.
