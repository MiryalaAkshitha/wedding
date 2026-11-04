// EDIT THIS FILE: every name, date, place, image and colour on the invitation lives here.
// Sample values below are placeholders. Replace them all before sharing.

export const theme = {
  primary: '#54291a', // brown used for the invitation card inside (try '#6b1426' for burgundy)
  accent: '#dfb879', // gold used for small headings and borders
  opening: '#6b1426', // opening screen curtains
  openingDeep: '#4a0a18', // opening screen edges
};

export const wedding = {
  // parents: add them like ['Father name', '& Mother name']. While empty, the line is hidden.
  groom: { name: 'Krishna Vamshi', parentsLabel: 'Son of', parents: [] },
  bride: { name: 'Harika', parentsLabel: 'Daughter of', parents: [] },

  date: '2026-11-21', // main wedding day, YYYY-MM-DD
  utcOffset: '+05:30', // time zone of the venue (India is +05:30)
  timeNote: 'All times are India Standard Time.',
  place: 'Hyderabad', // short place shown on the opening screen

  // Every function, in date order. Times are 24-hour. The one marked main: true is shown large and drives the countdown.
  events: [
    { date: '2026-11-21', title: 'Marriage', telugu: 'సుముహూర్తం', time: '10:04', note: '', place: 'KBR Convention', map: 'https://maps.app.goo.gl/6szL4xWuC4VZwLhQ7', main: true },
  ],

  venue: {
    name: ['KBR Convention'],
    address: ['Chandeeshwari Colony, Mansoorabad', 'Hyderabad, Telangana 500068'],
  },

  text: {
    openingKicker: 'WITH LOVE, YOU’RE INVITED',
    openButton: 'Here’s your invitation 💌',
    openingNote: 'With divine grace and the blessings of our elders',
    telugu: 'శ్రీరస్తు శుభమస్తు అవిఘ్నమస్తు', // set to '' to hide
    blessing: 'With divine grace and the blessings of our elders',
    invitation: 'We solicit your gracious presence, along with your family and friends, on the auspicious occasion of our wedding.',
    presence: 'Your presence and blessings will make our day truly complete.',
    celebrationHeading: 'The wedding',
  },

  // Put your files in public/ and point to them here. Keep similar proportions for the best fit.
  images: {
    toran: './art/toran.webp', // small garland on the opening screen, repeats across the width
    ganesh: './art/ganesh.webp', // line art used for the opening animation and small marks (white on transparent)
    couple: './art/couple-steps.webp', // couple walking hand in hand above the footer (transparent background)
    emblem: './art/emblem.webp', // emblem beside the names on the opening screen (transparent background)
    marriage: './art/couple-blessing.webp', // small picture beside Marriage (transparent background)
    marriageAlt: 'The bride and groom sitting together, each placing a hand on the other’s head',
    hero: './version-three/temple-kalyanam-sketch.webp', // large centre illustration (3:2)
    heroAlt: 'Illustration of a South Indian temple wedding',
    corner: './version-three/banana-jasmine-corner.webp', // top corner garland (2:3)
    border: './version-three/celebration/continuous-thoranam.webp', // side border strand (1:3, tiles vertically)
  },
  music: './seetha-kalyanam.mp3',
  autoScrollSpeed: 70, // pixels per second after opening; 0 turns it off. Stops when the guest touches the page.
};
