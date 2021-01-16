// inject(str, str) -> str
// inject a script into an html file
// adds the script tag to the end of the head tag,
// with a defer flag to run after page load
module.exports = function inject (script, html) {
  const idx = html.indexOf('</head>')
  return html.slice(0, idx) +
    '<script defer>' + script + '</script>' +
    html.slice(idx)
}
