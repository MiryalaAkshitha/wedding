// EDIT THIS FILE: every name, date, place, image and colour on the invitation lives here.
// Sample values below are placeholders. Replace them all before sharing.

export const theme = {
  primary: '#54291a', // brown used for the invitation card inside (try '#6b1426' for burgundy)
  accent: '#dfb879', // gold used for small headings and borders
  opening: '#6b1426', // opening screen curtains
  openingDeep: '#4a0a18', // opening screen edges
};

export const wedding = {
  groom: { name: 'Raja', parentsLabel: 'Son of', parents: ['Raja Dad', '& Raja Mom'] },
  bride: { name: 'Rani', parentsLabel: 'Daughter of', parents: ['Rani Dad', '& Rani Mom'] },

  date: '2027-02-14', // YYYY-MM-DD
  utcOffset: '+05:30', // time zone of the venue (India is +05:30)
  timeNote: 'All times are India Standard Time.',
  place: 'Hyderabad', // short place shown on the opening screen

  // 24-hour times. Add or remove events freely; set telugu to '' to hide that line.
  events: [
    { telugu: 'సుముహూర్తం', title: 'Wedding ceremony', time: '07:30' },
    { telugu: 'వివాహ విందు', title: 'Wedding lunch', time: '12:00' },
  ],

  venue: {
    name: ['Your Venue Name', 'Hall & Gardens'],
    address: ['123 Venue Road', 'Hyderabad, Telangana'],
  },

  text: {
    openingKicker: 'WITH LOVE, YOU’RE INVITED',
    openButton: 'Here’s your invitation 💌',
    openingNote: 'With divine grace and the blessings of our elders',
    telugu: 'శ్రీరస్తు శుభమస్తు అవిఘ్నమస్తు', // set to '' to hide
    blessing: 'With divine grace and the blessings of our elders',
    invitation: 'We solicit your gracious presence, along with your family and friends, on the auspicious occasion of our wedding.',
    presence: 'Your presence and blessings will make our day truly complete.',
    celebrationHeading: 'The wedding celebration',
  },

  // Put your files in public/ and point to them here. Keep similar proportions for the best fit.
  images: {
    toran: './art/toran.webp', // small garland on the opening screen, repeats across the width
    ganesh: './art/ganesh.webp', // line art used for the opening animation and small marks (white on transparent)
    couple: './art/couple.webp', // couple standing above the footer (transparent background)
    emblem: './art/emblem.webp', // emblem beside the names on the opening screen (transparent background)
    hero: './version-three/temple-kalyanam-sketch.webp', // large centre illustration (3:2)
    heroAlt: 'Illustration of a South Indian temple wedding',
    corner: './version-three/banana-jasmine-corner.webp', // top corner garland (2:3)
    border: './version-three/celebration/continuous-thoranam.webp', // side border strand (1:3, tiles vertically)
  },
  music: './seetha-kalyanam.mp3',
  autoScrollSpeed: 70, // pixels per second after opening; 0 turns it off. Stops when the guest touches the page.
};
