// Knowgram – Karten. Felder: id, topic, title, text, q (Suchbegriff für Vertiefung)
window.TOPICS = {
  geschichte: { name: "Geschichte", emoji: "🏛️", c: "#b5651d" },
  physik: { name: "Physik", emoji: "⚛️", c: "#2563eb" },
  kosmologie: { name: "Kosmologie", emoji: "🌌", c: "#6d28d9" },
  philosophie: { name: "Philosophie", emoji: "🦉", c: "#0f766e" },
  kunst: { name: "Kunst", emoji: "🎨", c: "#db2777" },
  it: { name: "IT", emoji: "💻", c: "#0891b2" },
  politik: { name: "Politik", emoji: "🗳️", c: "#b91c1c" },
  technik: { name: "Technik", emoji: "⚙️", c: "#ca8a04" },
  medizin: { name: "Medizin", emoji: "🩺", c: "#dc2626" },
  biologie: { name: "Biologie", emoji: "🧬", c: "#16a34a" },
  zoologie: { name: "Zoologie", emoji: "🐙", c: "#ea580c" }
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
    text: "Der Axolotl kann verlorene Gliedmaßen, Teile des Herzens und sogar Teile des Gehirns komplett nachwachsen lassen, ohne Narben. Deshalb erforscht die Medizin ihn intensiv – in der Hoffnung, Mechanismen der Regeneration eines Tages auch beim Menschen anzustoßen." }
];
