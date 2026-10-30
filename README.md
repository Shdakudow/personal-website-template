# Jupiter Yao — Personal website

A responsive personal site with About, Classes at Cornell, Projects, and a GitHub profile link. Built with plain HTML, CSS, and JavaScript. No package installation or build step is needed.

## Customize

Edit `dist/content.js` to update the introduction, GitHub URL, optional email, courses, and projects. The course list contains Jupiter Yao’s Cornell coursework; project entries remain labeled examples.

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

This format is an example, not a claim that CS 1234 is a Cornell course. Courses are grouped under semester headings, newest first, with each entry showing its class name and professor. Class names link to the official semester roster used to verify the instructor. Search works by class name, course code, professor, or semester, and hides groups without matches. The A&S advising seminar and transfer credits are omitted. Grades, GPA, student identifiers, and transcript files are not included.

Replace project examples with your own entries and set their `url` to enable direct project links. The email link stays hidden until an email is configured. Content is rendered as text; source URLs accept only HTTP(S).

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
