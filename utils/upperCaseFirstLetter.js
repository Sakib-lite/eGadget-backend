function uppercaseFirstLetter(val) {
  return val.replace(
    /(^\w|\s\w)(\S*)/g,
    (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
  );
}

/*
^\w : first character of the string
| : or
\s\w : first character after whitespace
(^\w|\s\w) Capture the pattern.
g Flag: Match all occurrences.
*/

module.exports = uppercaseFirstLetter;
