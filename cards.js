// Knowgram – Karten. Felder: id, topic, title, text, q (Suchbegriff für Vertiefung)
// refs = verlässliche Anlaufstellen zum Gegenprüfen (Startseiten der Institutionen)
window.TOPICS = {
  geschichte: { name: "Geschichte", emoji: "🏛️", c: "#b5651d", refs: [["Bundeszentrale für politische Bildung", "https://www.bpb.de"], ["Deutsches Historisches Museum", "https://www.dhm.de"], ["Wikipedia (Einstieg mit Belegen)", "https://de.wikipedia.org"]] },
  physik: { name: "Physik", emoji: "⚛️", c: "#2563eb", refs: [["CERN", "https://home.cern"], ["Max-Planck-Gesellschaft", "https://www.mpg.de"], ["Spektrum der Wissenschaft", "https://www.spektrum.de"]] },
  kosmologie: { name: "Kosmologie", emoji: "🌌", c: "#6d28d9", refs: [["ESA", "https://www.esa.int"], ["NASA", "https://www.nasa.gov"], ["Spektrum der Wissenschaft", "https://www.spektrum.de"]] },
  philosophie: { name: "Philosophie", emoji: "🦉", c: "#0f766e", refs: [["Stanford Encyclopedia of Philosophy", "https://plato.stanford.edu"], ["Internet Encyclopedia of Philosophy", "https://iep.utm.edu"]] },
  kunst: { name: "Kunst", emoji: "🎨", c: "#db2777", refs: [["Met – Timeline of Art History", "https://www.metmuseum.org/toah"], ["Städel Museum", "https://www.staedelmuseum.de"], ["Wikipedia (Einstieg mit Belegen)", "https://de.wikipedia.org"]] },
  it: { name: "IT", emoji: "💻", c: "#0891b2", refs: [["heise online", "https://www.heise.de"], ["BSI (IT-Sicherheit)", "https://www.bsi.bund.de"], ["Computer History Museum", "https://computerhistory.org"]] },
  politik: { name: "Politik", emoji: "🗳️", c: "#b91c1c", refs: [["Bundeszentrale für politische Bildung", "https://www.bpb.de"], ["Deutscher Bundestag", "https://www.bundestag.de"], ["Bundesverfassungsgericht", "https://www.bundesverfassungsgericht.de"], ["Vereinte Nationen", "https://www.un.org/de"]] },
  technik: { name: "Technik", emoji: "⚙️", c: "#ca8a04", refs: [["Deutsches Museum", "https://www.deutsches-museum.de"], ["Fraunhofer-Gesellschaft", "https://www.fraunhofer.de"], ["Nobelprize.org", "https://www.nobelprize.org"]] },
  medizin: { name: "Medizin", emoji: "🩺", c: "#dc2626", refs: [["Robert Koch-Institut", "https://www.rki.de"], ["WHO", "https://www.who.int"], ["Cochrane Deutschland", "https://www.cochrane.de"], ["gesund.bund.de", "https://gesund.bund.de"]] },
  biologie: { name: "Biologie", emoji: "🧬", c: "#16a34a", refs: [["Nobelprize.org", "https://www.nobelprize.org"], ["Nature", "https://www.nature.com"], ["Max-Planck-Gesellschaft", "https://www.mpg.de"]] },
  zoologie: { name: "Zoologie", emoji: "🐙", c: "#ea580c", refs: [["Senckenberg (Frankfurt)", "https://www.senckenberg.de"], ["IUCN Rote Liste", "https://www.iucnredlist.org"], ["Spektrum der Wissenschaft", "https://www.spektrum.de"]] },
  wirtschaft: { name: "Wirtschaft", emoji: "📈", c: "#0d9488", refs: [["Europäische Zentralbank", "https://www.ecb.europa.eu"], ["Deutsche Bundesbank", "https://www.bundesbank.de"], ["Statistisches Bundesamt", "https://www.destatis.de"]] },
  welt: { name: "Weltgeschehen", emoji: "🌍", c: "#1d4ed8", refs: [["Bundeszentrale für politische Bildung", "https://www.bpb.de"], ["Vereinte Nationen", "https://www.un.org/de"], ["Auswärtiges Amt", "https://www.auswaertiges-amt.de"]] },
  psychologie: { name: "Psychologie", emoji: "🧠", c: "#a21caf", refs: [["American Psychological Association", "https://www.apa.org"], ["Spektrum der Wissenschaft", "https://www.spektrum.de"]] },
  sprache: { name: "Sprache", emoji: "🗣️", c: "#c2410c", refs: [["Duden", "https://www.duden.de"], ["DWDS", "https://www.dwds.de"], ["Leibniz-Institut für Deutsche Sprache", "https://www.ids-mannheim.de"]] },
  mathe: { name: "Mathematik", emoji: "➗", c: "#4f46e5", refs: [["MathWorld", "https://mathworld.wolfram.com"], ["Spektrum der Wissenschaft", "https://www.spektrum.de"]] },
  chemie: { name: "Chemie", emoji: "🧪", c: "#65a30d", refs: [["PubChem", "https://pubchem.ncbi.nlm.nih.gov"], ["Nobelprize.org", "https://www.nobelprize.org"], ["Gesellschaft Deutscher Chemiker", "https://www.gdch.de"]] },
  klima: { name: "Erde & Klima", emoji: "🌦️", c: "#0e7490", refs: [["IPCC", "https://www.ipcc.ch"], ["Deutscher Wetterdienst", "https://www.dwd.de"], ["Umweltbundesamt", "https://www.umweltbundesamt.de"], ["Copernicus Klimadienst", "https://climate.copernicus.eu"]] },
  raumfahrt: { name: "Raumfahrt", emoji: "🚀", c: "#7c3aed", refs: [["ESA", "https://www.esa.int"], ["NASA", "https://www.nasa.gov"], ["DLR", "https://www.dlr.de"]] },
  nfl: { name: "NFL", emoji: "🏈", c: "#15803d", refs: [["NFL.com", "https://www.nfl.com"], ["Pro Football Reference", "https://www.pro-football-reference.com"]] },
  sw: { name: "Softwareentwicklung", emoji: "🛠️", c: "#0ea5e9", refs: [["Martin Fowler", "https://martinfowler.com"], ["Refactoring Guru (Entwurfsmuster)", "https://refactoring.guru"], ["Scrum Guide", "https://scrumguides.org"]] },
  db: { name: "Datenbanken & Daten", emoji: "🗄️", c: "#0f9d8a", refs: [["PostgreSQL-Dokumentation", "https://www.postgresql.org/docs"], ["Snowflake-Dokumentation", "https://docs.snowflake.com"], ["Use The Index, Luke", "https://use-the-index-luke.com"]] },
  sc: { name: "IT-Sicherheit & Netze", emoji: "🔐", c: "#be123c", refs: [["BSI", "https://www.bsi.bund.de"], ["Center for Internet Security", "https://www.cisecurity.org"], ["OWASP", "https://owasp.org"]] },
  cd: { name: "Cloud & Architektur", emoji: "☁️", c: "#3b82f6", refs: [["Martin Fowler", "https://martinfowler.com"], ["The Twelve-Factor App", "https://12factor.net"], ["Azure Architecture Center", "https://learn.microsoft.com/azure/architecture"]] },
  ki: { name: "KI & Tools", emoji: "🤖", c: "#9333ea", refs: [["Anthropic News", "https://www.anthropic.com/news"], ["Stanford HAI", "https://hai.stanford.edu"], ["EU AI Act – Übersicht", "https://artificialintelligenceact.eu"]] },
  bf: { name: "Beruf & Alltag", emoji: "💼", c: "#d97706", refs: [["Gesetze im Internet", "https://www.gesetze-im-internet.de"], ["Bundesbeauftragte für den Datenschutz", "https://www.bfdi.bund.de"], ["Choose a License", "https://choosealicense.com"]] },
  // Nur für Nachrichten
  wissenschaft: { name: "Wissenschaft aktuell", emoji: "🔬", c: "#0369a1", refs: [["Spektrum der Wissenschaft", "https://www.spektrum.de"], ["Tagesschau Wissen", "https://www.tagesschau.de/wissen"]] }
};

