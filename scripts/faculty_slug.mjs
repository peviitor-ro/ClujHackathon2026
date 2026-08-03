/**
 * Transforma numele unei facultati in numele repository-ului.
 *
 *   "Facultatea de Matematică și Informatică, UBB"  ->  matematica-si-informatica-ubb
 *   "Facultatea de Psihologie și Științe ale Educației, UBB"
 *                                                   ->  psihologie-stiinte-educatiei-ubb
 *
 *   node scripts/faculty_slug.mjs "Facultatea de ..."
 */

// Cuvinte care nu adauga informatie in numele unui repo
const STOPWORDS = new Set([
  'facultatea',
  'facultate',
  'universitatea',
  'universitate',
  'de',
  'din',
  'ale',
  'al',
  'a',
  'si',
]);

const MAX_LENGTH = 60;

function facultySlug(name) {
  const words = String(name)
    // NFD desparte diacriticele romanesti (ă â î ș ț) de litera de baza
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w));

  let slug = words.join('-');

  // Taiem la limita unui cuvant, nu in mijlocul lui
  if (slug.length > MAX_LENGTH) {
    slug = slug.slice(0, MAX_LENGTH).replace(/-[^-]*$/, '');
  }

  return slug;
}

const input = process.argv[2] || '';
const slug = facultySlug(input);

if (!slug) {
  process.stderr.write(`Nu am putut deriva un nume de repository din "${input}"\n`);
  process.exit(1);
}

process.stdout.write(slug);
