import type { ReactNode, SVGProps } from 'react'

/*
 * Hand-drawn icon set (24×24 grid) replacing every emoji in the app. Line icons use currentColor so they
 * follow the text colour; a few carry a soft fill (opacity .2–.3) for the gilded Teyvat look.
 */
const soft = { fill: 'currentColor', fillOpacity: 0.22, stroke: 'none' } as const

const ICONS = {
  // ── actions
  speaker: <><path d="M4 9.5h3.2L12 5.2v13.6l-4.8-4.3H4z" {...soft} /><path d="M4 9.5h3.2L12 5.2v13.6l-4.8-4.3H4z" /><path d="M15.2 9a4 4 0 0 1 0 6M17.8 6.5a7.5 7.5 0 0 1 0 11" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" {...soft} /><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" /></>,
  micOff: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7M4 4l16 16" /></>,
  headphones: <><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><rect x="3.5" y="14" width="4" height="6.5" rx="1.6" {...soft} /><rect x="3.5" y="14" width="4" height="6.5" rx="1.6" /><rect x="16.5" y="14" width="4" height="6.5" rx="1.6" {...soft} /><rect x="16.5" y="14" width="4" height="6.5" rx="1.6" /></>,
  play: <><path d="M8 5.5v13l10.5-6.5z" {...soft} /><path d="M8 5.5v13l10.5-6.5z" /></>,
  replay: <><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" /><path d="M4 4v4.5h4.5" /></>,
  check: <path d="M4.5 12.5l4.8 4.8L19.5 7" strokeWidth={2.4} />,
  cross: <path d="M6 6l12 12M18 6L6 18" strokeWidth={2.4} />,
  arrowRight: <path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5" />,
  arrowLeft: <path d="M19.5 12h-14M11 6.5L5.5 12l5.5 5.5" />,
  chevronRight: <path d="M9 5.5l6.5 6.5L9 18.5" />,
  chevronDown: <path d="M5.5 9l6.5 6.5L18.5 9" />,
  plus: <path d="M12 5v14M5 12h14" />,
  upload: <><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" /><path d="M4.5 14.5v3.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3.5" /></>,
  download: <><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" /><path d="M4.5 14.5v3.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3.5" /></>,
  flag: <><path d="M5.5 21V4" /><path d="M5.5 4.5h11l-2.2 4 2.2 4h-11" {...soft} /><path d="M5.5 4.5h11l-2.2 4 2.2 4h-11" /></>,
  eye: <><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" {...soft} /><circle cx="12" cy="12" r="3" /></>,
  gear: <><circle cx="12" cy="12" r="3.2" /><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3L5.5 5.5" /><circle cx="12" cy="12" r="6.6" /></>,
  bell: <><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z" {...soft} /><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 20.5a2.2 2.2 0 0 0 4 0" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.2" {...soft} /><rect x="5" y="10.5" width="14" height="10" rx="2.2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5" /></>,
  unlock: <><rect x="5" y="10.5" width="14" height="10" rx="2.2" /><path d="M8 10.5V7.5a4 4 0 0 1 7.6-1.8M12 14.5v2.5" /></>,
  warning: <><path d="M12 3.5l9.5 16.5h-19z" {...soft} /><path d="M12 3.5l9.5 16.5h-19zM12 10v4.5M12 17.2v.3" /></>,
  bulb: <><path d="M8.5 15.5a6 6 0 1 1 7 0c-.8.6-1 1.3-1 2.2h-5c0-.9-.2-1.6-1-2.2z" {...soft} /><path d="M8.5 15.5a6 6 0 1 1 7 0c-.8.6-1 1.3-1 2.2h-5c0-.9-.2-1.6-1-2.2zM9.8 20.8h4.4" /></>,
  chat: <><path d="M4 5.5h16v10.5H10l-4.5 3.5v-3.5H4z" {...soft} /><path d="M4 5.5h16v10.5H10l-4.5 3.5v-3.5H4zM8 9.5h8M8 12.5h5" /></>,
  sleep: <path d="M5 6h5l-5 6h5M13 11h4.5l-4.5 5h4.5M16 4h3l-3 3.5h3" />,

  // ── currency & rewards
  // Kirameki: a four-pointed star gem in the spirit of a primogem
  gem: <><path d="M12 2.5l3 6.5 6.5 3-6.5 3-3 6.5-3-6.5-6.5-3 6.5-3z" fill="currentColor" fillOpacity={0.3} /><path d="M12 2.5l3 6.5 6.5 3-6.5 3-3 6.5-3-6.5-6.5-3 6.5-3z" /><path d="M12 7.5l1.6 3 3 1.5-3 1.5-1.6 3-1.6-3-3-1.5 3-1.5z" fill="currentColor" stroke="none" /></>,
  star: <><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" fill="currentColor" fillOpacity={0.3} /><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" /></>,
  sparkle: <><path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" fill="currentColor" fillOpacity={0.3} /><path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7zM19 16.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5z" /></>,
  trophy: <><path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z" {...soft} /><path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0zM7.5 6H4.5a3 3 0 0 0 3.4 4M16.5 6h3a3 3 0 0 1-3.4 4M12 13.5v3.5M8 20.5h8M9.5 17h5v3.5h-5z" /></>,
  medal: <><path d="M8 3l2.5 6M16 3l-2.5 6" /><circle cx="12" cy="15" r="5.5" {...soft} /><circle cx="12" cy="15" r="5.5" /><path d="M12 12.2l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z" fill="currentColor" stroke="none" /></>,
  gift: <><rect x="4" y="9.5" width="16" height="11" rx="1.5" {...soft} /><rect x="4" y="9.5" width="16" height="11" rx="1.5" /><path d="M3 7h18v2.5H3zM12 7v13.5M12 7C10.5 4 7 3.5 7 5.5S10 7 12 7zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7z" /></>,
  // Wish: an intertwined-fate style knot
  wish: <><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5c-3 3-3 14 0 17M12 3.5c3 3 3 14 0 17M3.5 12c3-3 14-3 17 0M3.5 12c3 3 14 3 17 0" /><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /></>,
  heart: <><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" fill="currentColor" /></>,
  heartEmpty: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />,
  flame: <><path d="M12 21c-4 0-6.5-2.7-6.5-6.3 0-3.4 2.4-5.4 3.6-8.7.8 2 1.9 2.8 2.9 3.2.2-2.7 1.6-4.9 3.4-6.2-.3 3.3 2.6 5.6 2.6 10.2 0 4.2-2.5 7.8-6 7.8z" {...soft} /><path d="M12 21c-4 0-6.5-2.7-6.5-6.3 0-3.4 2.4-5.4 3.6-8.7.8 2 1.9 2.8 2.9 3.2.2-2.7 1.6-4.9 3.4-6.2-.3 3.3 2.6 5.6 2.6 10.2 0 4.2-2.5 7.8-6 7.8z" /><path d="M12 21c-1.8 0-2.8-1.2-2.8-2.8 0-1.8 1.6-2.6 2.2-4.2 1.4 1 3.4 2.4 3.4 4.4 0 1.6-1.2 2.6-2.8 2.6z" fill="currentColor" stroke="none" /></>,
  snowflake: <path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6M9.5 4.2L12 6.5l2.5-2.3M9.5 19.8L12 17.5l2.5 2.3M3.6 10.6l3.3-.6-1-3.2M20.4 13.4l-3.3.6 1 3.2M3.6 13.4l3.3.6-1 3.2M20.4 10.6l-3.3-.6 1-3.2" />,
  shield: <><path d="M12 3l7.5 3v5.5c0 4.7-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.8-7.5-9.5V6z" {...soft} /><path d="M12 3l7.5 3v5.5c0 4.7-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.8-7.5-9.5V6zM12 7v10M8 11h8" /></>,
  hourglass: <><path d="M6.5 3.5h11M6.5 20.5h11M7.5 3.5c0 5 4.5 6 4.5 8.5s-4.5 3.5-4.5 8.5M16.5 3.5c0 5-4.5 6-4.5 8.5s4.5 3.5 4.5 8.5" /><path d="M9.2 19.5c.6-2.5 2.8-3.3 2.8-4.8 0 1.5 2.2 2.3 2.8 4.8z" fill="currentColor" stroke="none" /></>,
  timer: <><circle cx="12" cy="13.5" r="7.5" {...soft} /><circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5v4.2l2.8 1.8M9.5 2.5h5M12 2.5V6" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /><path d="M7 12.5h3v3H7z" fill="currentColor" stroke="none" /></>,
  chart: <><path d="M4 20h16M4 20V4" /><path d="M7.5 16.5V12M11.5 16.5V8M15.5 16.5v-6M19 16.5V6" strokeWidth={2.4} /></>,

  // ── learning
  book: <><path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z" {...soft} /><path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5V20" /></>,
  scroll: <><path d="M6.5 4h11a2 2 0 0 1 2 2v1.5h-3V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 2.5 18v-1h11v1" /><path d="M6.5 4a2 2 0 0 0-2 2v11h9v1a2.5 2.5 0 0 0 2.5 2.5" {...soft} /><path d="M8 8.5h5.5M8 11.5h5.5M8 14.5h3.5M6.5 4a2 2 0 0 1 2 2v1.5" /></>,
  brush: <><path d="M14.5 4.5l5 5-7.5 7.5-5-5z" {...soft} /><path d="M14.5 4.5l5 5-7.5 7.5-5-5zM7 12c-2 .5-3 2-3 3.8 0 1.6-.6 2.7-1.5 3.7 3.5.3 7-.6 8-4" /><path d="M17 2l5 5" /></>,
  exam: <><rect x="5" y="3" width="14" height="18" rx="2" {...soft} /><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8.5 8l1.2 1.2L12 7M8.5 13l1.2 1.2L12 12M14 8h2M14 13h2M8.5 17.5h7" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="5" {...soft} /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /></>,
  puzzle: <><path d="M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4H4z" {...soft} /><path d="M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4H4z" /></>,
  bolt: <><path d="M13.5 2.5L5 13.5h6L10 21.5l9-11h-6z" {...soft} /><path d="M13.5 2.5L5 13.5h6L10 21.5l9-11h-6z" /></>,
  cards: <><rect x="3" y="6" width="11" height="15" rx="2" transform="rotate(-8 8.5 13.5)" {...soft} /><rect x="3" y="6" width="11" height="15" rx="2" transform="rotate(-8 8.5 13.5)" /><rect x="10" y="3.5" width="11" height="15" rx="2" transform="rotate(8 15.5 11)" /></>,
  rain: <><path d="M6.5 13.5a4 4 0 0 1 .6-8 5.5 5.5 0 0 1 10.3 1.4 3.4 3.4 0 0 1-.4 6.6z" {...soft} /><path d="M6.5 13.5a4 4 0 0 1 .6-8 5.5 5.5 0 0 1 10.3 1.4 3.4 3.4 0 0 1-.4 6.6zM8 16.5l-1 3M12 16.5l-1 3M16 16.5l-1 3" /></>,
  hammer: <><path d="M13.5 3.5l6 3-2 4-6-3z" {...soft} /><path d="M13.5 3.5l6 3-2 4-6-3zM12.5 7.5L4 19a1.5 1.5 0 0 0 2 2l8.5-11.5" /></>,
  waves: <path d="M2.5 9c2.5-2.5 4.5-2.5 6.5 0s4.5 2.5 6.5 0 4.5-2.5 6.5 0M2.5 15c2.5-2.5 4.5-2.5 6.5 0s4.5 2.5 6.5 0 4.5-2.5 6.5 0" />,
  echo: <><circle cx="7" cy="12" r="2.5" fill="currentColor" /><path d="M11 8.5a5 5 0 0 1 0 7M14 6a8.5 8.5 0 0 1 0 12M17 3.5a12 12 0 0 1 0 17" /></>,
  blocks: <><rect x="3.5" y="13" width="8" height="7" rx="1" {...soft} /><rect x="3.5" y="13" width="8" height="7" rx="1" /><rect x="12.5" y="13" width="8" height="7" rx="1" /><rect x="8" y="5" width="8" height="7" rx="1" {...soft} /><rect x="8" y="5" width="8" height="7" rx="1" /></>,
  turtle: <><path d="M4 15.5c0-4.5 3.5-8 8-8s8 3.5 8 8z" {...soft} /><path d="M4 15.5c0-4.5 3.5-8 8-8s8 3.5 8 8zM20 13.5h2M7 15.5v3M17 15.5v3M9 8.5l3 3 3-3M12 11.5v4" /></>,
  save: <><path d="M4.5 4.5h11.5l3.5 3.5v11.5h-15z" {...soft} /><path d="M4.5 4.5h11.5l3.5 3.5v11.5h-15zM8 4.5v4.5h7V4.5M8 19.5v-5h8v5" /></>,

  // ── places & combat
  home: <><path d="M3.5 11L12 4l8.5 7" /><path d="M5.5 9.5V20h13V9.5" {...soft} /><path d="M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" /></>,
  map: <><path d="M3.5 6l5.5-2.5 6 2.5 5.5-2.5v14.5L15 20.5 9 18l-5.5 2.5z" {...soft} /><path d="M3.5 6l5.5-2.5 6 2.5 5.5-2.5v14.5L15 20.5 9 18l-5.5 2.5zM9 3.5V18M15 6v14.5" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="currentColor" fillOpacity={0.35} /><path d="M15.5 8.5l-2 5-5 2 2-5zM12 2v2M12 20v2M2 12h2M20 12h2" /></>,
  torii: <><path d="M3 5.5c4 1 14 1 18 0l-.8 2.5H3.8z" fill="currentColor" /><path d="M5 10.5h14M7 8v13M17 8v13M12 8v2.5" /></>,
  user: <><circle cx="12" cy="8" r="4" {...soft} /><circle cx="12" cy="8" r="4" /><path d="M4 21c.7-4 4-6.5 8-6.5s7.3 2.5 8 6.5" /></>,
  users: <><circle cx="9" cy="8.5" r="3.5" /><path d="M2.5 20c.6-3.5 3.3-5.5 6.5-5.5s5.9 2 6.5 5.5M15 5.2a3.5 3.5 0 0 1 0 6.6M17.5 14.8c2.2.6 3.6 2.4 4 5.2" /></>,
  gamepad: <><path d="M7 7.5h10a4.5 4.5 0 0 1 4.4 5.5l-1 4.4a2.3 2.3 0 0 1-4 1L14.5 16h-5l-1.9 2.4a2.3 2.3 0 0 1-4-1l-1-4.4A4.5 4.5 0 0 1 7 7.5z" {...soft} /><path d="M7 7.5h10a4.5 4.5 0 0 1 4.4 5.5l-1 4.4a2.3 2.3 0 0 1-4 1L14.5 16h-5l-1.9 2.4a2.3 2.3 0 0 1-4-1l-1-4.4A4.5 4.5 0 0 1 7 7.5zM8 10.5v3M6.5 12h3" /><circle cx="15.5" cy="11" r="1" fill="currentColor" /><circle cx="17.5" cy="13" r="1" fill="currentColor" /></>,
  swords: <path d="M4 4l9.5 9.5M4 4v3.5L13 16.5M4 4h3.5l9 9M20 4l-9.5 9.5M20 4v3.5L11 16.5M20 4h-3.5l-9 9M6 15.5l2.5 2.5M3.5 18l2.5 2.5M18 15.5L15.5 18M20.5 18L18 20.5" />,
  sword: <path d="M19.5 4.5l-10 10M19.5 4.5V8l-9 9M19.5 4.5H16l-9 9M6 13.5l4.5 4.5M3.5 20.5L7 17" />,
  mask: <><path d="M4 5.5c5-2 11-2 16 0 0 6-2.5 13-8 15-5.5-2-8-9-8-15z" {...soft} /><path d="M4 5.5c5-2 11-2 16 0 0 6-2.5 13-8 15-5.5-2-8-9-8-15zM7.5 10l3 1.2M16.5 10l-3 1.2M9.5 16c1.5-1 3.5-1 5 0" /></>,
  spiral: <path d="M12 12a1.5 1.5 0 1 1 1.5-1.5A3.5 3.5 0 1 1 8.5 12 5.5 5.5 0 1 1 17.5 10a7.5 7.5 0 1 1-12.5 5" />,
  door: <><path d="M5.5 21V5.5a7 7 0 0 1 13 0V21" {...soft} /><path d="M5.5 21V5.5a7 7 0 0 1 13 0V21M3.5 21h17M12 3v18M10 13v1.5M14 13v1.5" /></>,
  palette: <><path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.5 0 1.8-1.2 1.2-2.2-.7-1.2 0-2.6 1.5-2.6h2.2a3.6 3.6 0 0 0 3.6-3.7c0-4.8-3.8-8.5-8.5-8.5z" {...soft} /><path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.5 0 1.8-1.2 1.2-2.2-.7-1.2 0-2.6 1.5-2.6h2.2a3.6 3.6 0 0 0 3.6-3.7c0-4.8-3.8-8.5-8.5-8.5z" /><circle cx="7.5" cy="11" r="1.2" fill="currentColor" /><circle cx="10" cy="7.3" r="1.2" fill="currentColor" /><circle cx="14.5" cy="7.3" r="1.2" fill="currentColor" /></>,
  ribbon: <><path d="M12 11L5 6.5v9zM12 11l7-4.5v9z" {...soft} /><path d="M12 11L5 6.5v9zM12 11l7-4.5v9zM10.5 11l-2 9.5M13.5 11l2 9.5" /><circle cx="12" cy="11" r="1.8" fill="currentColor" /></>,
  dango: <><path d="M12 2.5v19" /><circle cx="12" cy="6.5" r="3" fill="#f3a5bd" /><circle cx="12" cy="11.8" r="3" fill="#fbf6ec" /><circle cx="12" cy="17" r="3" fill="#a9d68a" /><circle cx="12" cy="6.5" r="3" /><circle cx="12" cy="11.8" r="3" /><circle cx="12" cy="17" r="3" /></>,
  sakura: <>{[0, 72, 144, 216, 288].map((a) => <path key={a} d="M12 12C9.5 9.5 9.6 6 11.2 4.4l.8 1.2.8-1.2c1.6 1.6 1.7 5.1-.8 7.6z" fill="currentColor" fillOpacity={0.28} transform={`rotate(${a} 12 12)`} />)}<circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /></>,
  // the three-comma mitsudomoe of the Raiden Shogun
  tomoe: <><circle cx="12" cy="12" r="9" />{[0, 120, 240].map((a) => <path key={a} d="M12 6.5a2.6 2.6 0 1 1-.1 5.2c-2.5 0-4.4 1.6-5 3.8-.9-4.4 1.6-9 5.1-9z" fill="currentColor" transform={`rotate(${a} 12 12)`} />)}</>,

  // ── elements (stylised after the Teyvat element sigils)
  anemo: <><path d="M4 9.5c3.5-4.5 10-5 13 0-3-2-7-1.3-8.5 1.5M20 14.5c-3.5 4.5-10 5-13 0 3 2 7 1.3 8.5-1.5" /><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" /><path d="M6 15.5c-1.4 1.2-1.8 2.7-1.4 4M18 8.5c1.4-1.2 1.8-2.7 1.4-4" /></>,
  geo: <><path d="M12 2.5l8.5 5v9L12 21.5l-8.5-5v-9z" fill="currentColor" fillOpacity={0.25} /><path d="M12 2.5l8.5 5v9L12 21.5l-8.5-5v-9zM12 2.5v19M3.5 7.5l17 9M20.5 7.5l-17 9" /></>,
  electro: <><circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity={0.18} /><path d="M7.5 5.5c4 .5 6.5 2.5 6.5 6.5M16.5 18.5c-4-.5-6.5-2.5-6.5-6.5M18.5 7.5c-.5 4-2.5 6.5-6.5 6.5M5.5 16.5c.5-4 2.5-6.5 6.5-6.5" /><circle cx="12" cy="12" r="1.8" fill="currentColor" /></>,
  dendro: <><path d="M12 21c-5-2.5-7.5-7-6.5-13 3.5 0 5.6 1.5 6.5 3.5.9-2 3-3.5 6.5-3.5 1 6-1.5 10.5-6.5 13z" fill="currentColor" fillOpacity={0.25} /><path d="M12 21c-5-2.5-7.5-7-6.5-13 3.5 0 5.6 1.5 6.5 3.5.9-2 3-3.5 6.5-3.5 1 6-1.5 10.5-6.5 13zM12 11.5V21M12 3v4" /></>,
  hydro: <><path d="M12 2.5c4 5 6.5 8.6 6.5 12a6.5 6.5 0 0 1-13 0c0-3.4 2.5-7 6.5-12z" fill="currentColor" fillOpacity={0.25} /><path d="M12 2.5c4 5 6.5 8.6 6.5 12a6.5 6.5 0 0 1-13 0c0-3.4 2.5-7 6.5-12zM8.5 15c1.5-1.4 2.5-1.4 3.5 0s2 1.4 3.5 0" /></>,
  pyro: <><path d="M12 21.5c-4 0-6.8-2.8-6.8-6.5 0-4.6 4-6.6 5-12 2.5 2.5 1.8 5.5 1.8 5.5S14 7 14 4.5c3 2.5 4.8 6 4.8 10.2 0 4-2.8 6.8-6.8 6.8z" fill="currentColor" fillOpacity={0.25} /><path d="M12 21.5c-4 0-6.8-2.8-6.8-6.5 0-4.6 4-6.6 5-12 2.5 2.5 1.8 5.5 1.8 5.5S14 7 14 4.5c3 2.5 4.8 6 4.8 10.2 0 4-2.8 6.8-6.8 6.8z" /><path d="M12 21.5a3 3 0 0 1-3-3c0-2 2-2.8 2.6-4.8 1.6 1.4 3.4 2.6 3.4 4.8a3 3 0 0 1-3 3z" fill="currentColor" stroke="none" /></>,
  cryo: <><path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6" /><path d="M12 7.5l2 2.5-2 2.5-2-2.5zM12 11.5l2 2.5-2 2.5-2-2.5z" fill="currentColor" stroke="none" /><path d="M9.5 3.8L12 5.6l2.5-1.8M9.5 20.2L12 18.4l2.5 1.8" /></>,
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof ICONS

export function Icon({ name, size, className = 'h-5 w-5', title, ...rest }: { name: IconName; size?: number; title?: string } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      className={`inline-block shrink-0 align-[-0.2em] ${className}`} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title} {...rest}>
      {ICONS[name]}
    </svg>
  )
}

/** A row of hearts for lives: full ones, then empty ones up to `max`. */
export function Hearts({ lives, max }: { lives: number; max?: number }) {
  const n = Math.max(0, lives)
  return (
    <span className="inline-flex items-center gap-0.5 text-wrong" aria-label={`${n} nyawa`}>
      {Array.from({ length: n }, (_, i) => <Icon key={i} name="heart" className="h-5 w-5" />)}
      {max !== undefined && Array.from({ length: Math.max(0, max - n) }, (_, i) => <Icon key={`e${i}`} name="heartEmpty" className="h-5 w-5 opacity-40" />)}
    </span>
  )
}
