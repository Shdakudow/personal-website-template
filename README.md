# Personal website template

A responsive personal site with About, Classes at Cornell, Projects, and a GitHub profile link. Built with plain HTML, CSS, and JavaScript. No package installation or build step is needed.

## Customize

Edit `dist/content.js`. Change your name, initials, introduction, GitHub URL, optional email, courses, and projects. All course and project entries are explicitly labeled examples. The GitHub link currently uses the locally configured account, `Shdakudow`.

You can also ask Codex: “Add CS 1234 to Classes at Cornell for Spring 2027, with this description and course link…” or “Replace my introduction with…” and have it update this repository.

Course format:

```js
{
  code: "CS 1234",
  title: "Your course title",
  term: "Spring 2027",
  role: "Student", // or Instructor / Teaching assistant / another role
  description: "Your description",
  tags: ["Computer science"],
  resources: [{ label: "Course website", url: "https://example.com" }]
}
```

This format is an example, not a claim that CS 1234 is a Cornell course. Classes have working search, semester filtering, and detail dialogs. Replace project examples with your own entries and set their `url` to enable direct project links. The email link stays hidden until an email is configured. Content is rendered as text; resource URLs accept only HTTP(S).

## Preview locally

From this directory:

```sh
python3 -m http.server 8767 --directory dist --bind 127.0.0.1
```

Open http://127.0.0.1:8767. Typography loads from Google Fonts when available and falls back to local fonts offline.

## GitHub Pages

Push this repository to GitHub with a `main` branch. In the repository's **Settings → Pages**, select **GitHub Actions** as the build source. The included workflow publishes `dist/` whenever you push to `main`; you can also run it manually from the Actions tab.

Use a repository called `Shdakudow.github.io` for the account homepage, or another name for a project website. All asset paths are relative, so either works. Replace the account name if needed.

The template has no server, sign-in, or browser editing system. Updates are made in the source file, directly or through a request to Codex, then published by a Git push.
