# Jupiter Yao — Personal website

A responsive personal site with About, Research, Classes at Cornell, Projects, and a GitHub profile link. Built with plain HTML, CSS, and JavaScript. No package installation or build step is needed.

The coat of arms sits in the top-left header. The introduction uses the original photo of Locke 洛克 and Melody 魅洛迪 from IMG_1591, framed with a CSS crop that preserves the photograph. Locke’s caption includes the requested memorial note.

## Customize

Edit `dist/content.js` to update the introduction, GitHub URL, optional email, experience, education, publications, teaching, languages, certifications, courses, and projects. The compact About overview includes Computational Imaging Lab experience and the Fall 2025–Spring 2027 degree dates alongside the introduction. Publications include DE-VJEPA (under review at TMLR, with its public code repository) and H2DF (with verified arXiv and PDF links). Teaching and language qualifications share a compact section. Certificate dates are omitted because they are not recalled. The course list contains Jupiter Yao’s Cornell coursework; sample projects are retained as hidden drafts.

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

Replace project drafts with your own entries, remove `draft: true`, and set their `url` to enable direct project links. The Projects section and navigation link stay hidden until a published entry exists. The contact link uses the configured Cornell email. Set `cv` to a public HTTP(S) URL to show a CV link; it stays hidden while empty. Content is rendered as text; source URLs accept only HTTP(S).

## Preview locally

From this directory:

```sh
python3 -m http.server 8767 --directory dist --bind 127.0.0.1
```

Open http://127.0.0.1:8767. The site uses local system fonts and requires no external font service.

## GitHub Pages

Push this repository to GitHub with a `main` branch. In the repository's **Settings → Pages**, select **GitHub Actions** as the build source. The included workflow publishes `dist/` whenever you push to `main`; you can also run it manually from the Actions tab.

Use a repository called `Shdakudow.github.io` for the account homepage, or another name for a project website. All asset paths are relative, so either works. Replace the account name if needed.

The template has no server, sign-in, or browser editing system. Updates are made in the source file, directly or through a request to Codex, then published by a Git push.
