// Inside the Commander Safeguard museum a 404 means the Wayback Machine never captured that file.
if (location.pathname.indexOf('/Portfolio/commander-safeguard/') === 0) {
  document.querySelector('h1').textContent = 'Not in the archive';
  document.querySelector('main p').textContent = 'The Internet Archive never captured this page or file, so it could not be restored. Everything that survived is in the museum.';
  var links = document.querySelectorAll('.row a');
  links[0].href = '/Portfolio/commander-safeguard/'; links[0].textContent = 'Back to the museum';
  links[1].href = '/Portfolio/commander-safeguard/catalogue.html'; links[1].textContent = 'Recovered catalogue';
}