window.CARDS = [
  // Geschichte
  { id: "ge1", topic: "geschichte", title: "Der Frieden, der Staaten erfand", q: "Westfälischer Friede 1648",
    text: "1648 beendeten die Verträge von Münster und Osnabrück den Dreißigjährigen Krieg. Sie gelten als Geburtsstunde des Prinzips souveräner Staaten: Jeder Herrscher bestimmt im eigenen Gebiet, andere mischen sich nicht ein. Die Grundidee prägt das Völkerrecht bis heute." },
  { id: "ge2", topic: "geschichte", title: "Ein Stein, der Hieroglyphen knackte", q: "Stein von Rosette Champollion",
    text: "Der Stein von Rosette, 1799 von französischen Soldaten in Ägypten gefunden, trägt denselben Text in drei Schriften: Hieroglyphen, Demotisch und Altgriechisch. Weil man Griechisch lesen konnte, gelang Jean-François Champollion 1822 die Entzifferung der Hieroglyphen." },
  { id: "ge3", topic: "geschichte", title: "Der Schwarze Tod", q: "Pest 1347 Schwarzer Tod Europa",
    text: "Zwischen 1347 und 1353 raffte die Pest in Europa nach heutigen Schätzungen ein Drittel bis die Hälfte der Bevölkerung dahin. Sie kam wohl über Handelsschiffe aus dem Schwarzmeerraum nach Sizilien. Die Folgen: Arbeitskräftemangel, steigende Löhne und ein tiefer Wandel der Gesellschaft." },

  // Physik
  { id: "ph1", topic: "physik", title: "Ein Teilchen, zwei Spalten, ein Rätsel", q: "Doppelspaltexperiment",
    text: "Schickt man Elektronen einzeln durch einen Doppelspalt, entsteht nach und nach ein Interferenzmuster – als wäre jedes Elektron gleichzeitig durch beide Spalte gegangen. Misst man, welchen Spalt es nimmt, verschwindet das Muster. Das Experiment zeigt den Welle-Teilchen-Dualismus." },
  { id: "ph2", topic: "physik", title: "Ohne Relativitätstheorie kein GPS", q: "GPS Relativitätstheorie Zeitdilatation",
    text: "Die Uhren in GPS-Satelliten gehen im Vergleich zu Uhren am Boden etwa 38 Mikrosekunden pro Tag vor: Die schwächere Gravitation beschleunigt sie, die hohe Geschwindigkeit bremst sie ein wenig. Ohne Korrektur wüchse der Ortungsfehler um rund zehn Kilometer pro Tag." },
  { id: "ph3", topic: "physik", title: "Warum Kaffee nie von selbst heiß wird", q: "Entropie Zweiter Hauptsatz der Thermodynamik",
    text: "Der Zweite Hauptsatz der Thermodynamik besagt, dass die Entropie in einem abgeschlossenen System nicht abnimmt. Es ist eine statistische Aussage: Es gibt unvorstellbar viele ungeordnete Zustände und nur wenige geordnete. Deshalb kühlt Kaffee ab, aber wird nie von selbst wieder heiß." },

  // Kosmologie
  { id: "ko1", topic: "kosmologie", title: "Das Nachglühen des Urknalls", q: "Kosmische Hintergrundstrahlung Penzias Wilson",
    text: "1965 empfingen Arno Penzias und Robert Wilson bei Tests einer Antenne ein hartnäckiges Rauschen aus allen Richtungen. Es war die kosmische Hintergrundstrahlung: Licht aus der Zeit etwa 380.000 Jahre nach dem Urknall, heute nur noch 2,7 Kelvin kalt. Dafür gab es 1978 den Nobelpreis." },
  { id: "ko2", topic: "kosmologie", title: "Größer als sein Alter", q: "Beobachtbares Universum Größe",
    text: "Das Universum ist rund 13,8 Milliarden Jahre alt, doch das beobachtbare Universum hat einen Radius von etwa 46 Milliarden Lichtjahren. Kein Widerspruch: Der Raum selbst dehnt sich aus, während das Licht unterwegs ist. Die Quellen sind heute viel weiter weg, als ihr Licht alt ist." },
  { id: "ko3", topic: "kosmologie", title: "95 Prozent Unbekanntes", q: "Dunkle Materie Dunkle Energie Anteil",
    text: "Gewöhnliche Materie, aus der Sterne, Planeten und wir bestehen, macht nur rund 5 Prozent des Universums aus. Etwa 27 Prozent sind Dunkle Materie und rund 68 Prozent Dunkle Energie. Was beide sind, weiß bis heute niemand." },

  // Philosophie
  { id: "pl1", topic: "philosophie", title: "Das Schiff des Theseus", q: "Schiff des Theseus Identität",
    text: "Ein Schiff wird über Jahre Brett für Brett ersetzt, bis kein Originalteil mehr übrig ist. Ist es noch dasselbe Schiff? Und was, wenn jemand die alten Bretter aufhebt und daraus ein zweites baut? Das Paradox, überliefert von Plutarch, fragt nach dem Wesen von Identität." },
  { id: "pl2", topic: "philosophie", title: "Schatten an der Höhlenwand", q: "Höhlengleichnis Platon",
    text: "In Platons Höhlengleichnis sitzen Gefangene gefesselt und halten Schatten an der Wand für die ganze Wirklichkeit. Wer sich befreit und ins Licht tritt, wird zunächst geblendet und von den anderen nicht ernst genommen. Das Bild steht für den mühsamen Weg zur Erkenntnis." },
  { id: "pl3", topic: "philosophie", title: "Das Chinesische Zimmer", q: "Chinesisches Zimmer Searle",
    text: "John Searle stellte sich 1980 vor: Eine Person, die kein Chinesisch versteht, folgt in einem Raum einem Regelwerk und beantwortet chinesische Fragen perfekt. Verstanden hat sie nichts. Sein Argument: Reines Verarbeiten von Symbolen ist noch kein Verstehen – auch nicht bei Computern." },

  // Kunst
  { id: "ku1", topic: "kunst", title: "Wie die Tiefe ins Bild kam", q: "Zentralperspektive Brunelleschi Alberti",
    text: "Um 1415 führte Filippo Brunelleschi in Florenz vor, wie sich dreidimensionale Räume mathematisch korrekt auf eine Fläche abbilden lassen. Leon Battista Alberti beschrieb die Zentralperspektive 1435 schriftlich. Sie veränderte die europäische Malerei von Grund auf." },
  { id: "ku2", topic: "kunst", title: "Ein Schimpfwort wird Kunstrichtung", q: "Impressionismus Monet Impression Sonnenaufgang",
    text: "Der Name „Impressionismus\" entstand als Spott: Nach Monets Gemälde „Impression, Sonnenaufgang\" (1872) verriss der Kritiker Louis Leroy 1874 die Ausstellung als bloße flüchtige „Impressionen\". Die Künstler übernahmen den Begriff kurzerhand selbst." },
  { id: "ku3", topic: "kunst", title: "Bauhaus: Form folgt Funktion", q: "Bauhaus Walter Gropius",
    text: "1919 gründete Walter Gropius in Weimar das Bauhaus. Es verband Kunst, Handwerk und Industrie und prägte modernes Design, Architektur und Typografie. 1933 löste sich die Schule in Berlin unter dem Druck der Nationalsozialisten auf; ihre Lehrenden trugen die Ideen in die Welt." },

  // IT
  { id: "it1", topic: "it", title: "Der erste echte „Bug\"", q: "Grace Hopper Bug Harvard Mark II",
    text: "1947 fanden Ingenieure im Relais des Rechners Harvard Mark II eine Motte und klebten sie ins Logbuch: „First actual case of bug being found\". Das Wort „Bug\" für Fehler war schon älter, die Anekdote wurde durch Grace Hopper bekannt." },
  { id: "it2", topic: "it", title: "Das Jahr-2038-Problem", q: "Jahr-2038-Problem Unix-Zeit",
    text: "Unix-Systeme zählen die Sekunden seit dem 1. Januar 1970. Wird dieser Zähler als vorzeichenbehaftete 32-Bit-Zahl gespeichert, läuft er am 19. Januar 2038 über und springt zurück ins Jahr 1901. Moderne 64-Bit-Systeme sind davon nicht betroffen." },
  { id: "it3", topic: "it", title: "Passwörter dürfen nie im Klartext liegen", q: "Passwort Hash Salt",
    text: "Seriöse Dienste speichern nicht dein Passwort, sondern einen Hash: das Ergebnis einer Einwegfunktion. Ein zufälliger „Salt\" verhindert, dass gleiche Passwörter gleiche Hashes ergeben und vorberechnete Tabellen helfen. Deshalb kann ein Dienst dein altes Passwort auch nicht „nachschauen\"." },

  // Politik
  { id: "po1", topic: "politik", title: "Warum es die Fünf-Prozent-Hürde gibt", q: "Fünf-Prozent-Hürde Sperrklausel Bundestag",
    text: "Im Bundestag ziehen Parteien nur ein, wenn sie mindestens 5 Prozent der Zweitstimmen oder drei Direktmandate erreichen. Die Sperrklausel ist eine Lehre aus der Weimarer Republik, deren zersplittertes Parlament Regierungsbildung und Stabilität erschwerte." },
  { id: "po2", topic: "politik", title: "Fünf Mächte mit Vetorecht", q: "UN-Sicherheitsrat Veto ständige Mitglieder",
    text: "Der UN-Sicherheitsrat hat 15 Mitglieder. Fünf davon sind ständig und besitzen ein Vetorecht: USA, Russland, China, Frankreich und das Vereinigte Königreich. Ein einziges Nein genügt, um einen Beschluss zu blockieren. Die zehn übrigen Sitze werden für zwei Jahre gewählt." },
  { id: "po3", topic: "politik", title: "Politik vor deiner Haustür", q: "Kommunale Selbstverwaltung Art. 28 Grundgesetz",
    text: "Artikel 28 des Grundgesetzes garantiert den Gemeinden das Recht, alle Angelegenheiten der örtlichen Gemeinschaft in eigener Verantwortung zu regeln. Ob Kita-Plätze, Busfahrpläne oder Bebauungspläne: Vieles, was den Alltag prägt, entscheidet der Gemeinde- oder Stadtrat." },

  // Technik
  { id: "te1", topic: "technik", title: "Die Mikrowelle war ein Zufall", q: "Mikrowellenherd Percy Spencer",
    text: "1945 bemerkte der Ingenieur Percy Spencer, dass ein Schokoriegel in seiner Tasche schmolz, während er an einem Radargerät arbeitete. Mikrowellen von etwa 2,45 Gigahertz bringen Wassermoleküle zum Schwingen – die Reibung erzeugt Wärme direkt im Essen." },
  { id: "te2", topic: "technik", title: "Anti-Lärm durch Gegen-Lärm", q: "Aktive Geräuschunterdrückung",
    text: "Kopfhörer mit Noise-Cancelling messen Umgebungsschall mit Mikrofonen und erzeugen einen Gegenschall in Gegenphase. Beide Wellen löschen sich aus. Am besten funktioniert das bei gleichmäßigem, tiefem Lärm wie Triebwerken; plötzliche Geräusche bleiben hörbar." },
  { id: "te3", topic: "technik", title: "Wärmepumpe: Wärme umziehen statt erzeugen", q: "Wärmepumpe Funktionsweise Jahresarbeitszahl",
    text: "Eine Wärmepumpe verbrennt nichts, sie transportiert Wärme aus Luft, Erde oder Wasser ins Haus. Mit einem Kältemittelkreislauf hebt sie die Temperatur an. Aus einer Kilowattstunde Strom werden typischerweise drei bis vier Kilowattstunden Wärme." },

  // Medizin
  { id: "me1", topic: "medizin", title: "Der Schimmel, der Millionen rettete", q: "Penicillin Alexander Fleming",
    text: "1928 bemerkte Alexander Fleming, dass ein Schimmelpilz auf seiner Bakterienkultur die Bakterien in der Umgebung abtötete. Der Pilz Penicillium brachte das erste Antibiotikum hervor. Howard Florey und Ernst Chain machten es in den 1940ern nutzbar; alle drei erhielten 1945 den Nobelpreis." },
  { id: "me2", topic: "medizin", title: "Die Türsteherin des Gehirns", q: "Blut-Hirn-Schranke",
    text: "Die Blut-Hirn-Schranke besteht aus dicht verbundenen Zellen der Blutgefäße und lässt nur ausgewählte Stoffe ins Gehirn. Sie schützt vor Krankheitserregern und Giften, erschwert aber auch die Behandlung: Viele Medikamente kommen einfach nicht durch." },
  { id: "me3", topic: "medizin", title: "Placebo wirkt – auch ehrlich verabreicht", q: "Placebo-Effekt Open-Label-Placebo",
    text: "Scheinmedikamente können Beschwerden wie Schmerz oder Übelkeit lindern. Studien mit „Open-Label-Placebos\" deuten sogar darauf hin, dass ein Effekt auch bleibt, wenn Patienten wissen, dass es ein Placebo ist. Die Erwartung und der Kontext scheinen selbst Teil der Wirkung zu sein." },

  // Biologie
  { id: "bi1", topic: "biologie", title: "Kraftwerke mit eigener Vergangenheit", q: "Endosymbiontentheorie Mitochondrien Lynn Margulis",
    text: "Mitochondrien haben eigene DNA und vermehren sich selbst. Die Endosymbiontentheorie, populär gemacht von Lynn Margulis, erklärt das: Sie stammen von Bakterien ab, die vor über einer Milliarde Jahre von einer Urzelle aufgenommen wurden und blieben." },
  { id: "bi2", topic: "biologie", title: "CRISPR: Die Gen-Schere aus Bakterien", q: "CRISPR Cas9 Charpentier Doudna",
    text: "CRISPR ist ursprünglich ein Abwehrsystem von Bakterien gegen Viren: Es merkt sich Virus-DNA und schneidet sie bei erneutem Kontakt. Emmanuelle Charpentier und Jennifer Doudna machten daraus ein Werkzeug zum gezielten Umschreiben von Genen – Nobelpreis für Chemie 2020." },
  { id: "bi3", topic: "biologie", title: "Das „Wood Wide Web\"", q: "Mykorrhiza Wood Wide Web",
    text: "Pilzgeflechte, sogenannte Mykorrhiza, umhüllen Baumwurzeln und tauschen Nährstoffe gegen Zucker. Sie verbinden dabei viele Pflanzen miteinander. Wie stark Bäume darüber „kommunizieren\" oder einander helfen, ist unter Forschenden allerdings umstritten." },

  // Zoologie
  { id: "zo1", topic: "zoologie", title: "Der Krake mit dem verteilten Gehirn", q: "Kraken Nervensystem drei Herzen",
    text: "Kraken haben drei Herzen und blaues Blut auf Kupferbasis. Von ihren etwa 500 Millionen Nervenzellen sitzt rund zwei Drittel in den Armen, die teils eigenständig handeln. Ihr Gehirn ist ungewöhnlich verteilt aufgebaut – ganz anders als bei Wirbeltieren." },
  { id: "zo2", topic: "zoologie", title: "Bärtierchen: fast unzerstörbar", q: "Bärtierchen Tardigrada Kryptobiose",
    text: "Bärtierchen, kaum einen Millimeter groß, können in einen Starrezustand namens Kryptobiose fallen und Austrocknung, extreme Kälte und Strahlung überstehen. 2007 überlebten einige sogar mehrere Tage im offenen Weltraum – ein Experiment auf einem russischen Satelliten." },
  { id: "zo3", topic: "zoologie", title: "Elefanten hören mit den Füßen", q: "Elefanten Infraschall Kommunikation",
    text: "Elefanten verständigen sich mit Infraschall, so tief, dass Menschen ihn nicht hören. Diese Laute tragen mehrere Kilometer weit. Vermutlich nehmen die Tiere die Schwingungen auch über den Boden mit ihren Füßen wahr." },
  { id: "zo4", topic: "zoologie", title: "Axolotl: der Regenerations-Champion", q: "Axolotl Regeneration",
    text: "Der Axolotl kann verlorene Gliedmaßen, Teile des Herzens und sogar Teile des Gehirns komplett nachwachsen lassen, ohne Narben. Deshalb erforscht die Medizin ihn intensiv – in der Hoffnung, Mechanismen der Regeneration eines Tages auch beim Menschen anzustoßen." },

  // ---- Geschichte (+3)
  { id: "ge4", topic: "geschichte", title: "Gutenbergs Medienrevolution", q: "Johannes Gutenberg Buchdruck Mainz",
    text: "Um 1450 entwickelte Johannes Gutenberg in Mainz den Buchdruck mit beweglichen Metalllettern; die berühmte Bibel entstand um 1455. Bücher wurden billiger, Wissen und Ideen verbreiteten sich schneller – ein Motor für Reformation und Wissenschaft. Bewegliche Lettern gab es in Ostasien allerdings schon Jahrhunderte früher." },
  { id: "ge5", topic: "geschichte", title: "Auch Könige unterliegen dem Recht", q: "Magna Carta 1215",
    text: "1215 zwang der englische Adel König Johann Ohneland, die Magna Carta zu besiegeln. Sie schränkte die Willkür des Königs ein und legte den Grundsatz nieder, dass auch der Herrscher an das Recht gebunden ist. Viele Einzelregeln sind längst überholt, die Idee wirkt bis in moderne Verfassungen." },
  { id: "ge6", topic: "geschichte", title: "Ein Versprecher öffnet die Mauer", q: "Fall der Berliner Mauer 9. November 1989 Schabowski",
    text: "Am Abend des 9. November 1989 erklärte Günter Schabowski auf einer Pressekonferenz, die neue Reiseregelung gelte „sofort, unverzüglich“. Tausende zogen zu den Grenzübergängen, die Grenzer gaben nach. Die Berliner Mauer hatte seit dem 13. August 1961 gestanden." },

  // ---- Physik (+3)
  { id: "ph4", topic: "physik", title: "Die Lichtgeschwindigkeit ist per Definition exakt", q: "Lichtgeschwindigkeit 299792458 Meter Definition",
    text: "Licht bewegt sich im Vakuum mit genau 299.792.458 Metern pro Sekunde. Das ist keine Messung mehr, sondern Definition: Seit 1983 wird der Meter über die Strecke festgelegt, die Licht in 1/299.792.458 Sekunde zurücklegt. Die Sekunde legt fest, wie lang der Meter ist." },
  { id: "ph5", topic: "physik", title: "Higgs: Was Masse wirklich erklärt", q: "Higgs-Boson CERN 2012",
    text: "2012 wiesen die Experimente ATLAS und CMS am CERN das Higgs-Teilchen nach. Das zugehörige Feld verleiht Elementarteilchen wie Elektronen ihre Masse. Der Großteil der Masse alltäglicher Materie stammt dagegen aus der Bindungsenergie in Protonen und Neutronen. 2013 gab es den Nobelpreis für Englert und Higgs." },
  { id: "ph6", topic: "physik", title: "Wenn Strom keinen Widerstand kennt", q: "Supraleitung Kamerlingh Onnes",
    text: "1911 entdeckte Heike Kamerlingh Onnes, dass Quecksilber bei etwa 4,2 Kelvin seinen elektrischen Widerstand komplett verliert. Supraleiter erzeugen zudem den Meißner-Effekt: Sie verdrängen Magnetfelder. Genutzt wird das in MRT-Geräten und Teilchenbeschleunigern." },

  // ---- Kosmologie (+3)
  { id: "ko4", topic: "kosmologie", title: "Das erste Foto eines Schwarzen Lochs", q: "Event Horizon Telescope M87 Schwarzes Loch Foto",
    text: "2019 veröffentlichte das Event Horizon Telescope das erste Bild eines Schwarzen Lochs: das Zentrum der Galaxie M87, rund 55 Millionen Lichtjahre entfernt. 2022 folgte Sagittarius A*, das Schwarze Loch im Zentrum unserer Milchstraße. Zu sehen ist der Schatten vor glühendem Gas." },
  { id: "ko5", topic: "kosmologie", title: "Das Universum dehnt sich aus", q: "Hubble Lemaître Expansion des Universums",
    text: "Georges Lemaître (1927) und Edwin Hubble (1929) zeigten: Je weiter eine Galaxie entfernt ist, desto schneller entfernt sie sich von uns. Der Raum selbst dehnt sich aus. Das bildet die Grundlage der Urknall-Kosmologie; der genaue Wert der Expansionsrate ist bis heute umstritten." },
  { id: "ko6", topic: "kosmologie", title: "Fremde Sonnensysteme", q: "Exoplaneten 51 Pegasi b Mayor Queloz",
    text: "1995 entdeckten Michel Mayor und Didier Queloz mit 51 Pegasi b den ersten Planeten um einen sonnenähnlichen Stern (Nobelpreis 2019). Inzwischen sind über 6.000 Exoplaneten bestätigt (Stand 2025). Viele sind völlig anders als alles in unserem Sonnensystem." },

  // ---- Philosophie (+3)
  { id: "pl4", topic: "philosophie", title: "Das Trolley-Problem", q: "Trolley-Problem Philippa Foot",
    text: "Eine Bahn rast auf fünf Menschen zu. Du kannst eine Weiche umlegen, dann trifft sie einen einzigen. Tust du es? Philippa Foot stellte das Dilemma 1967 auf. Es zeigt den Konflikt zwischen Nutzen-Ethik (Leben zählen) und Pflicht-Ethik (aktiv töten ist etwas anderes als geschehen lassen)." },
  { id: "pl5", topic: "philosophie", title: "Kants Prüfstein für Moral", q: "Kategorischer Imperativ Kant",
    text: "Immanuel Kant formulierte 1785 den kategorischen Imperativ: „Handle nur nach derjenigen Maxime, durch die du zugleich wollen kannst, dass sie ein allgemeines Gesetz werde.“ Frage dich also: Was, wenn alle so handelten? Lügen scheitert daran: Wenn alle lügen, verliert Sprache ihren Sinn." },
  { id: "pl6", topic: "philosophie", title: "Ich denke, also bin ich", q: "Descartes Cogito ergo sum",
    text: "René Descartes zweifelte 1637 an allem, was er wahrnahm – selbst an der Außenwelt. Nur eines ließ sich nicht bezweifeln: dass er zweifelt und damit denkt. „Ich denke, also bin ich“ wurde zum sicheren Fundament seiner Philosophie und zum Startpunkt der Neuzeit." },

  // ---- Kunst (+3)
  { id: "ku4", topic: "kunst", title: "Der Diebstahl, der die Mona Lisa berühmt machte", q: "Mona Lisa Diebstahl 1911 Peruggia",
    text: "Leonardo da Vinci malte die Mona Lisa etwa zwischen 1503 und 1519. 1911 stahl sie der Handwerker Vincenzo Peruggia aus dem Louvre; erst 1913 tauchte sie in Florenz wieder auf. Die weltweite Berichterstattung machte das Bild endgültig zur berühmtesten Ikone der Kunst." },
  { id: "ku5", topic: "kunst", title: "Eine Bank für die Kunst: das Städel", q: "Städel Museum Frankfurt Johann Friedrich Städel",
    text: "Der Frankfurter Bankier Johann Friedrich Städel stiftete 1815 seine Kunstsammlung und sein Vermögen für ein Museum – das Städel. Es gilt als älteste Museumsstiftung Deutschlands und zeigt Kunst von den Alten Meistern bis zur Gegenwart, mitten in Hessen." },
  { id: "ku6", topic: "kunst", title: "Die große Welle vor Kanagawa", q: "Hokusai Die große Welle vor Kanagawa Japonismus",
    text: "Katsushika Hokusais Farbholzschnitt entstand um 1831 und zeigt eine riesige Welle vor dem Fuji. Japanische Drucke wie dieser begeisterten im 19. Jahrhundert europäische Künstler – der „Japonismus“ beeinflusste Impressionisten wie Monet und van Gogh. Das kräftige Blau stammt von importiertem Berliner Blau." },

  // ---- IT (+3)
  { id: "it4", topic: "it", title: "Der Turing-Test", q: "Turing-Test Computing Machinery and Intelligence",
    text: "1950 schlug Alan Turing vor, die Frage „Können Maschinen denken?“ durch ein Spiel zu ersetzen: Kann ein Mensch im Textchat nicht mehr erkennen, ob er mit Mensch oder Maschine schreibt? Der Test misst Nachahmung, nicht Bewusstsein – und wird bis heute kritisiert." },
  { id: "it5", topic: "it", title: "Das Moore’sche Gesetz", q: "Moores Gesetz Gordon Moore",
    text: "1965 beobachtete Gordon Moore, dass sich die Zahl der Transistoren auf einem Chip regelmäßig verdoppelt; ab 1975 nannte er etwa zwei Jahre als Takt. Jahrzehntelang bestimmte das die Computerentwicklung. Heute wird es durch physikalische Grenzen und Kosten schwieriger." },
  { id: "it6", topic: "it", title: "Git: in wenigen Wochen geschrieben", q: "Git Linus Torvalds 2005",
    text: "Linus Torvalds begann im April 2005 Git zu entwickeln, weil die Linux-Entwickler ein neues Versionskontrollsystem brauchten – schnell, verteilt und robust. Heute nutzen es fast alle Softwareprojekte; auch dieses hier liegt in einem Git-Repository." },

  // ---- Politik (+3)
  { id: "po4", topic: "politik", title: "Wie die Länder in Berlin mitreden", q: "Bundesrat Stimmen Länder Deutschland",
    text: "Der Bundesrat vertritt die 16 Länder im Bund. Er hat 69 Stimmen, jedes Land bekommt je nach Einwohnerzahl drei bis sechs. Hessen hat fünf. Bei zustimmungspflichtigen Gesetzen können die Länder ein Gesetz stoppen – das macht Kompromisse zwischen Bund und Ländern nötig." },
  { id: "po5", topic: "politik", title: "Die Ewigkeitsklausel", q: "Grundgesetz Artikel 79 Ewigkeitsklausel Menschenwürde",
    text: "Das Grundgesetz wurde am 8. Mai 1949 beschlossen und am 23. Mai verkündet. Artikel 1 schützt die Menschenwürde. Nach Artikel 79 Absatz 3 dürfen diese Grundsätze sowie Demokratie, Rechtsstaat und Bundesstaat nicht abgeschafft werden – selbst mit Zweidrittelmehrheit. Eine Lehre aus 1933." },
  { id: "po6", topic: "politik", title: "Die Hüter der Verfassung in Karlsruhe", q: "Bundesverfassungsgericht Richter Senate Amtszeit",
    text: "Das Bundesverfassungsgericht in Karlsruhe hat 16 Richterinnen und Richter in zwei Senaten zu je acht. Sie werden für zwölf Jahre gewählt, eine Wiederwahl ist ausgeschlossen. Jeder Mensch kann Verfassungsbeschwerde einlegen, wenn er sich in Grundrechten verletzt sieht." },

  // ---- Technik (+3)
  { id: "te4", topic: "technik", title: "Der Akku, ohne den es kein Smartphone gäbe", q: "Lithium-Ionen-Akku Nobelpreis Chemie 2019",
    text: "Für die Entwicklung des Lithium-Ionen-Akkus erhielten John Goodenough, Stanley Whittingham und Akira Yoshino 2019 den Chemie-Nobelpreis. Sony brachte ihn 1991 auf den Markt. Beim Laden wandern Lithium-Ionen zwischen zwei Elektroden hin und her – ohne dass sich die Elektroden dabei verbrauchen." },
  { id: "te5", topic: "technik", title: "Kühlschrank: Wärme wird weggepumpt", q: "Kühlschrank Funktionsweise Kältemittel Kompressor",
    text: "Ein Kühlschrank erzeugt keine Kälte, er transportiert Wärme nach draußen. Ein Kältemittel verdampft im Inneren und nimmt dabei Wärme auf. Ein Kompressor verdichtet den Dampf, an den Rippen auf der Rückseite gibt er die Wärme wieder ab – deshalb ist die Rückseite warm." },
  { id: "te6", topic: "technik", title: "Der QR-Code kann Schäden verkraften", q: "QR-Code Denso Wave Fehlerkorrektur Reed-Solomon",
    text: "Masahiro Hara entwickelte den QR-Code 1994 bei Denso Wave, einem Toyota-Zulieferer, um Autoteile zu verfolgen. Dank Fehlerkorrektur (Reed-Solomon-Verfahren) lässt er sich auch dann noch lesen, wenn je nach Stufe bis zu etwa 30 Prozent beschädigt sind." },

  // ---- Medizin (+3)
  { id: "me4", topic: "medizin", title: "Die Impfung, die eine Krankheit ausrottete", q: "Edward Jenner Pocken Impfung ausgerottet 1980",
    text: "1796 impfte Edward Jenner einen Jungen mit Kuhpocken-Material und schützte ihn so vor den gefährlichen Menschenpocken. Nach weltweiten Impfkampagnen erklärte die WHO die Pocken 1980 für ausgerottet – bisher die einzige Krankheit des Menschen, bei der das gelang." },
  { id: "me5", topic: "medizin", title: "So viele Bakterien wie Körperzellen", q: "Mikrobiom Darm Bakterien Verhältnis Körperzellen",
    text: "Lange hieß es, wir trügen zehnmal mehr Bakterien als eigene Zellen. Neuere Schätzungen (2016) sprechen von einem Verhältnis von etwa 1:1. Das Mikrobiom, vor allem im Darm, beeinflusst Verdauung, Immunsystem und vermutlich weit mehr – vieles ist noch Forschungsgegenstand." },
  { id: "me6", topic: "medizin", title: "Was im Schlaf mit dem Gehirn passiert", q: "Schlaf glymphatisches System Gehirn",
    text: "Erwachsene brauchen meist sieben bis neun Stunden Schlaf. Studien, vor allem an Mäusen, zeigen: Im Schlaf werden Stoffwechsel-Abfallprodukte effizienter aus dem Gehirn abtransportiert. Zudem festigt das Gehirn Gelerntes. Wie genau das beim Menschen abläuft, wird noch erforscht." },

  // ---- Biologie (+3)
  { id: "bi4", topic: "biologie", title: "Die Doppelhelix und das Foto 51", q: "DNA Doppelhelix Watson Crick Rosalind Franklin",
    text: "1953 beschrieben James Watson und Francis Crick die Doppelhelix-Struktur der DNA. Entscheidende Hinweise lieferte Rosalind Franklins Röntgenbild „Foto 51“. Den Nobelpreis 1962 bekamen Watson, Crick und Maurice Wilkins; Franklin war da bereits gestorben – und wird bis heute zu wenig gewürdigt." },
  { id: "bi5", topic: "biologie", title: "Wer der Erde den Sauerstoff schenkte", q: "Große Sauerstoffkatastrophe Cyanobakterien",
    text: "Vor etwa 2,4 Milliarden Jahren stieg der Sauerstoffgehalt der Atmosphäre stark an: Cyanobakterien betrieben Photosynthese und gaben Sauerstoff ab. Für viele damalige Lebewesen war er giftig, für die spätere Entwicklung komplexen Lebens aber die Voraussetzung." },
  { id: "bi6", topic: "biologie", title: "Wie viele Arten gibt es?", q: "Artenvielfalt Anzahl beschriebene Arten 8,7 Millionen",
    text: "Rund 2 Millionen Tier-, Pflanzen- und Pilzarten sind wissenschaftlich beschrieben. Eine viel zitierte Schätzung von 2011 geht von etwa 8,7 Millionen Arten mit Zellkern aus. Der größte Teil ist also noch unbekannt – besonders bei Insekten, Pilzen und in der Tiefsee." },

  // ---- Zoologie (+3)
  { id: "zo5", topic: "zoologie", title: "Der Blauwal: größtes Tier aller Zeiten", q: "Blauwal Größe Gewicht",
    text: "Der Blauwal wird bis zu etwa 30 Meter lang und wiegt über 100 Tonnen – mehr als jeder bekannte Dinosaurier. Schon Neugeborene sind rund sechs bis sieben Meter lang. Er ernährt sich fast ausschließlich von winzigem Krill." },
  { id: "zo6", topic: "zoologie", title: "Der Tanz der Bienen", q: "Schwänzeltanz Karl von Frisch",
    text: "Honigbienen teilen ihren Stockgenossinnen im Schwänzeltanz mit, wo Nahrung zu finden ist: Der Winkel des Tanzes zur Senkrechten zeigt die Richtung relativ zur Sonne, seine Dauer die Entfernung. Karl von Frisch entschlüsselte das und erhielt dafür 1973 den Nobelpreis." },
  { id: "zo7", topic: "zoologie", title: "Krähen, die Werkzeuge bauen", q: "Neukaledonische Krähe Werkzeuggebrauch",
    text: "Neukaledonische Krähen fertigen Werkzeuge aus Zweigen und Blättern, etwa Haken, um Insektenlarven aus Löchern zu holen. Sie geben Wissen sogar an den Nachwuchs weiter. Rabenvögel gehören zu den intelligentesten Tieren – trotz eines Gehirns, das nur wenige Gramm wiegt." },

  // ---- Wirtschaft (4)
  { id: "wi1", topic: "wirtschaft", title: "Warum die EZB genau zwei Prozent will", q: "EZB Inflationsziel 2 Prozent Preisstabilität",
    text: "Die Europäische Zentralbank strebt mittelfristig eine Inflationsrate von 2 Prozent an – und zwar symmetrisch: Auch zu wenig Inflation wäre ein Problem. Ein bisschen Preisanstieg gibt Spielraum gegen Deflation, zu viel entwertet Ersparnisse." },
  { id: "wi2", topic: "wirtschaft", title: "Handel lohnt sich – auch für die Schwächeren", q: "David Ricardo komparativer Kostenvorteil",
    text: "David Ricardo zeigte 1817: Selbst wenn ein Land alles besser produzieren kann, lohnt sich Handel, wenn sich jeder auf das konzentriert, was er im Vergleich am günstigsten kann („komparativer Kostenvorteil“). Es ist bis heute das Kernargument für Freihandel – auch wenn es Verlierer im Einzelnen nicht ausschließt." },
  { id: "wi3", topic: "wirtschaft", title: "Die Tulpenmanie", q: "Tulpenmanie Niederlande 1637",
    text: "In den 1630er-Jahren stiegen in den Niederlanden die Preise für Tulpenzwiebeln extrem und brachen 1637 ein. Sie gilt als Urbild der Spekulationsblase. Manche Historiker meinen allerdings, das Ausmaß werde oft übertrieben; die Belege seien dünn." },
  { id: "wi4", topic: "wirtschaft", title: "Was das BIP nicht misst", q: "Bruttoinlandsprodukt Kritik Simon Kuznets",
    text: "Das Bruttoinlandsprodukt misst den Wert aller in einem Land erzeugten Waren und Dienstleistungen in einem Jahr. Unbezahlte Arbeit, Verteilung oder Umweltschäden erfasst es nicht. Schon Simon Kuznets, einer seiner Väter, warnte 1934, Wohlstand allein daran abzulesen." },

  // ---- Weltgeschehen (4)
  { id: "we1", topic: "welt", title: "Die Straße von Hormus", q: "Straße von Hormus Ölhandel",
    text: "Zwischen Iran und Oman liegt die Straße von Hormus – an der engsten Stelle etwa 33 Kilometer breit. Rund ein Fünftel des weltweit gehandelten Erdöls fährt hindurch. Deshalb lassen Spannungen dort sofort die Ölpreise schwanken." },
  { id: "we2", topic: "welt", title: "BRICS: aus einem Börsenkürzel wurde ein Bündnis", q: "BRICS Jim O'Neill Erweiterung",
    text: "Den Begriff „BRIC“ prägte 2001 der Ökonom Jim O’Neill von Goldman Sachs für Brasilien, Russland, Indien und China. Später gründeten die Staaten tatsächlich ein Bündnis, Südafrika kam 2010 dazu. Seit 2024 wächst BRICS mit weiteren Mitgliedern." },
  { id: "we3", topic: "welt", title: "27 Länder, rund 450 Millionen Menschen", q: "Europäische Union Mitgliedstaaten Brexit",
    text: "Die EU hat seit dem Austritt des Vereinigten Königreichs am 31. Januar 2020 noch 27 Mitgliedstaaten mit rund 450 Millionen Einwohnern. Sie ist der weltgrößte Binnenmarkt und regelt viele Bereiche gemeinsam – von Handel bis Verbraucherschutz." },
  { id: "we4", topic: "welt", title: "Die Arktis erwärmt sich besonders schnell", q: "Arktische Verstärkung Erwärmung Arktis",
    text: "Die Arktis erwärmt sich Studien zufolge etwa drei- bis viermal so schnell wie der globale Durchschnitt („arktische Verstärkung“). Schmelzendes Eis legt dunkleres Wasser frei, das mehr Wärme aufnimmt. Folgen sind neue Schifffahrtsrouten – und geopolitische Konkurrenz um Rohstoffe." },

  // ---- Psychologie (4)
  { id: "ps1", topic: "psychologie", title: "Der Ankereffekt", q: "Ankereffekt Tversky Kahneman",
    text: "Tversky und Kahneman zeigten 1974: Schon eine willkürliche Zahl beeinflusst spätere Schätzungen. Wer vorher eine hohe Zahl im Kopf hat, schätzt höher. Deshalb sind Preisschilder mit durchgestrichenem „Statt“-Preis so wirksam – und Verhandlungsanfänge so wichtig." },
  { id: "ps2", topic: "psychologie", title: "Das Milgram-Experiment", q: "Milgram-Experiment Gehorsam Yale 1961",
    text: "1961 ließ Stanley Milgram Versuchspersonen scheinbar Stromschläge an einen Schauspieler verabreichen, wenn ein Versuchsleiter es verlangte. In der bekanntesten Variante gingen etwa 65 Prozent bis zur höchsten Stufe. Das Experiment zeigt die Macht von Autorität – und ist ethisch wie methodisch umstritten." },
  { id: "ps3", topic: "psychologie", title: "Vergessen folgt einer Kurve", q: "Ebbinghaus Vergessenskurve Spacing-Effekt",
    text: "Hermann Ebbinghaus fand 1885 durch Selbstversuche: Neu Gelerntes wird anfangs besonders schnell vergessen. Wiederholungen in wachsenden Abständen („Spacing“) prägen das Wissen dauerhafter ein als Pauken am Stück. Darauf beruhen viele Lernkarteien und -apps." },
  { id: "ps4", topic: "psychologie", title: "Warum bei vielen Zuschauern oft keiner hilft", q: "Bystander-Effekt Latané Darley",
    text: "Latané und Darley beschrieben 1968 den Zuschauereffekt: Je mehr Menschen anwesend sind, desto geringer ist oft die Chance, dass eine einzelne Person eingreift – die Verantwortung verteilt sich. In eindeutig gefährlichen Notfällen fällt der Effekt laut späteren Analysen schwächer aus." },

  // ---- Sprache (4)
  { id: "sp1", topic: "sprache", title: "Formt Sprache unser Denken?", q: "Sapir-Whorf-Hypothese",
    text: "Die Sapir-Whorf-Hypothese fragt, ob Sprache bestimmt, wie wir denken. Die starke Version – Sprache legt Denken fest – gilt als widerlegt. Die schwache ist gut belegt: Wörter für Farben oder Richtungen können Wahrnehmung und Gedächtnis leicht beeinflussen." },
  { id: "sp2", topic: "sprache", title: "Der Duden entstand in Hessen", q: "Konrad Duden Bad Hersfeld Orthographisches Wörterbuch 1880",
    text: "Konrad Duden leitete als Schuldirektor das Gymnasium in Bad Hersfeld. Dort entstand sein „Vollständiges Orthographisches Wörterbuch der deutschen Sprache“, das 1880 erschien. Es wurde zum Maßstab der deutschen Rechtschreibung." },
  { id: "sp3", topic: "sprache", title: "Deutsch, Hindi und Latein sind verwandt", q: "Indogermanische Sprachen Sanskrit William Jones",
    text: "1786 bemerkte William Jones, dass Sanskrit, Griechisch und Latein einen gemeinsamen Ursprung haben müssen. Heute weiß man: Deutsch, Englisch, Persisch und Hindi gehören zur indogermanischen Sprachfamilie. Aus Vergleichen rekonstruiert man sogar ihre Urahnin – ohne je einen Text davon zu haben." },
  { id: "sp4", topic: "sprache", title: "Rund 7.000 Sprachen – viele in Gefahr", q: "Weltsprachen Anzahl bedrohte Sprachen Ethnologue",
    text: "Weltweit werden etwa 7.000 Sprachen gesprochen. Laut Ethnologue gilt fast die Hälfte als bedroht, viele haben nur noch wenige Sprecher. Mit jeder Sprache geht auch Wissen über Natur, Geschichte und Kultur verloren." },

  // ---- Mathematik (4)
  { id: "ma1", topic: "mathe", title: "Es gibt unendlich viele Primzahlen", q: "Euklid Beweis unendlich viele Primzahlen",
    text: "Euklid bewies um 300 v. Chr.: Gäbe es nur endlich viele Primzahlen, multipliziere alle und addiere 1. Die neue Zahl ist durch keine der Primzahlen teilbar, also muss es weitere geben. Der Beweis gilt bis heute als Musterbeispiel mathematischer Eleganz." },
  { id: "ma2", topic: "mathe", title: "Die schönste Formel?", q: "Eulersche Identität",
    text: "e^(iπ) + 1 = 0: Die Eulersche Identität verbindet fünf der wichtigsten Zahlen der Mathematik – e, i, π, 1 und 0 – in einer einzigen Gleichung. Viele Mathematiker nennen sie die schönste Formel überhaupt." },
  { id: "ma3", topic: "mathe", title: "Das Ziegenproblem", q: "Monty-Hall-Problem",
    text: "Hinter einer von drei Türen steht ein Auto, hinter zwei eine Ziege. Du wählst eine, der Moderator öffnet eine andere mit einer Ziege. Wechseln oder bleiben? Wechseln: Du gewinnst dann mit Wahrscheinlichkeit 2/3, beim Bleiben nur mit 1/3. Auch viele Mathematiker irrten zunächst." },
  { id: "ma4", topic: "mathe", title: "Das Geburtstagsparadoxon", q: "Geburtstagsparadoxon 23 Personen",
    text: "Bei 23 Personen im Raum haben mit über 50 Prozent Wahrscheinlichkeit zwei am selben Tag Geburtstag. Der Grund: Nicht eine Person wird verglichen, sondern alle möglichen Paare – bei 23 Personen sind es 253. Das Prinzip steckt auch hinter Angriffen auf Hash-Verfahren." },

  // ---- Chemie (4)
  { id: "ch1", topic: "chemie", title: "Mendelejew sagte Elemente voraus", q: "Periodensystem Mendelejew 1869 Gallium Germanium",
    text: "Dmitri Mendelejew ordnete 1869 die Elemente nach Atommasse und Eigenschaften und ließ Lücken frei. Er sagte drei unbekannte Elemente samt Eigenschaften voraus; sie wurden später als Gallium, Scandium und Germanium entdeckt. Heute kennt man 118 Elemente." },
  { id: "ch2", topic: "chemie", title: "Brot aus Luft: Haber-Bosch", q: "Haber-Bosch-Verfahren Ammoniak Kunstdünger",
    text: "Fritz Haber und Carl Bosch entwickelten Anfang des 20. Jahrhunderts, großtechnisch ab 1913, die Ammoniak-Synthese aus Luftstickstoff und Wasserstoff. Sie ermöglichte Kunstdünger. Schätzungen zufolge hängt die Ernährung von etwa der Hälfte der Menschheit daran – der Prozess verbraucht aber auch viel Energie." },
  { id: "ch3", topic: "chemie", title: "Warum Eis schwimmt", q: "Anomalie des Wassers 4 Grad Dichte",
    text: "Fast alle Stoffe werden beim Gefrieren dichter. Wasser nicht: Seine größte Dichte hat es bei 4 °C, Eis ist leichter und schwimmt. Deshalb frieren Seen von oben zu, und darunter bleibt flüssiges Wasser, in dem Leben überwintern kann." },
  { id: "ch4", topic: "chemie", title: "Was der Auto-Katalysator macht", q: "Dreiwegekatalysator Platin Rhodium Palladium",
    text: "Der Katalysator im Benzin-Auto nutzt Platin, Palladium und Rhodium, um giftiges Kohlenmonoxid, unverbrannte Kohlenwasserstoffe und Stickoxide in Kohlendioxid, Wasser und Stickstoff umzuwandeln. Er wirkt nur, wenn er heiß genug ist – Kurzstrecken sind deshalb besonders schmutzig." },

  // ---- Erde & Klima (4)
  { id: "kl1", topic: "klima", title: "Ohne Treibhauseffekt wäre es eisig", q: "natürlicher Treibhauseffekt Durchschnittstemperatur",
    text: "Ohne den natürlichen Treibhauseffekt läge die Durchschnittstemperatur der Erde bei etwa −18 °C statt bei rund +15 °C. Gase wie Wasserdampf und CO₂ halten einen Teil der Wärme zurück. Das Problem ist der zusätzliche, vom Menschen verstärkte Effekt." },
  { id: "kl2", topic: "klima", title: "CO₂ in der Atmosphäre", q: "CO2-Konzentration ppm Mauna Loa",
    text: "Vor der Industrialisierung lag die CO₂-Konzentration bei etwa 280 ppm. Heute liegt sie über 420 ppm; das zeigt die Messreihe vom Mauna Loa auf Hawaii, die seit 1958 läuft. Der Anstieg geht vor allem auf das Verbrennen fossiler Energieträger zurück." },
  { id: "kl3", topic: "klima", title: "Golfstrom und Europas Klima", q: "Golfstrom AMOC Abschwächung",
    text: "Das atlantische Strömungssystem (AMOC), zu dem der Golfstrom gehört, transportiert Wärme nach Nordeuropa. Ob und wie stark es sich durch die Erwärmung abschwächt, ist Gegenstand intensiver Forschung – die Unsicherheit ist groß, ein plötzlicher Kollaps gilt als möglich, aber schwer vorherzusagen." },
  { id: "kl4", topic: "klima", title: "Wetter ist nicht Klima", q: "Unterschied Wetter Klima 30 Jahre WMO",
    text: "Wetter ist der Zustand der Atmosphäre an einem Ort zu einer Zeit, Klima die Statistik davon über lange Zeit – üblicherweise 30 Jahre. Ein kalter Wintertag widerlegt daher keinen Erwärmungstrend, genauso wenig beweist ein heißer Sommer allein einen." },

  // ---- Raumfahrt (4)
  { id: "ra1", topic: "raumfahrt", title: "Sputnik: der Piepton, der die Welt aufschreckte", q: "Sputnik 1 1957",
    text: "Am 4. Oktober 1957 startete die Sowjetunion Sputnik 1, den ersten künstlichen Erdsatelliten – eine 84-Kilogramm-Kugel, die piepste. Der „Sputnik-Schock“ löste den Wettlauf ins All aus und führte in den USA zur Gründung der NASA 1958." },
  { id: "ra2", topic: "raumfahrt", title: "Apollo 11", q: "Apollo 11 Mondlandung Armstrong Aldrin",
    text: "Am 20. Juli 1969 (UTC) landeten Neil Armstrong und Buzz Aldrin mit der Mondfähre „Eagle“ auf dem Mond. Michael Collins blieb im Orbit. Die Astronauten sammelten etwa 21 Kilogramm Gestein und kehrten am 24. Juli zurück." },
  { id: "ra3", topic: "raumfahrt", title: "Die ISS: seit über 25 Jahren bewohnt", q: "Internationale Raumstation ISS seit 2000",
    text: "Seit November 2000 ist die Internationale Raumstation ununterbrochen bewohnt. Sie umkreist die Erde in rund 90 Minuten – die Besatzung erlebt etwa 16 Sonnenaufgänge am Tag. Das Projekt wird von den USA, Russland, Europa, Japan und Kanada getragen." },
  { id: "ra4", topic: "raumfahrt", title: "James Webb: Blick in die Frühzeit", q: "James-Webb-Weltraumteleskop L2",
    text: "Das James-Webb-Teleskop startete am 25. Dezember 2021 und beobachtet im Infrarot. Sein Spiegel hat 6,5 Meter Durchmesser, er steht rund 1,5 Millionen Kilometer von der Erde entfernt am Lagrange-Punkt L2. Es sieht Galaxien aus der Frühzeit des Universums." },

  // ---- NFL (4)
  { id: "nf1", topic: "nfl", title: "Super Bowl I", q: "Super Bowl I 1967 Green Bay Packers",
    text: "Der erste Super Bowl fand am 15. Januar 1967 statt: Die Green Bay Packers (NFL) schlugen die Kansas City Chiefs (AFL) mit 35:10. Damals hieß das Spiel noch „AFL-NFL World Championship Game“; der Name Super Bowl setzte sich erst danach durch." },
  { id: "nf2", topic: "nfl", title: "Wie die NFL aufgebaut ist", q: "NFL Struktur Conferences Divisions",
    text: "Die NFL hat 32 Teams in zwei Conferences (AFC und NFC) mit je vier Divisions zu vier Teams. Seit 2021 spielt jedes Team 17 Saisonspiele. Die Sieger der beiden Conferences treffen im Super Bowl aufeinander." },
  { id: "nf3", topic: "nfl", title: "Downs: das Herz des Spiels", q: "American Football Downs Regeln",
    text: "Das angreifende Team hat vier Versuche (Downs), um mindestens zehn Yards Raumgewinn zu erzielen. Gelingt das, gibt es vier neue Versuche. Wenn nicht, geht der Ball an den Gegner – deshalb kicken Teams beim vierten Versuch oft weg (Punt)." },
  { id: "nf4", topic: "nfl", title: "NFL in Deutschland", q: "NFL Germany Games Frankfurt München",
    text: "Seit 2022 finden reguläre NFL-Spiele in Deutschland statt, unter anderem in München und Frankfurt. Der Frankfurter Stadtwald zog 2023 tausende Fans aus ganz Europa an. Die Liga sieht Deutschland als wichtigsten Markt außerhalb der USA." },

  // ---- Softwareentwicklung
  { id: "sw1", topic: "sw", title: "SOLID: fünf Regeln für wartbaren Code", q: "SOLID Prinzipien Robert C. Martin",
    text: "SOLID fasst fünf Entwurfsprinzipien zusammen: Single Responsibility, Open/Closed, Liskov-Substitution, Interface-Segregation und Dependency-Inversion. Robert C. Martin formulierte sie, das Kürzel stammt von Michael Feathers. Gemeinsame Idee: Klassen sollen wenig Gründe zur Änderung haben und sich leicht austauschen lassen." },
  { id: "sw2", topic: "sw", title: "23 Rezepte gegen Chaos im Code", q: "Entwurfsmuster Gang of Four Design Patterns 1994",
    text: "1994 erschien das Buch „Design Patterns“ der „Gang of Four“ (Gamma, Helm, Johnson, Vlissides). Es beschreibt 23 bewährte Lösungen für wiederkehrende Entwurfsprobleme, sortiert in Erzeugungs-, Struktur- und Verhaltensmuster – etwa Singleton, Observer oder Factory. Muster sind Vokabular für Teams, keine Pflichtübung." },
  { id: "sw3", topic: "sw", title: "Die Testpyramide", q: "Testpyramide Mike Cohn Unit-Test Integrationstest",
    text: "Viele schnelle Unit-Tests, weniger Integrationstests, nur wenige langsame End-to-End-Tests über die Oberfläche: So sieht die Testpyramide aus (bekannt geworden durch Mike Cohn, 2009). Wer sie umdreht, bekommt lange Laufzeiten und wackelige Tests." },
  { id: "sw4", topic: "sw", title: "Scrum in dreißig Sekunden", q: "Scrum Guide Sprint Rollen",
    text: "Scrum arbeitet in Sprints von höchstens einem Monat. Drei Rollen: Product Owner (was), Entwickelnde (wie) und Scrum Master (Prozess). Feste Ereignisse sind Sprint Planning, Daily, Review und Retrospektive. Beschrieben ist das im Scrum Guide von Ken Schwaber und Jeff Sutherland." },
  { id: "sw5", topic: "sw", title: "Technische Schulden", q: "Technische Schulden Ward Cunningham",
    text: "Ward Cunningham verglich 1992 schnelle, unsaubere Lösungen mit einem Kredit: Man kommt schneller voran, zahlt aber Zinsen – jede spätere Änderung wird mühsamer. Ein bewusst aufgenommener Kredit kann sinnvoll sein, solange man ihn irgendwann zurückzahlt." },

  // ---- Datenbanken & Daten
  { id: "db1", topic: "db", title: "Normalformen: Ordnung gegen Redundanz", q: "Normalisierung Datenbank Normalformen Codd",
    text: "Edgar F. Codd begründete 1970 das relationale Modell. Die Normalformen (1NF bis 3NF und weitere) helfen, Daten ohne Doppelungen abzulegen: Jede Information steht genau einmal. So vermeidet man Änderungs-, Einfüge- und Löschanomalien, muss aber oft mit Joins bezahlen." },
  { id: "db2", topic: "db", title: "ACID: Warum die Überweisung nicht halb passiert", q: "ACID Transaktion Datenbank",
    text: "Eine Überweisung muss ganz oder gar nicht passieren. Dafür stehen die ACID-Eigenschaften: Atomarität, Konsistenz, Isolation und Dauerhaftigkeit. Schlägt ein Schritt fehl, wird alles zurückgerollt; parallele Transaktionen stören sich nicht, und Bestätigtes geht bei Absturz nicht verloren." },
  { id: "db3", topic: "db", title: "Ein Index ist wie ein Stichwortverzeichnis", q: "Datenbankindex B-Baum",
    text: "Ohne Index liest eine Datenbank für eine Suche im Zweifel die ganze Tabelle. Ein Index (meist ein B-Baum) findet Einträge wie ein Stichwortverzeichnis im Buch – dafür kostet er Speicher und verlangsamt Schreibvorgänge. Mehr Indizes sind deshalb nicht automatisch besser." },
  { id: "db4", topic: "db", title: "Snowflake trennt Speicher und Rechenpower", q: "Snowflake Architektur Storage Compute getrennt Virtual Warehouse",
    text: "Das Cloud-Data-Warehouse Snowflake trennt Datenspeicher und Rechenleistung. Abfragen laufen auf „Virtual Warehouses“, die sich unabhängig vom Speicher hoch- und runterskalieren oder pausieren lassen. Mehrere Teams können so auf dieselben Daten zugreifen, ohne sich auszubremsen." },
  { id: "db5", topic: "db", title: "Das CAP-Theorem", q: "CAP-Theorem Eric Brewer",
    text: "Eric Brewer vermutete 2000: Ein verteiltes System kann nicht gleichzeitig Konsistenz, Verfügbarkeit und Partitionstoleranz garantieren. Da Netzwerkausfälle vorkommen, muss man bei einer Trennung wählen: alle sehen dieselben Daten (Konsistenz) oder das System antwortet immer (Verfügbarkeit)." },

  // ---- IT-Sicherheit & Netze
  { id: "sc1", topic: "sc", title: "Die drei Schutzziele der IT-Sicherheit", q: "Schutzziele Vertraulichkeit Integrität Verfügbarkeit",
    text: "IT-Sicherheit dreht sich um drei Grundwerte: Vertraulichkeit (nur Berechtigte lesen), Integrität (Daten bleiben unverfälscht) und Verfügbarkeit (Systeme sind nutzbar, wenn man sie braucht). Bei jeder Maßnahme lohnt die Frage, welches Ziel sie schützt – und welches sie eventuell schwächt." },
  { id: "sc2", topic: "sc", title: "Sieben Schichten für ein Datenpaket", q: "OSI-Modell sieben Schichten TCP/IP",
    text: "Das OSI-Modell (ISO, 1984) teilt Netzkommunikation in sieben Schichten: Bitübertragung, Sicherung, Vermittlung, Transport, Sitzung, Darstellung und Anwendung. Im Alltag nutzt man meist das schlankere TCP/IP-Modell mit vier Schichten; OSI dient vor allem als gemeinsame Sprache zur Fehlersuche." },
  { id: "sc3", topic: "sc", title: "Social Engineering: der Mensch als Einfallstor", q: "Social Engineering Phishing Warnsignale",
    text: "Angreifer hacken oft nicht die Technik, sondern den Menschen: Sie erzeugen Zeitdruck, geben sich als Autorität aus oder locken mit Belohnungen. Warnsignale sind ungewöhnliche Bitten, Druck und Links zu Anmeldeseiten. Im Zweifel hilft ein Rückruf über einen bekannten, unabhängigen Kanal." },
  { id: "sc4", topic: "sc", title: "Passkeys: Anmelden ohne Passwort", q: "Passkeys FIDO2 WebAuthn",
    text: "Passkeys (auf Basis von FIDO2/WebAuthn) ersetzen Passwörter durch ein Schlüsselpaar: Der private Schlüssel bleibt auf deinem Gerät, der Dienst kennt nur den öffentlichen. Weil die Anmeldung an die echte Webseite gebunden ist, laufen Phishing-Seiten ins Leere." },
  { id: "sc5", topic: "sc", title: "CIS Benchmarks: Härtungsanleitungen für alles", q: "CIS Benchmarks Hardening Center for Internet Security",
    text: "Das Center for Internet Security veröffentlicht die CIS Benchmarks: herstellerunabhängige, in Gemeinschaft erarbeitete Konfigurationsempfehlungen zum Absichern („Härten“) von Systemen. Sie gibt es für Betriebssysteme, Cloud-Anbieter und Datenbanken, unter anderem auch für Snowflake. Viele Sicherheitsprüfungen messen die Einhaltung." },

  // ---- Cloud & Architektur
  { id: "cd1", topic: "cd", title: "Monolith oder Microservices?", q: "Microservices Monolith Vor- und Nachteile",
    text: "Ein Monolith ist eine einzige ausgelieferte Anwendung, Microservices sind viele kleine, unabhängig deploybare Dienste. Microservices erlauben getrennte Skalierung und Teams, verlagern die Komplexität aber ins Netzwerk. Viele Projekte fahren mit einem gut strukturierten Monolithen zunächst besser." },
  { id: "cd2", topic: "cd", title: "REST: die Idee hinter den meisten Web-APIs", q: "REST Roy Fielding Dissertation 2000",
    text: "Roy Fielding beschrieb REST in seiner Dissertation im Jahr 2000. Kernidee: Alles ist eine Ressource mit einer Adresse, bearbeitet mit den HTTP-Verben GET, POST, PUT und DELETE. Der Server merkt sich keinen Zustand zwischen Anfragen – jede Anfrage bringt alles Nötige mit." },
  { id: "cd3", topic: "cd", title: "Container sind keine virtuellen Maschinen", q: "Container versus virtuelle Maschine Docker",
    text: "Eine virtuelle Maschine bringt ein komplettes Gastbetriebssystem mit. Container teilen sich den Kernel des Hosts und isolieren nur Prozesse und Dateien – das macht sie klein und schnell gestartet. Docker machte das Konzept ab 2013 populär." },
  { id: "cd4", topic: "cd", title: "CI/CD: vom Commit zur Auslieferung", q: "Continuous Integration Continuous Delivery Deployment",
    text: "Continuous Integration heißt: Bei jeder Änderung wird automatisch gebaut und getestet. Continuous Delivery hält das Ergebnis jederzeit auslieferbar, bei Continuous Deployment geht es sogar ohne manuellen Schritt live. Ziel: kleine Änderungen, schnelles Feedback, weniger Angst vor Releases." },
  { id: "cd5", topic: "cd", title: "Skalieren: größer oder mehr?", q: "Vertikale Horizontale Skalierung",
    text: "Vertikal skalieren heißt, einen Rechner stärker zu machen (mehr CPU, mehr RAM). Horizontal skalieren heißt, mehr Rechner nebeneinander zu betreiben. Vertikal ist einfach, stößt aber an Grenzen; horizontal wächst fast beliebig, verlangt aber Anwendungen, die verteilt arbeiten können." },

  // ---- KI & Tools
  { id: "ki1", topic: "ki", title: "Wie ein Sprachmodell Text erzeugt", q: "Large Language Model Token nächstes Wort Vorhersage",
    text: "Große Sprachmodelle zerlegen Text in Tokens (Wortstücke) und berechnen immer wieder, welches Token am wahrscheinlichsten als Nächstes folgt. Aus diesem einfachen Prinzip entstehen Antworten, Code und Übersetzungen. Dass es „nur“ Wahrscheinlichkeiten sind, erklärt auch ihre Fehler." },
  { id: "ki2", topic: "ki", title: "„Attention Is All You Need“", q: "Transformer Attention Is All You Need 2017",
    text: "2017 stellte ein Forschungsteam bei Google die Transformer-Architektur vor, im Aufsatz „Attention Is All You Need“. Der Aufmerksamkeitsmechanismus lässt ein Modell gewichten, welche Wörter im Text zueinander wichtig sind. Fast alle heutigen Sprachmodelle bauen darauf auf." },
  { id: "ki3", topic: "ki", title: "Halluzinationen: überzeugend und falsch", q: "KI Halluzination Sprachmodelle Retrieval",
    text: "Sprachmodelle erfinden manchmal Fakten, Quellen oder Zitate, die glaubwürdig klingen, aber falsch sind. Der Grund: Sie optimieren Plausibilität, nicht Wahrheit. Abhilfe schaffen Belege aus verlässlichen Quellen (Retrieval), Nachprüfen und die Bitte an das Modell, Unsicherheit zuzugeben." },
  { id: "ki4", topic: "ki", title: "Das Kontextfenster", q: "Kontextfenster Sprachmodell Token Limit",
    text: "Ein Modell „sieht“ nur eine begrenzte Menge Text gleichzeitig: sein Kontextfenster, gemessen in Tokens. Was hinausrutscht, ist für das Modell nicht mehr vorhanden. Deshalb helfen kurze, klare Anweisungen und Zusammenfassungen bei langen Gesprächen und großen Projekten." },
  { id: "ki5", topic: "ki", title: "Prompt Injection", q: "Prompt Injection Angriff KI-Agenten",
    text: "Bei einer Prompt Injection schleust ein Angreifer Anweisungen in Text ein, den ein KI-Assistent später verarbeitet – etwa in einer Webseite, E-Mail oder Datei. Das Modell kann Daten und Befehle schlecht trennen. Deshalb sollten KI-Werkzeuge nur so viele Rechte bekommen wie nötig." },
  { id: "ki6", topic: "ki", title: "Der EU AI Act", q: "EU AI Act Risikoklassen 2024",
    text: "Der AI Act der EU trat im August 2024 in Kraft und gilt schrittweise. Er sortiert KI-Systeme nach Risiko: einige Anwendungen sind verboten, andere („hohes Risiko“) unterliegen strengen Pflichten, für viele reichen Transparenzregeln. Es ist das erste umfassende KI-Gesetz dieser Art." },

  // ---- Beruf & Alltag
  { id: "bf1", topic: "bf", title: "Die Feynman-Methode", q: "Feynman-Methode Lernen erklären",
    text: "Wer etwas wirklich verstehen will, erklärt es in einfachen Worten, als säße ein Anfänger vor ihm – so die nach Richard Feynman benannte Lernmethode. Stockt die Erklärung, hat man eine Lücke gefunden. Zurück zur Quelle, Lücke schließen, noch einmal erklären." },
  { id: "bf2", topic: "bf", title: "Abfragen schlägt Wiederlesen", q: "Testeffekt Roediger Karpicke Active Recall",
    text: "Roediger und Karpicke zeigten 2006: Wer sich Stoff aus dem Gedächtnis abruft, behält ihn langfristig besser als jemand, der ihn mehrfach nur wieder liest. Das Anstrengende fühlt sich schlechter an, wirkt aber besser. Karteikarten und Übungsaufgaben nutzen genau diesen Testeffekt." },
  { id: "bf3", topic: "bf", title: "Die Pomodoro-Technik", q: "Pomodoro-Technik Francesco Cirillo",
    text: "Francesco Cirillo entwickelte die Pomodoro-Technik Ende der 1980er-Jahre: 25 Minuten konzentriert arbeiten, dann 5 Minuten Pause, nach vier Runden eine längere. Benannt ist sie nach seiner tomatenförmigen Küchenuhr. Die festen Blöcke erleichtern es, anzufangen und dranzubleiben." },
  { id: "bf4", topic: "bf", title: "DSGVO in Kürze", q: "DSGVO Betroffenenrechte Bußgeld",
    text: "Die DSGVO gilt seit dem 25. Mai 2018. Sie gibt Menschen Rechte wie Auskunft, Berichtigung und Löschung ihrer Daten. Verstöße können mit bis zu 20 Millionen Euro oder 4 Prozent des weltweiten Jahresumsatzes geahndet werden – je nachdem, was höher ist." },
  { id: "bf5", topic: "bf", title: "Wichtig oder nur dringend?", q: "Eisenhower-Matrix dringend wichtig",
    text: "Die Eisenhower-Matrix sortiert Aufgaben nach „dringend“ und „wichtig“. Wichtig und dringend: sofort erledigen. Wichtig, aber nicht dringend: einplanen – hier liegen Lernen und Vorsorge. Dringend, aber unwichtig: abgeben. Weder noch: streichen. Sie geht auf eine Rede von Dwight D. Eisenhower zurück." },
  { id: "bf6", topic: "bf", title: "MIT oder GPL? Lizenzen im Code", q: "Open-Source-Lizenzen MIT GPL Copyleft",
    text: "Code ohne Lizenz darf man rechtlich nicht einfach verwenden. Die MIT-Lizenz erlaubt fast alles, solange der Lizenztext erhalten bleibt. Die GPL ist eine „Copyleft“-Lizenz: Wer GPL-Code weitergibt, muss abgeleitete Werke ebenfalls unter der GPL veröffentlichen." }
];
