// Knowgram – Illustrationen: pro Thema ein einfaches, flaches Motiv (weiß, halbtransparent), das auf dem Themenfarbverlauf sitzt.
// Ansicht 100×100 (Karten werden „slice“-skaliert, sichtbar ist vor allem die Mitte) → Motiv um (50, 28), höchstens ±19 Einheiten.
(() => {
  const A = "fill='white' fill-opacity='.92'", B = "fill='white' fill-opacity='.5'", D = "fill='black' fill-opacity='.45'";
  const S = "fill='none' stroke='white' stroke-opacity='.92' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'";
  const gear = (cx, cy, r, teeth) => {
    let t = ""; for (let i = 0; i < teeth; i++) t += `<rect x='${cx - 1.6}' y='${cy - r - 3}' width='3.2' height='4.6' rx='.8' transform='rotate(${(360 / teeth) * i} ${cx} ${cy})' ${A}/>`;
    return `${t}<circle cx='${cx}' cy='${cy}' r='${r}' ${S}/><circle cx='${cx}' cy='${cy}' r='${r * 0.32}' ${A}/>`;
  };
  window.ART = {
    physik: `<g transform='translate(50 28)'><ellipse rx='19' ry='7' ${S}/><ellipse rx='19' ry='7' transform='rotate(60)' ${S}/><ellipse rx='19' ry='7' transform='rotate(120)' ${S}/><circle r='3.6' ${A}/><circle cx='19' r='1.9' ${A}/><circle cx='-9.5' cy='16.4' r='1.9' ${A}/><circle cx='-9.5' cy='-16.4' r='1.9' ${A}/></g>`,
    geschichte: `<polygon points='31,20 50,9 69,20' ${B}/><rect x='31' y='20' width='38' height='2.4' ${A}/>${[35, 42.5, 50, 57.5, 65].map((x) => `<rect x='${x - 2}' y='23' width='4' height='17' ${A}/>`).join("")}<rect x='29' y='40.5' width='42' height='3' ${B}/><rect x='27' y='43.5' width='46' height='2.4' ${A}/>`,
    kosmologie: `<circle cx='50' cy='28' r='10' ${B}/><ellipse cx='50' cy='28' rx='21' ry='5.2' transform='rotate(-20 50 28)' ${S}/><circle cx='34' cy='13' r='1.3' ${A}/><circle cx='68' cy='40' r='1.5' ${A}/><circle cx='63' cy='12' r='1' ${A}/><circle cx='36' cy='42' r='1' ${A}/><circle cx='70' cy='24' r='.9' ${A}/>`,
    philosophie: `<ellipse cx='50' cy='30' rx='13.5' ry='15.5' ${B}/><polygon points='38,17 43,22 37,24' ${B}/><polygon points='62,17 57,22 63,24' ${B}/><circle cx='44' cy='26' r='5.4' ${A}/><circle cx='56' cy='26' r='5.4' ${A}/><circle cx='44' cy='26' r='2.2' ${D}/><circle cx='56' cy='26' r='2.2' ${D}/><polygon points='47.5,30 52.5,30 50,35' ${A}/><path d='M42 40 Q50 45 58 40' ${S}/>`,
    kunst: `<ellipse cx='50' cy='28' rx='20' ry='15' ${B}/><circle cx='40' cy='23' r='3.3' ${A}/><circle cx='49' cy='18.5' r='3.3' ${A}/><circle cx='59' cy='21' r='3.3' ${A}/><circle cx='62' cy='30' r='3.3' ${A}/><circle cx='46' cy='34' r='4' ${D}/><path d='M58 44 L72 16' ${S} stroke-width='2.6'/>`,
    it: `<path d='M40 18 L29 28 L40 38' ${S} stroke-width='2.6'/><path d='M60 18 L71 28 L60 38' ${S} stroke-width='2.6'/><path d='M54 15 L46 41' ${S} stroke-width='2.6'/>`,
    politik: `<path d='M32 38 A18 18 0 0 1 68 38 Z' ${B}/><rect x='30' y='38' width='40' height='4' ${A}/><line x1='50' y1='9' x2='50' y2='19' ${S}/><polygon points='50,9 58,12 50,15' ${A}/>${[38, 46, 54, 62].map((x) => `<rect x='${x - 1.3}' y='27' width='2.6' height='10' ${A}/>`).join("")}`,
    technik: `${gear(46, 28, 10.5, 8)}${gear(65, 41, 5.5, 6)}`,
    medizin: `<path d='M50 42 C29 29 34 14 44 16.5 C48 17.5 50 21 50 21 C50 21 52 17.5 56 16.5 C66 14 71 29 50 42 Z' ${B}/><path d='M30 29 L41 29 L45 20 L52 37 L56 27 L70 27' ${S} stroke-width='2'/>`,
    biologie: `<path d='M50 43 C33 35 33 16 50 10 C67 16 67 35 50 43 Z' ${B}/><path d='M50 43 L50 14' ${S}/><path d='M50 22 L42 17 M50 28 L40 23 M50 34 L41 30 M50 22 L58 17 M50 28 L60 23 M50 34 L59 30' ${S} stroke-width='1.2'/>`,
    zoologie: `<ellipse cx='50' cy='34' rx='10' ry='7.6' ${A}/><ellipse cx='37' cy='25' rx='4' ry='5' transform='rotate(-25 37 25)' ${A}/><ellipse cx='45' cy='18' rx='4' ry='5.4' ${A}/><ellipse cx='55' cy='18' rx='4' ry='5.4' ${A}/><ellipse cx='63' cy='25' rx='4' ry='5' transform='rotate(25 63 25)' ${A}/>`,
    wirtschaft: `<rect x='33' y='33' width='8' height='9' ${A}/><rect x='44' y='27' width='8' height='15' ${A}/><rect x='55' y='19' width='8' height='23' ${A}/><path d='M31 28 L43 21 L51 25 L68 11' ${S} stroke-width='2'/><polygon points='68,11 61,11.5 67.5,17.5' ${A}/>`,
    welt: `<circle cx='50' cy='28' r='16' ${S}/><ellipse cx='50' cy='28' rx='7' ry='16' ${S}/><ellipse cx='50' cy='28' rx='16' ry='5.5' ${S}/><line x1='34' y1='28' x2='66' y2='28' ${S}/><line x1='50' y1='12' x2='50' y2='44' ${S}/>`,
    psychologie: `<circle cx='43' cy='27' r='11' ${B}/><circle cx='57' cy='27' r='11' ${B}/><path d='M50 17 L50 39' ${S}/><path d='M38 24 Q43 21 46 26 M62 24 Q57 21 54 26 M39 32 Q44 34 46 30 M61 32 Q56 34 54 30' ${S} stroke-width='1.3'/>`,
    sprache: `<rect x='30' y='12' width='28' height='17' rx='6' ${B}/><polygon points='36,29 40,29 35,35' ${B}/><rect x='42' y='26' width='28' height='17' rx='6' ${A}/><polygon points='64,43 60,43 65,49' ${A}/><circle cx='50' cy='34.5' r='1.5' ${D}/><circle cx='56' cy='34.5' r='1.5' ${D}/><circle cx='62' cy='34.5' r='1.5' ${D}/>`,
    mathe: `<text x='50' y='39' font-size='34' font-family='Georgia,serif' text-anchor='middle' ${A}>π</text>`,
    chemie: `<path d='M44 10 L44 22 L31 40 Q29 45 34 45 L66 45 Q71 45 69 40 L56 22 L56 10 Z' ${S}/><path d='M37 35 L63 35 L68 42 Q69 44 66 44 L34 44 Q31 44 32 42 Z' ${B}/><circle cx='46' cy='30' r='1.8' ${A}/><circle cx='53' cy='26' r='1.3' ${A}/><circle cx='50' cy='19' r='1.2' ${A}/>`,
    klima: `<circle cx='42' cy='22' r='8' ${A}/><path d='M42 9 V6 M42 35 V38 M29 22 H26 M55 22 H58 M32 12 L30 10 M52 12 L54 10 M32 32 L30 34' ${S}/><path d='M40 44 a8 8 0 0 1 2 -15.5 a10.5 10.5 0 0 1 20 3.2 a6.5 6.5 0 0 1 -1 12.3 Z' ${B}/>`,
    raumfahrt: `<path d='M50 7 C59 16 59 30 57 39 L43 39 C41 30 41 16 50 7 Z' ${A}/><circle cx='50' cy='21' r='4' ${D}/><polygon points='43,31 34,42 43,39' ${B}/><polygon points='57,31 66,42 57,39' ${B}/><polygon points='45.5,41 50,50 54.5,41' ${B}/>`,
    nfl: `<g transform='rotate(-28 50 28)'><ellipse cx='50' cy='28' rx='20' ry='11.5' ${A}/><path d='M40 28 H60 M44 24 V32 M50 23.5 V32.5 M56 24 V32' fill='none' stroke='black' stroke-opacity='.45' stroke-width='1.4' stroke-linecap='round'/></g>`,
    sw: `<text x='50' y='38' font-size='30' font-family='Menlo,Consolas,monospace' font-weight='700' text-anchor='middle' ${A}>{ }</text>`,
    db: `<path d='M35 15 V39 A15 5.5 0 0 0 65 39 V15' ${B}/><ellipse cx='50' cy='15' rx='15' ry='5.5' ${A}/><path d='M35 24 A15 5.5 0 0 0 65 24 M35 32 A15 5.5 0 0 0 65 32' ${S} stroke-width='1.2'/>`,
    sc: `<path d='M41 26 V20 A9 9 0 0 1 59 20 V26' ${S} stroke-width='3'/><rect x='36' y='26' width='28' height='18' rx='3.5' ${A}/><circle cx='50' cy='33.5' r='2.6' ${D}/><rect x='48.7' y='34' width='2.6' height='6' rx='1' ${D}/>`,
    cd: `<path d='M36 42 a9 9 0 0 1 2 -17 a12 12 0 0 1 23 3.5 a7.5 7.5 0 0 1 -1 13.5 Z' ${B}/><path d='M44 36 V28 M44 28 l-3 3 M44 28 l3 3 M56 28 V36 M56 36 l-3 -3 M56 36 l3 -3' ${S} stroke-width='1.6'/>`,
    ki: `<rect x='36' y='17' width='28' height='24' rx='6' ${B}/><circle cx='44' cy='27' r='3.6' ${A}/><circle cx='56' cy='27' r='3.6' ${A}/><rect x='43' y='34' width='14' height='2.6' rx='1.3' ${A}/><line x1='50' y1='17' x2='50' y2='10' ${S}/><circle cx='50' cy='9' r='2' ${A}/><rect x='31' y='24' width='4' height='9' rx='1.5' ${A}/><rect x='65' y='24' width='4' height='9' rx='1.5' ${A}/>`,
    bf: `<path d='M43 21 V16 H57 V21' ${S} stroke-width='2.4'/><rect x='33' y='21' width='34' height='21' rx='3.5' ${A}/><path d='M33 30 H67' stroke='black' stroke-opacity='.4' stroke-width='1.4'/><rect x='47' y='28' width='6' height='5' rx='1' ${D}/>`,
    ar: `<path d='M44 9 H56 Q56 15 60 21 Q66 32 57 43 H43 Q34 32 40 21 Q44 15 44 9 Z' ${B}/><path d='M40 21 Q30 21 33 31 Q35 34 40 31 M60 21 Q70 21 67 31 Q65 34 60 31' ${S}/><path d='M42 25 H58 M41 31 H59' ${S} stroke-width='1.3'/>`,
    wissenschaft: `<circle cx='45' cy='25' r='12' ${S} stroke-width='2.6'/><path d='M54 34 L68 46' ${S} stroke-width='4'/><path d='M39 25 Q45 18 51 25' ${S} stroke-width='1.3'/>`,
    _default: `<polygon points='50,10 55,23 69,23 58,31 62,45 50,37 38,45 42,31 31,23 45,23' ${B}/>`
  };
})();
