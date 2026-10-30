# Compalgo (www.compalgo.com)

Static site built by GitHub Pages with Jekyll.

- Text pages (edit in Pages CMS, app.pagescms.org): index.html, about.html, science.html,
  contact.html, disclaimer.html, romantic/results.html
- Romantic calculator: romantic/index.html + assets/romantic.js (port of the original Rails algorithm)
- Layouts: _layouts/default.html (header, footer, Google Analytics), page.html (text pages), welcome.html (home heart)
- Menu links: _data/navigation.yml  ·  Algorithm list on the home page: _data/algorithms.yml
- Google Analytics ID and contact email: _config.yml
- Images: assets/images  ·  Styles: assets/style.css

Adding a new calculator later (e.g. career): create career/index.html with
`layout: default`, `permalink: /career/` and `script: career.js`, put the code in assets/career.js,
then un-comment the career lines in _data/navigation.yml and _data/algorithms.yml.
