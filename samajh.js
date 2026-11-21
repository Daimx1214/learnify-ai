/**
 * Samajh — core logic.
 *
 * Two engines, one result shape:
 *  - AI mode (default): the explanation and one-line takeaway come from a
 *    free LLM — Pollinations text API, model "openai", no API key, no
 *    sign-up, no text stored by Samajh. Tested live 21 Nov 2026 (see
 *    docs/AI_LOG.md). The AI output is CHECKED before it is shown: any
 *    number or formula in it that is not in the passage makes the app
 *    discard the AI explanation and keep the offline one.
 *  - Offline mode: a rule-based extractive engine. Used when AI mode is
 *    off, when the AI call fails, or when the AI output fails validation.
 *
 * The quiz and glossary are ALWAYS built offline, whatever the mode:
 * every quiz answer must quote an exact sentence from the passage, and
 * glossary translations come only from the checked seed list — the AI
 * never invents a translation or a quiz answer.
 */

export const MIN_CHARS = 30;
export const MAX_CHARS = 2500;
// Free LLM, no key: Pollinations text API (https://text.pollinations.ai).
// POST with {messages, model, jsonMode}. No sign-up, no key stored anywhere.
export const PROVIDER = 'pollinations';
export const AI_ENDPOINT = 'https://text.pollinations.ai/';
export const AI_MODEL = 'openai';

// ---------------------------------------------------------------------------
// Languages — 13, so a student anywhere can use Samajh in the language
// they think in. Glossary meanings come only from the checked seed list
// below (a missing meaning shows English only — never a guessed
// translation). The quiz question/reason, the "in simple words" intro,
// the flashcard progress line and the AI prompt are all per-language.
// `dir: 'rtl'` marks right-to-left languages (Urdu, Arabic).
// New-language meanings are standard dictionary translations of common
// STEM terms; they have not yet been reviewed by native speakers — see
// README "Honest limits".
// ---------------------------------------------------------------------------

export const LANGUAGES = {
  english: {
    label: 'Simple English', native: 'Simple English', dir: 'ltr', lang: 'en',
    question: (cloze) => `Fill in the blank: “${cloze}”`,
    reason: (answer) => `The passage says the missing word is “${answer}”.`,
    intro: 'In simple words:',
    deck: (known, total, index) => `Know ${known} of ${total} · Card ${index} of ${total} · session only`,
    ai: 'Write the explanation and takeaway in simple English, short sentences, Class 9 level.',
  },
  roman: {
    label: 'Roman Urdu', native: 'Roman Urdu', dir: 'ltr', lang: 'ur-Latn',
    question: (cloze) => `Khaali jagah bharein: “${cloze}”`,
    reason: (answer) => `Passage mein khaali jagah par “${answer}” hai.`,
    intro: 'Seedha matlab yeh hai:',
    deck: (known, total, index) => `Know ${known} of ${total} · Card ${index} of ${total} · session only`,
    ai: 'Write the explanation and takeaway in Roman Urdu (Urdu written in Latin letters, as Pakistani students speak it). Keep STEM terms in English where students normally say them in English (current, voltage, resistance).',
  },
  urdu: {
    label: 'Urdu script', native: 'اردو', dir: 'rtl', lang: 'ur',
    question: (cloze) => `خالی جگہ بھریں: “${cloze}”`,
    reason: (answer) => `عبارت میں خالی جگہ پر “${answer}” ہے۔`,
    intro: 'سادہ مطلب یہ ہے:',
    deck: (known, total, index) => `معلوم ${known} از ${total} · کارڈ ${index} از ${total} · صرف اس سیشن کے لیے`,
    ai: 'Write the explanation and takeaway in Urdu script (Nastaliq). Keep STEM terms in English where students normally say them in English.',
  },
  hindi: {
    label: 'Hindi', native: 'हिन्दी', dir: 'ltr', lang: 'hi',
    question: (cloze) => `खाली जगह भरें: “${cloze}”`,
    reason: (answer) => `गद्यांश में खाली जगह पर “${answer}” है।`,
    intro: 'सीधे शब्दों में:',
    deck: (known, total, index) => `${total} में से ${known} जानते हैं · कार्ड ${index} / ${total} · सिर्फ़ इसी सत्र के लिए`,
    ai: 'Write the explanation and takeaway in Hindi (Devanagari script), simple language for a Class 9 student. Keep STEM terms in English where Indian students normally say them in English (current, voltage, resistance).',
  },
  bengali: {
    label: 'Bengali', native: 'বাংলা', dir: 'ltr', lang: 'bn',
    question: (cloze) => `খালি জায়গা পূরণ করুন: “${cloze}”`,
    reason: (answer) => `অনুচ্ছেদে খালি জায়গায় “${answer}” আছে।`,
    intro: 'সহজ কথায়:',
    deck: (known, total, index) => `${total}-এর মধ্যে ${known} জানেন · কার্ড ${index} / ${total} · শুধু এই সেশনের জন্য`,
    ai: 'Write the explanation and takeaway in Bengali (Bengali script), simple language for a Class 9 student. Keep STEM terms in English where Bangladeshi students normally say them in English (current, voltage, resistance).',
  },
  arabic: {
    label: 'Arabic', native: 'العربية', dir: 'rtl', lang: 'ar',
    question: (cloze) => `املأ الفراغ: “${cloze}”`,
    reason: (answer) => `تقول الفقرة إن الكلمة الناقصة هي “${answer}”.`,
    intro: 'بكلمات بسيطة:',
    deck: (known, total, index) => `تعرف ${known} من ${total} · البطاقة ${index} من ${total} · لهذه الجلسة فقط`,
    ai: 'Write the explanation and takeaway in Arabic, simple language for a Grade 9 student. Keep STEM terms in English where students normally say them in English (current, voltage, resistance).',
  },
  spanish: {
    label: 'Spanish', native: 'Español', dir: 'ltr', lang: 'es',
    question: (cloze) => `Completa el espacio en blanco: “${cloze}”`,
    reason: (answer) => `El pasaje dice que la palabra que falta es “${answer}”.`,
    intro: 'En palabras simples:',
    deck: (known, total, index) => `Sabes ${known} de ${total} · Tarjeta ${index} de ${total} · solo para esta sesión`,
    ai: 'Write the explanation and takeaway in Spanish, simple language for a Grade 9 student. Keep STEM terms in English where students normally say them in English (current, voltage, resistance).',
  },
  french: {
    label: 'French', native: 'Français', dir: 'ltr', lang: 'fr',
    question: (cloze) => `Complétez le blanc : “${cloze}”`,
    reason: (answer) => `Le passage dit que le mot manquant est « ${answer} ».`,
    intro: 'En mots simples :',
    deck: (known, total, index) => `Connus : ${known} sur ${total} · Carte ${index} sur ${total} · session seulement`,
    ai: 'Write the explanation and takeaway in French, simple language for a Grade 9 student. Keep STEM terms in English where students normally say them in English (current, voltage, resistance).',
  },
  portuguese: {
    label: 'Portuguese', native: 'Português', dir: 'ltr', lang: 'pt',
    question: (cloze) => `Preencha o espaço em branco: “${cloze}”`,
    reason: (answer) => `O texto diz que a palavra que falta é “${answer}”.`,
    intro: 'Em palavras simples:',
    deck: (known, total, index) => `Você sabe ${known} de ${total} · Cartão ${index} de ${total} · só para esta sessão`,
    ai: 'Write the explanation and takeaway in Portuguese, simple language for a Grade 9 student. Keep STEM terms in English where students normally say them in English (current, voltage, resistance).',
  },
  german: {
    label: 'German', native: 'Deutsch', dir: 'ltr', lang: 'de',
    question: (cloze) => `Fülle die Lücke aus: “${cloze}”`,
    reason: (answer) => `Im Text steht, dass das fehlende Wort „${answer}“ ist.`,
    intro: 'In einfachen Worten:',
    deck: (known, total, index) => `Gewusst: ${known} von ${total} · Karte ${index} von ${total} · nur für diese Sitzung`,
    ai: 'Write the explanation and takeaway in German, simple language for a Grade 9 student. Keep STEM terms in English where students normally say them in English (current, voltage, resistance).',
  },
  turkish: {
    label: 'Turkish', native: 'Türkçe', dir: 'ltr', lang: 'tr',
    question: (cloze) => `Boşluğu doldurun: “${cloze}”`,
    reason: (answer) => `Metinde eksik kelimenin “${answer}” olduğu yazıyor.`,
    intro: 'Basitçe:',
    deck: (known, total, index) => `${total} karttan ${known} tanesini biliyorsunuz · Kart ${index} / ${total} · yalnızca bu oturum için`,
    ai: 'Write the explanation and takeaway in Turkish, simple language for a Grade 9 student. Keep STEM terms in English where students normally say them in English (current, voltage, resistance).',
  },
  indonesian: {
    label: 'Indonesian', native: 'Bahasa Indonesia', dir: 'ltr', lang: 'id',
    question: (cloze) => `Isi bagian yang kosong: “${cloze}”`,
    reason: (answer) => `Bacaan itu mengatakan kata yang hilang adalah “${answer}”.`,
    intro: 'Dengan kata sederhana:',
    deck: (known, total, index) => `Tahu ${known} dari ${total} · Kartu ${index} dari ${total} · hanya untuk sesi ini`,
    ai: 'Write the explanation and takeaway in Indonesian (Bahasa Indonesia), simple language for a Grade 9 student. Keep STEM terms in English where students normally say them in English (current, voltage, resistance).',
  },
  chinese: {
    label: 'Chinese', native: '中文', dir: 'ltr', lang: 'zh',
    question: (cloze) => `填空：“${cloze}”`,
    reason: (answer) => `文章中空缺的词是“${answer}”。`,
    intro: '简单来说：',
    deck: (known, total, index) => `已掌握 ${known} / ${total} · 卡片 ${index} / ${total} · 仅限本次会话`,
    ai: 'Write the explanation and takeaway in Simplified Chinese, simple language for a Grade 9 student. Keep STEM terms in English where students normally say them in English (current, voltage, resistance).',
  },
};

export function languageMeta(language) {
  return LANGUAGES[language] || LANGUAGES.english;
}

export function explainIntro(language) {
  return languageMeta(language).intro;
}

// ---------------------------------------------------------------------------
// Small word lists
// ---------------------------------------------------------------------------

export const STOPWORDS = new Set(
  'a an the and or but if then else when while of in on at to for with by from as is are was were be been being it its this that these those there here what which who whom how why not no yes do does did can could will would should may might must have has had i you he she we they them his her their our your my me him us one two first second also more most other others same such than then so very just only own into over under between through during before after above below up down out off again further once here there all any both each few more most other some such no nor not only own same so than too very can will just don should now'.split(' ')
);

// Verbs / generic words that are not glossary terms on their own.
const GENERIC = new Set(
  'states measured multiplied equals acting flowing connected drives doubling keeping halves overall requires released stored used turn make makes described related simple green tiny called inside while first second gives give given acts act light'.split(' ')
);

const STEM_KEYWORDS = [
  'current', 'voltage', 'resistance', 'resistor', 'circuit', 'battery', 'ohm', 'volt', 'ampere',
  'force', 'mass', 'acceleration', 'velocity', 'speed', 'gravity', 'newton', 'kilogram', 'energy',
  'power', 'work', 'friction', 'momentum', 'pressure', 'temperature', 'heat', 'atom', 'molecule',
  'electron', 'proton', 'neutron', 'cell', 'plant', 'photosynthesis', 'chlorophyll', 'chloroplast',
  'glucose', 'oxygen', 'carbon dioxide', 'stomata', 'enzyme', 'dna', 'gene', 'protein', 'organism',
  'ecosystem', 'climate', 'law', 'equation', 'formula', 'reaction', 'chemical', 'acid', 'base',
  'solution', 'mixture', 'compound', 'element', 'metal', 'wire', 'magnet', 'wave', 'light', 'sound',
  'frequency', 'wavelength', 'orbit', 'planet', 'star', 'solar', 'electric', 'magnetic', 'field',
  'motion', 'distance', 'time', 'volume', 'density', 'liquid', 'gas', 'solid', 'evaporation',
  'condensation', 'radiation', 'conduction', 'convection', 'trolley', 'object', 'soil', 'seed',
  'root', 'leaf', 'flower', 'water', 'hydrogen', 'nitrogen', 'calcium', 'iron', 'copper',
  'triangle', 'hypotenuse', 'square', 'angle', 'theorem', 'nucleus', 'membrane', 'cytoplasm',
  'control',
];
// NOTE: 'side' is deliberately NOT a keyword — it is a substring of
// "inside", which would extract a false term from any passage.

// Checked seed glossary. Roman Urdu spellings are the ones Daim uses in
// class (current = barqi rau, resistance = muzahmat, voltage = barqi dabao,
// force = quwwat, mass = kamiyat, acceleration = isra, energy = tawanai,
// photosynthesis = ziai taleef). Where a term is normally said in English
// in class, the local meaning keeps the English word. If a term is not in
// this seed, the app shows the English meaning only — it never guesses a
// translation.
export const GLOSSARY_SEED = {
  'current': { en: 'The flow of electric charge through a wire, measured in amperes.', roman: 'barqi rau — bijli ka bahao, ampere mein naapa jata hai', urdu: 'برقی رو — بجلی کا بہاؤ، ایمپیئر میں ناپا جاتا ہے', hindi: 'विद्युत धारा — तार से बहने वाला विद्युत आवेश, एम्पीयर में मापा जाता है', bengali: 'বিদ্যুৎ প্রবাহ — তারের মধ্য দিয়ে বৈদ্যুতিক আধানের প্রবাহ, অ্যাম্পিয়ারে মাপা হয়', arabic: 'التيار الكهربائي — تدفق الشحنة الكهربائية عبر سلك، ويُقاس بالأمبير', spanish: 'corriente — el flujo de carga eléctrica por un cable, medido en amperios', french: 'courant — le flux de charge électrique dans un fil, mesuré en ampères', portuguese: 'corrente — o fluxo de carga elétrica por um fio, medido em amperes', german: 'Strom — der Fluss elektrischer Ladung durch einen Draht, gemessen in Ampere', turkish: 'akım — telden geçen elektrik yükü akışı, amper ile ölçülür', indonesian: 'arus — aliran muatan listrik melalui kawat, diukur dalam ampere', chinese: '电流 — 电荷通过导线的流动，以安培为单位' },
  'voltage': { en: 'The push that drives electric current through a circuit, measured in volts.', roman: 'barqi dabao (voltage) — woh dabao jo current ko chalata hai, volt mein', urdu: 'برقی دباؤ (voltage) — وہ دباؤ جو کرنٹ کو چلاتا ہے، وولٹ میں', hindi: 'वोल्टेज — वह दबाव जो सर्किट में धारा को चलाता है, वोल्ट में मापा जाता है', bengali: 'ভোল্টেজ — যে চাপ সার্কিটে বিদ্যুৎ প্রবাহ চালায়, ভোল্টে মাপা হয়', arabic: 'الجهد الكهربائي — القوة التي تدفع التيار عبر الدائرة، وتُقاس بالفولت', spanish: 'voltaje — la fuerza que impulsa la corriente por un circuito, medida en voltios', french: 'tension — la force qui pousse le courant dans un circuit, mesurée en volts', portuguese: 'voltagem — a força que impulsiona a corrente por um circuito, medida em volts', german: 'Spannung — die Kraft, die den Strom durch einen Stromkreis treibt, gemessen in Volt', turkish: 'gerilim — akımı devreden geçiren kuvvet, volt ile ölçülür', indonesian: 'tegangan — dorongan yang menggerakkan arus melalui rangkaian, diukur dalam volt', chinese: '电压 — 推动电流通过电路的力量，以伏特为单位' },
  'resistance': { en: 'How much a material opposes the flow of current, measured in ohms.', roman: 'muzahmat — woh rukawat jo current ko rokti hai, ohm mein', urdu: 'مزاحمت — وہ رکاوٹ جو کرنٹ کو روکتی ہے، اوہم میں', hindi: 'प्रतिरोध — कोई पदार्थ धारा के प्रवाह का कितना विरोध करता है, ओम में मापा जाता है', bengali: 'রোধ — কোনো পদার্থ বিদ্যুৎ প্রবাহকে কতটা বাধা দেয়, ওহমে মাপা হয়', arabic: 'المقاومة — مقدار معارضة المادة لتدفق التيار، وتُقاس بالأوم', spanish: 'resistencia — cuánto se opone un material al paso de la corriente, medida en ohmios', french: 'résistance — la façon dont un matériau s’oppose au passage du courant, mesurée en ohms', portuguese: 'resistência — o quanto um material se opõe à passagem da corrente, medida em ohms', german: 'Widerstand — wie stark ein Material dem Stromfluss entgegenwirkt, gemessen in Ohm', turkish: 'direnç — bir maddenin akıma ne kadar karşı koyduğu, ohm ile ölçülür', indonesian: 'resistansi — seberapa besar suatu bahan melawan aliran arus, diukur dalam ohm', chinese: '电阻 — 材料阻碍电流流动的程度，以欧姆为单位' },
  'resistor': { en: 'A part in a circuit that adds a known resistance.', roman: 'muzahim (resistor) — circuit ka woh hissa jo resistance deta hai', urdu: 'مزاحم (resistor) — سرکٹ کا وہ حصہ جو مزاحمت دیتا ہے', hindi: 'प्रतिरोधक — सर्किट का वह हिस्सा जो एक निश्चित प्रतिरोध देता है', bengali: 'রোধক — সার্কিটের সেই অংশ যা নির্দিষ্ট রোধ যোগ করে', arabic: 'المقاوِم — جزء في الدائرة يضيف مقاومة معروفة', spanish: 'resistor — una parte del circuito que añade una resistencia conocida', french: 'résistance (composant) — une partie du circuit qui ajoute une résistance connue', portuguese: 'resistor — uma parte do circuito que adiciona uma resistência conhecida', german: 'Widerstand (Bauteil) — ein Teil im Stromkreis, der einen bekannten Widerstand hinzufügt', turkish: 'direnç (parça) — devrede bilinen bir direnç ekleyen parça', indonesian: 'resistor — bagian dalam rangkaian yang menambah resistansi tertentu', chinese: '电阻器 — 电路中增加已知电阻的部件' },
  'circuit': { en: 'A closed path that electric current can flow around.', roman: 'circuit — band rasta jis se current guzarta hai', urdu: 'سرکٹ — بند راستہ جس سے کرنٹ گزرتا ہے', hindi: 'सर्किट — बंद रास्ता जिससे धारा बह सकती है', bengali: 'বর্তনী — বন্ধ পথ যার মধ্য দিয়ে বিদ্যুৎ প্রবাহিত হতে পারে', arabic: 'الدائرة الكهربائية — مسار مغلق يمكن للتيار أن يتدفق فيه', spanish: 'circuito — un camino cerrado por el que puede fluir la corriente', french: 'circuit — un chemin fermé dans lequel le courant peut circuler', portuguese: 'circuito — um caminho fechado pelo qual a corrente pode fluir', german: 'Stromkreis — ein geschlossener Weg, durch den Strom fließen kann', turkish: 'devre — akımın akabileceği kapalı yol', indonesian: 'sirkuit — jalur tertutup yang dapat dilalui arus listrik', chinese: '电路 — 电流可以流动的闭合路径' },
  'battery': { en: 'A source that supplies voltage to a circuit.', roman: 'battery — voltage dene wala source', urdu: 'بیٹری — وولٹیج دینے والا ذریعہ', hindi: 'बैटरी — सर्किट को वोल्टेज देने वाला स्रोत', bengali: 'ব্যাটারি — সার্কিটে ভোল্টেজ সরবরাহকারী উৎস', arabic: 'البطارية — مصدر يزوّد الدائرة بالجهد', spanish: 'batería — una fuente que suministra voltaje a un circuito', french: 'pile — une source qui fournit de la tension à un circuit', portuguese: 'bateria — uma fonte que fornece voltagem a um circuito', german: 'Batterie — eine Quelle, die einen Stromkreis mit Spannung versorgt', turkish: 'pil — devreye gerilim sağlayan kaynak', indonesian: 'baterai — sumber yang memasok tegangan ke rangkaian', chinese: '电池 — 为电路提供电压的电源' },
  'force': { en: 'A push or pull that can change how an object moves, measured in newtons.', roman: 'quwwat — dhakka ya khinchav jo harkat badal sakta hai, newton mein', urdu: 'قوت — دھکا یا کھنچاؤ جو حرکت بدل سکتا ہے، نیوٹن میں', hindi: 'बल — धक्का या खिंचाव जो किसी वस्तु की गति बदल सकता है, न्यूटन में मापा जाता है', bengali: 'বল — ধাক্কা বা টান যা কোনো বস্তুর গতি বদলাতে পারে, নিউটনে মাপা হয়', arabic: 'القوة — دفع أو سحب يمكن أن يغيّر حركة جسم، وتُقاس بالنيوتن', spanish: 'fuerza — un empuje o tirón que puede cambiar el movimiento de un objeto, medido en newtons', french: 'force — une poussée ou une traction qui peut changer le mouvement d’un objet, mesurée en newtons', portuguese: 'força — um empurrão ou puxão que pode mudar o movimento de um objeto, medido em newtons', german: 'Kraft — ein Stoß oder Zug, der die Bewegung eines Objekts ändern kann, gemessen in Newton', turkish: 'kuvvet — bir cismin hareketini değiştirebilen itme veya çekme, newton ile ölçülür', indonesian: 'gaya — dorongan atau tarikan yang dapat mengubah gerak suatu benda, diukur dalam newton', chinese: '力 — 可以改变物体运动的推力或拉力，以牛顿为单位' },
  'mass': { en: 'How much matter an object contains, measured in kilograms.', roman: 'kamiyat (mass) — kisi cheez mein kitna maddeh hai, kilogram mein', urdu: 'کمیت (mass) — کسی چیز میں کتنا مادہ ہے، کلوگرام میں', hindi: 'द्रव्यमान — किसी वस्तु में कितना पदार्थ है, किलोग्राम में मापा जाता है', bengali: 'ভর — কোনো বস্তুতে কতটা পদার্থ আছে, কিলোগ্রামে মাপা হয়', arabic: 'الكتلة — مقدار المادة في الجسم، وتُقاس بالكيلوغرام', spanish: 'masa — cuánta materia contiene un objeto, medida en kilogramos', french: 'masse — la quantité de matière d’un objet, mesurée en kilogrammes', portuguese: 'massa — quanta matéria um objeto contém, medida em quilogramas', german: 'Masse — wie viel Materie ein Objekt enthält, gemessen in Kilogramm', turkish: 'kütle — bir cismin ne kadar madde içerdiği, kilogram ile ölçülür', indonesian: 'massa — seberapa banyak materi dalam suatu benda, diukur dalam kilogram', chinese: '质量 — 物体所含物质的多少，以千克为单位' },
  'acceleration': { en: 'How quickly velocity changes, measured in metres per second squared.', roman: 'isra (acceleration) — raftaar kitni jaldi badalti hai', urdu: 'اسراع (acceleration) — رفتار کتنی جلدی بدلتی ہے', hindi: 'त्वरण — वेग कितनी जल्दी बदलता है, मीटर प्रति सेकंड वर्ग में मापा जाता है', bengali: 'ত্বরণ — বেগ কত দ্রুত বদলায়, মিটার প্রতি সেকেন্ড বর্গে মাপা হয়', arabic: 'التسارع — سرعة تغيّر السرعة، ويُقاس بالمتر لكل ثانية مربعة', spanish: 'aceleración — qué tan rápido cambia la velocidad, medida en metros por segundo al cuadrado', french: 'accélération — la rapidité avec laquelle la vitesse change, mesurée en mètres par seconde carrée', portuguese: 'aceleração — quão rápido a velocidade muda, medida em metros por segundo ao quadrado', german: 'Beschleunigung — wie schnell sich die Geschwindigkeit ändert, gemessen in Metern pro Sekunde zum Quadrat', turkish: 'ivme — hızın ne kadar hızlı değiştiği, metre/saniye kare ile ölçülür', indonesian: 'percepatan — seberapa cepat kecepatan berubah, diukur dalam meter per detik kuadrat', chinese: '加速度 — 速度变化的快慢，以米每二次方秒为单位' },
  'energy': { en: 'The ability to do work or cause change.', roman: 'tawanai — kaam karne ki salahiyat', urdu: 'توانائی — کام کرنے کی صلاحیت', hindi: 'ऊर्जा — काम करने या बदलाव लाने की क्षमता', bengali: 'শক্তি — কাজ করার বা পরিবর্তন ঘটানোর ক্ষমতা', arabic: 'الطاقة — القدرة على إنجاز شغل أو إحداث تغيير', spanish: 'energía — la capacidad de realizar trabajo o producir un cambio', french: 'énergie — la capacité à effectuer un travail ou à provoquer un changement', portuguese: 'energia — a capacidade de realizar trabalho ou causar mudança', german: 'Energie — die Fähigkeit, Arbeit zu verrichten oder Veränderung zu bewirken', turkish: 'enerji — iş yapma veya değişikliğe yol açma yeteneği', indonesian: 'energi — kemampuan untuk melakukan kerja atau menyebabkan perubahan', chinese: '能量 — 做功或引起变化的能力' },
  'photosynthesis': { en: 'How green plants make food from sunlight, water and carbon dioxide.', roman: 'ziai taleef — hare poday roshni, paani aur carbon dioxide se khana banate hain', urdu: 'ضیائی تالیف — ہرے پودے روشنی، پانی اور کاربن ڈائی آکسائیڈ سے کھانا بناتے ہیں', hindi: 'प्रकाश संश्लेषण — हरे पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड से भोजन कैसे बनाते हैं', bengali: 'সালোকসংশ্লেষণ — সবুজ উদ্ভিদ সূর্যের আলো, পানি ও কার্বন ডাই-অক্সাইড থেকে কীভাবে খাবার তৈরি করে', arabic: 'التمثيل الضوئي — كيف تصنع النباتات الخضراء غذاءها من ضوء الشمس والماء وثاني أكسيد الكربون', spanish: 'fotosíntesis — cómo las plantas verdes elaboran su alimento a partir de la luz solar, el agua y el dióxido de carbono', french: 'photosynthèse — la façon dont les plantes vertes fabriquent leur nourriture à partir de la lumière du soleil, de l’eau et du dioxyde de carbone', portuguese: 'fotossíntese — como as plantas verdes produzem seu alimento a partir da luz solar, da água e do dióxido de carbono', german: 'Photosynthese — wie grüne Pflanzen aus Sonnenlicht, Wasser und Kohlenstoffdioxid Nahrung herstellen', turkish: 'fotosentez — yeşil bitkilerin güneş ışığı, su ve karbondioksitten besin üretmesi', indonesian: 'fotosintesis — cara tumbuhan hijau membuat makanan dari sinar matahari, air, dan karbon dioksida', chinese: '光合作用 — 绿色植物利用阳光、水和二氧化碳制造养分的过程' },
  'chlorophyll': { en: 'The green pigment in leaves that absorbs sunlight.', roman: 'chlorophyll — patton mein sabz rang jo roshni jazb karta hai', urdu: 'کلوروفل — پتوں میں سبز رنگ جو روشنی جذب کرتا ہے', hindi: 'क्लोरोफ़िल — पत्तियों में हरा रंग जो सूर्य का प्रकाश सोखता है', bengali: 'ক্লোরোফিল — পাতায় থাকা সবুজ রঞ্জক যা সূর্যের আলো শোষণ করে', arabic: 'الكلوروفيل — الصبغة الخضراء في الأوراق التي تمتص ضوء الشمس', spanish: 'clorofila — el pigmento verde de las hojas que absorbe la luz solar', french: 'chlorophylle — le pigment vert des feuilles qui absorbe la lumière du soleil', portuguese: 'clorofila — o pigmento verde das folhas que absorve a luz solar', german: 'Chlorophyll — der grüne Farbstoff in Blättern, der Sonnenlicht aufnimmt', turkish: 'klorofil — yapraklardaki güneş ışığını emen yeşil pigment', indonesian: 'klorofil — pigmen hijau pada daun yang menyerap sinar matahari', chinese: '叶绿素 — 叶片中吸收阳光的绿色色素' },
  'chloroplast': { en: 'The part of a plant cell where photosynthesis happens.', roman: 'chloroplast — poday ke cell ka woh hissa jahan photosynthesis hoti hai', urdu: 'کلوروپلاسٹ — پودے کے خلیے کا وہ حصہ جہاں ضیائی تالیف ہوتی ہے', hindi: 'क्लोरोप्लास्ट — पौधे की कोशिका का वह हिस्सा जहाँ प्रकाश संश्लेषण होता है', bengali: 'ক্লোরোপ্লাস্ট — উদ্ভিদ কোষের সেই অংশ যেখানে সালোকসংশ্লেষণ ঘটে', arabic: 'البلاستيدة الخضراء — جزء الخلية النباتية الذي يحدث فيه التمثيل الضوئي', spanish: 'cloroplasto — la parte de la célula vegetal donde ocurre la fotosíntesis', french: 'chloroplaste — la partie de la cellule végétale où a lieu la photosynthèse', portuguese: 'cloroplasto — a parte da célula vegetal onde ocorre a fotossíntese', german: 'Chloroplast — der Teil einer Pflanzenzelle, in dem die Photosynthese stattfindet', turkish: 'kloroplast — bitki hücresinin fotosentezin gerçekleştiği kısmı', indonesian: 'kloroplas — bagian sel tumbuhan tempat fotosintesis terjadi', chinese: '叶绿体 — 植物细胞中进行光合作用的部分' },
  'chloroplasts': { en: 'The parts of a plant cell where photosynthesis happens.', roman: 'chloroplasts — poday ke cell ke woh hisse jahan photosynthesis hoti hai', urdu: 'کلوروپلاسٹ — پودے کے خلیے کے وہ حصے جہاں ضیائی تالیف ہوتی ہے', hindi: 'क्लोरोप्लास्ट — पौधे की कोशिका के वे हिस्से जहाँ प्रकाश संश्लेषण होता है', bengali: 'ক্লোরোপ্লাস্ট — উদ্ভিদ কোষের সেই অংশগুলো যেখানে সালোকসংশ্লেষণ ঘটে', arabic: 'البلاستيدات الخضراء — أجزاء الخلية النباتية التي يحدث فيها التمثيل الضوئي', spanish: 'cloroplastos — las partes de la célula vegetal donde ocurre la fotosíntesis', french: 'chloroplastes — les parties de la cellule végétale où a lieu la photosynthèse', portuguese: 'cloroplastos — as partes da célula vegetal onde ocorre a fotossíntese', german: 'Chloroplasten — die Teile einer Pflanzenzelle, in denen die Photosynthese stattfindet', turkish: 'kloroplastlar — bitki hücresinin fotosentezin gerçekleştiği kısımları', indonesian: 'kloroplas — bagian-bagian sel tumbuhan tempat fotosintesis terjadi', chinese: '叶绿体 — 植物细胞中进行光合作用的部分' },
  'glucose': { en: 'A simple sugar plants make in photosynthesis; food for the plant.', roman: 'glucose — woh cheeni jo poday photosynthesis mein banate hain', urdu: 'گلوکوز — وہ چینی جو پودے ضیائی تالیف میں بناتے ہیں', hindi: 'ग्लूकोज़ — वह साधारण चीनी जो पौधे प्रकाश संश्लेषण में बनाते हैं; पौधे का भोजन', bengali: 'গ্লুকোজ — সালোকসংশ্লেষণে উদ্ভিদের তৈরি সরল শর্করা; উদ্ভিদের খাবার', arabic: 'الغلوكوز — سكر بسيط تصنعه النباتات في التمثيل الضوئي؛ غذاء النبات', spanish: 'glucosa — un azúcar simple que las plantas elaboran en la fotosíntesis; alimento para la planta', french: 'glucose — un sucre simple que les plantes fabriquent lors de la photosynthèse ; nourriture pour la plante', portuguese: 'glicose — um açúcar simples que as plantas produzem na fotossíntese; alimento para a planta', german: 'Glukose — ein einfacher Zucker, den Pflanzen bei der Photosynthese herstellen; Nahrung für die Pflanze', turkish: 'glikoz — bitkilerin fotosentezde ürettiği basit şeker; bitkinin besini', indonesian: 'glukosa — gula sederhana yang dibuat tumbuhan dalam fotosintesis; makanan bagi tumbuhan', chinese: '葡萄糖 — 植物在光合作用中制造的简单糖分，是植物的养分' },
  'oxygen': { en: 'A gas released by plants in photosynthesis; the gas we breathe in.', roman: 'oxygen — woh gas jo poday chorte hain, aur hum saans mein lete hain', urdu: 'آکسیجن — وہ گیس جو پودے چھوڑتے ہیں، اور ہم سانس میں لیتے ہیں', hindi: 'ऑक्सीजन — वह गैस जो पौधे प्रकाश संश्लेषण में छोड़ते हैं; वही गैस जो हम साँस में लेते हैं', bengali: 'অক্সিজেন — সালোকসংশ্লেষণে উদ্ভিদের ছাড়া গ্যাস; যে গ্যাস আমরা শ্বাসে নিই', arabic: 'الأكسجين — غاز تطلقه النباتات في التمثيل الضوئي؛ الغاز الذي نتنفسه', spanish: 'oxígeno — un gas que las plantas liberan en la fotosíntesis; el gas que respiramos', french: 'oxygène — un gaz libéré par les plantes lors de la photosynthèse ; le gaz que nous respirons', portuguese: 'oxigênio — um gás liberado pelas plantas na fotossíntese; o gás que respiramos', german: 'Sauerstoff — ein Gas, das Pflanzen bei der Photosynthese abgeben; das Gas, das wir einatmen', turkish: 'oksijen — bitkilerin fotosentezde saldığı gaz; soluduğumuz gaz', indonesian: 'oksigen — gas yang dilepas tumbuhan dalam fotosintesis; gas yang kita hirup', chinese: '氧气 — 植物在光合作用中释放的气体，也是我们吸入的气体' },
  'carbon dioxide': { en: 'A gas in the air that plants take in for photosynthesis.', roman: 'carbon dioxide — hawa ki woh gas jo poday photosynthesis ke liye lete hain', urdu: 'کاربن ڈائی آکسائیڈ — ہوا کی وہ گیس جو پودے ضیائی تالیف کے لیے لیتے ہیں', hindi: 'कार्बन डाइऑक्साइड — हवा की वह गैस जो पौधे प्रकाश संश्लेषण के लिए लेते हैं', bengali: 'কার্বন ডাই-অক্সাইড — বাতাসের সেই গ্যাস যা উদ্ভিদ সালোকসংশ্লেষণের জন্য নেয়', arabic: 'ثاني أكسيد الكربون — غاز في الهواء تأخذه النباتات للتمثيل الضوئي', spanish: 'dióxido de carbono — un gas del aire que las plantas toman para la fotosíntesis', french: 'dioxyde de carbone — un gaz de l’air que les plantes absorbent pour la photosynthèse', portuguese: 'dióxido de carbono — um gás do ar que as plantas absorvem para a fotossíntese', german: 'Kohlenstoffdioxid — ein Gas aus der Luft, das Pflanzen für die Photosynthese aufnehmen', turkish: 'karbondioksit — bitkilerin fotosentez için havadan aldığı gaz', indonesian: 'karbon dioksida — gas di udara yang diserap tumbuhan untuk fotosintesis', chinese: '二氧化碳 — 空气中供植物光合作用吸收的气体' },
  'water': { en: 'The liquid plants take from the soil for photosynthesis.', roman: 'paani — woh liquid jo poday mitti se lete hain', urdu: 'پانی — وہ مائع جو پودے مٹی سے لیتے ہیں', hindi: 'पानी — वह तरल जो पौधे मिट्टी से प्रकाश संश्लेषण के लिए लेते हैं', bengali: 'পানি — সেই তরল যা উদ্ভিদ মাটি থেকে সালোকসংশ্লেষণের জন্য নেয়', arabic: 'الماء — السائل الذي تأخذه النباتات من التربة للتمثيل الضوئي', spanish: 'agua — el líquido que las plantas toman del suelo para la fotosíntesis', french: 'eau — le liquide que les plantes prennent dans le sol pour la photosynthèse', portuguese: 'água — o líquido que as plantas retiram do solo para a fotossíntese', german: 'Wasser — die Flüssigkeit, die Pflanzen aus dem Boden für die Photosynthese aufnehmen', turkish: 'su — bitkilerin fotosentez için topraktan aldığı sıvı', indonesian: 'air — cairan yang diserap tumbuhan dari tanah untuk fotosintesis', chinese: '水 — 植物从土壤中吸收用于光合作用的液体' },
  'sunlight': { en: 'Light from the sun; the energy source for photosynthesis.', roman: 'suraj ki roshni — photosynthesis ke liye tawanai ka zariya', urdu: 'سورج کی روشنی — ضیائی تالیف کے لیے توانائی کا ذریعہ', hindi: 'सूरज की रोशनी — सूर्य का प्रकाश; प्रकाश संश्लेषण के लिए ऊर्जा का स्रोत', bengali: 'সূর্যের আলো — সূর্য থেকে আসা আলো; সালোকসংশ্লেষণের শক্তির উৎস', arabic: 'ضوء الشمس — ضوء يأتي من الشمس؛ مصدر الطاقة للتمثيل الضوئي', spanish: 'luz solar — la luz del sol; la fuente de energía de la fotosíntesis', french: 'lumière du soleil — la lumière venant du soleil ; la source d’énergie de la photosynthèse', portuguese: 'luz solar — a luz do sol; a fonte de energia da fotossíntese', german: 'Sonnenlicht — Licht von der Sonne; die Energiequelle der Photosynthese', turkish: 'güneş ışığı — güneşten gelen ışık; fotosentezin enerji kaynağı', indonesian: 'sinar matahari — cahaya dari matahari; sumber energi untuk fotosintesis', chinese: '阳光 — 来自太阳的光，是光合作用的能量来源' },
  'light': { en: 'The part of the sun’s energy that plants and eyes can use.', roman: 'roshni — suraj ki tawanai', urdu: 'روشنی — سورج کی توانائی', hindi: 'रोशनी — सूर्य की ऊर्जा का वह हिस्सा जिसका उपयोग पौधे और आँखें कर सकते हैं', bengali: 'আলো — সূর্যের শক্তির সেই অংশ যা উদ্ভিদ ও চোখ ব্যবহার করতে পারে', arabic: 'الضوء — جزء طاقة الشمس الذي يمكن للنباتات والعيون استخدامه', spanish: 'luz — la parte de la energía del sol que las plantas y los ojos pueden usar', french: 'lumière — la partie de l’énergie du soleil que les plantes et les yeux peuvent utiliser', portuguese: 'luz — a parte da energia do sol que as plantas e os olhos podem usar', german: 'Licht — der Teil der Sonnenenergie, den Pflanzen und Augen nutzen können', turkish: 'ışık — güneş enerjisinin bitkilerin ve gözlerin kullanabildiği kısmı', indonesian: 'cahaya — bagian energi matahari yang dapat digunakan tumbuhan dan mata', chinese: '光 — 植物和眼睛可以利用的那部分太阳能' },
  'plant': { en: 'A living thing that grows in soil and can make its own food.', roman: 'poda — zinda cheez jo mitti mein ugta hai', urdu: 'پودا — زندہ چیز جو مٹی میں اگتا ہے', hindi: 'पौधा — जीवित चीज़ जो मिट्टी में उगती है और अपना भोजन खुद बना सकती है', bengali: 'উদ্ভিদ — জীবন্ত জিনিস যা মাটিতে জন্মায় এবং নিজের খাবার নিজে তৈরি করতে পারে', arabic: 'النبات — كائن حي ينمو في التربة ويمكنه صنع غذائه بنفسه', spanish: 'planta — un ser vivo que crece en el suelo y puede elaborar su propio alimento', french: 'plante — un être vivant qui pousse dans le sol et peut fabriquer sa propre nourriture', portuguese: 'planta — um ser vivo que cresce no solo e pode produzir seu próprio alimento', german: 'Pflanze — ein Lebewesen, das im Boden wächst und seine Nahrung selbst herstellen kann', turkish: 'bitki — toprakta büyüyen ve kendi besinini üretebilen canlı', indonesian: 'tumbuhan — makhluk hidup yang tumbuh di tanah dan dapat membuat makanannya sendiri', chinese: '植物 — 生长在土壤中、能自己制造养分的生物' },
  'stomata': { en: 'Tiny pores in a leaf that let gases in and out.', roman: 'stomata — patte ke chote surakh jin se gas andar bahar jati hai', urdu: 'سٹومیٹا — پتے کے چھوٹے سوراخ جن سے گیس اندر باہر جاتی ہے', hindi: 'रंध्र — पत्ते के छोटे छिद्र जिनसे गैस अंदर-बाहर जाती है', bengali: 'পত্ররন্ধ্র — পাতার ছোট ছিদ্র যা দিয়ে গ্যাস ভেতরে-বাইরে যায়', arabic: 'الثغور — مسام صغيرة في الورقة تسمح بدخول الغازات وخروجها', spanish: 'estomas — poros diminutos de una hoja que dejan entrar y salir gases', french: 'stomates — de minuscules pores d’une feuille qui laissent entrer et sortir les gaz', portuguese: 'estômatos — poros minúsculos de uma folha que deixam os gases entrar e sair', german: 'Stomata — winzige Poren in einem Blatt, durch die Gase ein- und austreten', turkish: 'stoma — yapraktaki gazların girip çıkmasını sağlayan minik gözenekler', indonesian: 'stomata — pori-pori kecil pada daun yang membiarkan gas masuk dan keluar', chinese: '气孔 — 叶片上让气体进出的微小孔' },
  'temperature': { en: 'How hot or cold something is.', roman: 'darja hararat — kisi cheez ka garam ya thanda hona', urdu: 'درجہ حرارت — کسی چیز کا گرم یا ٹھنڈا ہونا', hindi: 'तापमान — कोई चीज़ कितनी गर्म या ठंडी है', bengali: 'তাপমাত্রা — কোনো জিনিস কতটা গরম বা ঠান্ডা', arabic: 'درجة الحرارة — مدى سخونة شيء ما أو برودته', spanish: 'temperatura — qué tan caliente o fría está una cosa', french: 'température — le degré de chaleur ou de froid d’une chose', portuguese: 'temperatura — o quão quente ou fria uma coisa está', german: 'Temperatur — wie heiß oder kalt etwas ist', turkish: 'sıcaklık — bir şeyin ne kadar sıcak veya soğuk olduğu', indonesian: 'suhu — seberapa panas atau dinginnya sesuatu', chinese: '温度 — 某物有多热或多冷' },
  'wire': { en: 'A thin metal thread that carries current.', roman: 'taar — patli dhaat jo current le jati hai', urdu: 'تار — پتلی دھات جو کرنٹ لے جاتی ہے', hindi: 'तार — पतली धातु जो धारा ले जाती है', bengali: 'তার — পাতলা ধাতু যা বিদ্যুৎ বহন করে', arabic: 'السلك — خيط معدني رفيع يحمل التيار', spanish: 'cable — un hilo fino de metal que transporta la corriente', french: 'fil — un fin fil de métal qui transporte le courant', portuguese: 'fio — um fio fino de metal que transporta a corrente', german: 'Draht — ein dünner Metallfaden, der Strom leitet', turkish: 'tel — akımı taşıyan ince metal iplik', indonesian: 'kawat — benang logam tipis yang membawa arus', chinese: '导线 — 传导电流的细金属线' },
  'object': { en: 'A thing that a force can act on.', roman: 'cheez / jism — woh cheez jis par quwwat lag sakti hai', urdu: 'چیز / جسم — وہ چیز جس پر قوت لگ سکتی ہے', hindi: 'वस्तु — वह चीज़ जिस पर बल लग सकता है', bengali: 'বস্তু — সেই জিনিস যার ওপর বল কাজ করতে পারে', arabic: 'الجسم — شيء يمكن أن تؤثر عليه قوة', spanish: 'objeto — una cosa sobre la que puede actuar una fuerza', french: 'objet — une chose sur laquelle une force peut agir', portuguese: 'objeto — uma coisa sobre a qual uma força pode agir', german: 'Objekt — ein Ding, auf das eine Kraft wirken kann', turkish: 'cisim — üzerine kuvvet etki edebilen şey', indonesian: 'benda — sesuatu yang dapat dikenai gaya', chinese: '物体 — 可以受力作用的东西' },
  'trolley': { en: 'A small wheeled cart used in the example.', roman: 'trolley — misaal mein choti pahiyon wali gari', urdu: 'ٹرالی — مثال میں چھوٹی پہیوں والی گاڑی', hindi: 'ट्रॉली — उदाहरण में इस्तेमाल होने वाली छोटी पहियों वाली गाड़ी', bengali: 'ট্রলি — উদাহরণে ব্যবহৃত ছোট চাকার গাড়ি', arabic: 'العربة — عربة صغيرة ذات عجلات تُستخدم في المثال', spanish: 'carrito — un pequeño carro con ruedas usado en el ejemplo', french: 'chariot — un petit chariot à roues utilisé dans l’exemple', portuguese: 'carrinho — um pequeno carrinho com rodas usado no exemplo', german: 'Wagen — ein kleiner Wagen mit Rädern, der im Beispiel verwendet wird', turkish: 'araba — örnekte kullanılan tekerlekli küçük araba', indonesian: 'troli — kereta kecil beroda yang digunakan dalam contoh', chinese: '小车 — 例子中使用的小轮车' },
  'law': { en: 'A rule that describes how nature behaves, tested many times.', roman: 'qanoon — qudrat ka woh usool jo baar baar aazmaya gaya ho', urdu: 'قانون — قدرت کا وہ اصول جو بار بار آزمایا گیا ہو', hindi: 'नियम — वह सिद्धांत जो बताता है कि प्रकृति कैसे व्यवहार करती है, कई बार परखा गया', bengali: 'সূত্র — যে নিয়ম বলে প্রকৃতি কীভাবে আচরণ করে, বহুবার পরীক্ষিত', arabic: 'القانون — قاعدة تصف سلوك الطبيعة، وقد اختُبرت مرات عديدة', spanish: 'ley — una regla que describe cómo se comporta la naturaleza, comprobada muchas veces', french: 'loi — une règle qui décrit le comportement de la nature, vérifiée de nombreuses fois', portuguese: 'lei — uma regra que descreve como a natureza se comporta, testada muitas vezes', german: 'Gesetz — eine Regel, die beschreibt, wie sich die Natur verhält, vielfach geprüft', turkish: 'yasa — doğanın nasıl davrandığını açıklayan, birçok kez test edilmiş kural', indonesian: 'hukum — aturan yang menjelaskan cara alam berperilaku, telah diuji berkali-kali', chinese: '定律 — 描述自然规律、经过多次检验的规则' },
  'newton': { en: 'The unit of force.', roman: 'newton — quwwat ki unit', urdu: 'نیوٹن — قوت کی اکائی', hindi: 'न्यूटन — बल की इकाई', bengali: 'নিউটন — বলের একক', arabic: 'النيوتن — وحدة القوة', spanish: 'newton — la unidad de fuerza', french: 'newton — l’unité de force', portuguese: 'newton — a unidade de força', german: 'Newton — die Einheit der Kraft', turkish: 'newton — kuvvet birimi', indonesian: 'newton — satuan gaya', chinese: '牛顿 — 力的单位' },
  'newtons': { en: 'The unit of force.', roman: 'newton — quwwat ki unit', urdu: 'نیوٹن — قوت کی اکائی', hindi: 'न्यूटन — बल की इकाई', bengali: 'নিউটন — বলের একক', arabic: 'النيوتن — وحدة القوة', spanish: 'newtons — la unidad de fuerza', french: 'newtons — l’unité de force', portuguese: 'newtons — a unidade de força', german: 'Newton — die Einheit der Kraft', turkish: 'newton — kuvvet birimi', indonesian: 'newton — satuan gaya', chinese: '牛顿 — 力的单位' },
  'food': { en: 'What a plant makes for itself to grow.', roman: 'khana — jo poda apne liye banata hai', urdu: 'خوراک — جو پودا اپنے لیے بناتا ہے', hindi: 'भोजन — जो पौधा अपने बढ़ने के लिए खुद बनाता है', bengali: 'খাবার — উদ্ভিদ যা নিজের বৃদ্ধির জন্য নিজে তৈরি করে', arabic: 'الغذاء — ما يصنعه النبات لنفسه لينمو', spanish: 'alimento — lo que una planta elabora para sí misma para crecer', french: 'nourriture — ce qu’une plante fabrique pour elle-même afin de grandir', portuguese: 'alimento — o que uma planta produz para si mesma para crescer', german: 'Nahrung — was eine Pflanze für sich selbst zum Wachsen herstellt', turkish: 'besin — bitkinin büyümesi için kendisi ürettiği şey', indonesian: 'makanan — apa yang dibuat tumbuhan untuk dirinya sendiri agar tumbuh', chinese: '养分 — 植物为生长而自己制造的东西' },
  'growth': { en: 'Getting bigger; what glucose is used for.', roman: 'barhna — glucose isi kaam aata hai', urdu: 'بڑھنا — گلوکوز اسی کام آتا ہے', hindi: 'वृद्धि — बड़ा होना; ग्लूकोज़ इसी काम आता है', bengali: 'বৃদ্ধি — বড় হওয়া; গ্লুকোজ এই কাজে ব্যবহৃত হয়', arabic: 'النمو — أن يكبر الشيء؛ الغلوكوز يُستخدم لهذا الغرض', spanish: 'crecimiento — hacerse más grande; para eso se usa la glucosa', french: 'croissance — le fait de grandir ; c’est à cela que sert le glucose', portuguese: 'crescimento — ficar maior; é para isso que serve a glicose', german: 'Wachstum — größer werden; dafür wird Glukose verwendet', turkish: 'büyüme — büyümek; glikoz bunun için kullanılır', indonesian: 'pertumbuhan — menjadi lebih besar; glukosa digunakan untuk itu', chinese: '生长 — 变大；葡萄糖就是用于此' },
  'starch': { en: 'Stored food in a plant.', roman: 'starch — poday mein mehfooz khana', urdu: 'نشاستہ — پودے میں محفوظ خوراک', hindi: 'स्टार्च — पौधे में संचित भोजन', bengali: 'শ্বেতসার — উদ্ভিদে সঞ্চিত খাবার', arabic: 'النشا — غذاء مخزّن في النبات', spanish: 'almidón — alimento almacenado en una planta', french: 'amidon — la nourriture stockée dans une plante', portuguese: 'amido — alimento armazenado em uma planta', german: 'Stärke — gespeicherte Nahrung in einer Pflanze', turkish: 'nişasta — bitkide depolanan besin', indonesian: 'pati — makanan yang disimpan dalam tumbuhan', chinese: '淀粉 — 储存在植物体内的养分' },
  'reaction': { en: 'A change in which substances turn into other substances.', roman: 'reaction — tabdeeli jis mein ek cheez doosri ban jati hai', urdu: 'تعامل — تبدیلی جس میں ایک چیز دوسری بن جاتی ہے', hindi: 'अभिक्रिया — वह बदलाव जिसमें एक पदार्थ दूसरे पदार्थ में बदल जाता है', bengali: 'বিক্রিয়া — পরিবর্তন যাতে এক পদার্থ অন্য পদার্থে পরিণত হয়', arabic: 'التفاعل — تغيّر تتحول فيه مادة إلى مادة أخرى', spanish: 'reacción — un cambio en el que unas sustancias se transforman en otras', french: 'réaction — un changement dans lequel des substances se transforment en d’autres', portuguese: 'reação — uma mudança na qual substâncias se transformam em outras', german: 'Reaktion — eine Veränderung, bei der Stoffe in andere Stoffe übergehen', turkish: 'tepkime — maddelerin başka maddelere dönüştüğü değişim', indonesian: 'reaksi — perubahan ketika suatu zat berubah menjadi zat lain', chinese: '反应 — 物质转变为其他物质的变化' },
  // Added 21 Nov evening for the two new samples (Pythagoras, cells).
  'triangle': { en: 'A shape with three straight sides and three angles.', roman: 'trikon — teen seedhi sides aur teen angles wali shakal', urdu: 'مثلث — تین سیدھی بھجاؤں اور تین زاویوں والی شکل', hindi: 'त्रिभुज — तीन सीधी भुजाओं और तीन कोणों वाली आकृति', bengali: 'ত্রিভুজ — তিনটি সরল বাহু ও তিনটি কোণ বিশিষ্ট আকৃতি', arabic: 'المثلث — شكل له ثلاثة أضلاع مستقيمة وثلاث زوايا', spanish: 'triángulo — una figura con tres lados rectos y tres ángulos', french: 'triangle — une figure à trois côtés droits et trois angles', portuguese: 'triângulo — uma figura com três lados retos e três ângulos', german: 'Dreieck — eine Figur mit drei geraden Seiten und drei Winkeln', turkish: 'üçgen — üç düz kenarı ve üç açısı olan şekil', indonesian: 'segitiga — bangun dengan tiga sisi lurus dan tiga sudut', chinese: '三角形 — 有三条直边和三个角的图形' },
  'hypotenuse': { en: 'The longest side of a right-angled triangle, opposite the right angle.', roman: 'hypotenuse — right-angled triangle ki sab se lambi side, right angle ke samne', urdu: 'وتر — قائم الزاویہ مثلث کی سب سے لمبی بھجا، قائم زاویے کے سامنے', hindi: 'कर्ण — समकोण त्रिभुज की सबसे लंबी भुजा, समकोण के सामने', bengali: 'অতিভুজ — সমকোণী ত্রিভুজের সবচেয়ে লম্বা বাহু, সমকোণের বিপরীতে', arabic: 'الوتر — أطول ضلع في مثلث قائم الزاوية، مقابل للزاوية القائمة', spanish: 'hipotenusa — el lado más largo de un triángulo rectángulo, opuesto al ángulo recto', french: 'hypoténuse — le côté le plus long d’un triangle rectangle, opposé à l’angle droit', portuguese: 'hipotenusa — o lado mais longo de um triângulo retângulo, oposto ao ângulo reto', german: 'Hypotenuse — die längste Seite eines rechtwinkligen Dreiecks, gegenüber dem rechten Winkel', turkish: 'hipotenüs — dik üçgenin en uzun kenarı, dik açının karşısında', indonesian: 'hipotenusa — sisi terpanjang segitiga siku-siku, berhadapan dengan sudut siku-siku', chinese: '斜边 — 直角三角形中最长的边，与直角相对' },
  'square': { en: 'A number multiplied by itself; also the square of a side in the theorem.', roman: 'square — kisi number ko khud se zarb dena', urdu: 'مربع — کسی عدد کو خود سے ضرب دینا', hindi: 'वर्ग — किसी संख्या को स्वयं से गुणा करना', bengali: 'বর্গ — কোনো সংখ্যাকে নিজে দিয়ে গুণ করা', arabic: 'المربع — عدد مضروب في نفسه', spanish: 'cuadrado — un número multiplicado por sí mismo', french: 'carré — un nombre multiplié par lui-même', portuguese: 'quadrado — um número multiplicado por ele mesmo', german: 'Quadrat — eine Zahl, die mit sich selbst multipliziert wird', turkish: 'kare — bir sayının kendisiyle çarpımı', indonesian: 'kuadrat — suatu bilangan dikalikan dengan dirinya sendiri', chinese: '平方 — 一个数乘以它本身' },
  'angle': { en: 'The space between two lines that meet; a right angle is 90 degrees.', roman: 'angle — do lines ke milne se banne wala kona; right angle 90 degrees hota hai', urdu: 'زاویہ — دو خطوں کے ملنے سے بننے والا کونہ؛ قائم زاویہ 90 درجے ہوتا ہے', hindi: 'कोण — दो रेखाओं के मिलने से बना कोना; समकोण 90 डिग्री का होता है', bengali: 'কোণ — দুটি রেখার মিলনে তৈরি কোণ; সমকোণ 90 ডিগ্রি', arabic: 'الزاوية — الفراغ بين خطين يلتقيان؛ الزاوية القائمة 90 درجة', spanish: 'ángulo — el espacio entre dos líneas que se encuentran; un ángulo recto mide 90 grados', french: 'angle — l’espace entre deux lignes qui se rencontrent ; un angle droit mesure 90 degrés', portuguese: 'ângulo — o espaço entre duas linhas que se encontram; um ângulo reto mede 90 graus', german: 'Winkel — der Raum zwischen zwei sich treffenden Linien; ein rechter Winkel misst 90 Grad', turkish: 'açı — kesişen iki çizgi arasındaki boşluk; dik açı 90 derecedir', indonesian: 'sudut — ruang antara dua garis yang bertemu; sudut siku-siku adalah 90 derajat', chinese: '角 — 两条相交直线之间的空间；直角为 90 度' },
  'theorem': { en: 'A rule in maths that has been proved, like Pythagoras’ theorem.', roman: 'theorem — maths ka woh usool jo sabit ho chuka ho, jaise Pythagoras ka theorem', urdu: 'مسئلہ — ریاضی کا وہ اصول جو ثابت ہو چکا ہو، جیسے فیثاغورث کا مسئلہ', hindi: 'प्रमेय — गणित का वह नियम जो सिद्ध हो चुका हो, जैसे पाइथागोरस का प्रमेय', bengali: 'উপপাদ্য — গণিতের সেই নিয়ম যা প্রমাণিত, যেমন পিথাগোরাসের উপপাদ্য', arabic: 'النظرية — قاعدة في الرياضيات تم إثباتها، مثل نظرية فيثاغورس', spanish: 'teorema — una regla de matemáticas que ha sido demostrada, como el teorema de Pitágoras', french: 'théorème — une règle de mathématiques qui a été démontrée, comme le théorème de Pythagore', portuguese: 'teorema — uma regra da matemática que foi demonstrada, como o teorema de Pitágoras', german: 'Satz — eine bewiesene Regel der Mathematik, wie der Satz des Pythagoras', turkish: 'teorem — kanıtlanmış bir matematik kuralı, Pisagor teoremi gibi', indonesian: 'teorema — aturan matematika yang telah terbukti, seperti teorema Pythagoras', chinese: '定理 — 数学中已被证明的规则，如毕达哥拉斯定理' },
  'root': { en: 'The number that, multiplied by itself, gives another number; the square root of 25 is 5.', roman: 'root — woh number jo khud se zarb ho kar doosra number de; 25 ka square root 5 hai', urdu: 'جذر — وہ عدد جو خود سے ضرب ہو کر دوسرا عدد دے؛ 25 کا مربع جذر 5 ہے', hindi: 'वर्गमूल — वह संख्या जो स्वयं से गुणा होकर दूसरी संख्या देती है; 25 का वर्गमूल 5 है', bengali: 'বর্গমূল — যে সংখ্যা নিজে দিয়ে গুণ হয়ে অন্য সংখ্যা দেয়; 25-এর বর্গমূল 5', arabic: 'الجذر التربيعي — العدد الذي إذا ضُرب في نفسه أعطى عددًا آخر؛ الجذر التربيعي لـ 25 هو 5', spanish: 'raíz cuadrada — el número que, multiplicado por sí mismo, da otro número; la raíz cuadrada de 25 es 5', french: 'racine carrée — le nombre qui, multiplié par lui-même, donne un autre nombre ; la racine carrée de 25 est 5', portuguese: 'raiz quadrada — o número que, multiplicado por ele mesmo, dá outro número; a raiz quadrada de 25 é 5', german: 'Quadratwurzel — die Zahl, die mit sich selbst multipliziert eine andere Zahl ergibt; die Quadratwurzel von 25 ist 5', turkish: 'karekök — kendisiyle çarpıldığında başka bir sayı veren sayı; 25’in karekökü 5’tir', indonesian: 'akar kuadrat — bilangan yang jika dikalikan dengan dirinya sendiri menghasilkan bilangan lain; akar kuadrat dari 25 adalah 5', chinese: '平方根 — 一个数乘以它本身得到另一个数；25 的平方根是 5' },
  'nucleus': { en: 'The control centre of a cell; it holds the instructions for making proteins.', roman: 'nucleus — cell ka control centre; is mein proteins banane ki instructions hoti hain', urdu: 'مرکزہ — خلیے کا کنٹرول مرکز؛ اس میں پروٹین بنانے کی ہدایات ہوتی ہیں', hindi: 'केंद्रक — कोशिका का नियंत्रण केंद्र; इसमें प्रोटीन बनाने के निर्देश होते हैं', bengali: 'নিউক্লিয়াস — কোষের নিয়ন্ত্রণ কেন্দ্র; এতে প্রোটিন তৈরির নির্দেশ থাকে', arabic: 'النواة — مركز التحكم في الخلية؛ تحتوي على تعليمات صنع البروتينات', spanish: 'núcleo — el centro de control de una célula; contiene las instrucciones para fabricar proteínas', french: 'noyau — le centre de contrôle d’une cellule ; il contient les instructions pour fabriquer des protéines', portuguese: 'núcleo — o centro de controle de uma célula; contém as instruções para produzir proteínas', german: 'Zellkern — das Kontrollzentrum einer Zelle; er enthält die Anweisungen zur Herstellung von Proteinen', turkish: 'çekirdek — hücrenin kontrol merkezi; protein üretimi için talimatları içerir', indonesian: 'inti sel — pusat kendali sel; menyimpan instruksi untuk membuat protein', chinese: '细胞核 — 细胞的控制中心，含有制造蛋白质的指令' },
  'membrane': { en: 'A thin skin around a cell that controls what enters and leaves.', roman: 'membrane — cell ke gird patli jhilli jo andar bahar jane wali cheezon ko control karti hai', urdu: 'جھلی — خلیے کے گرد پتلی جھلی جو اندر باہر جانے والی چیزوں کو کنٹرول کرتی ہے', hindi: 'झिल्ली — कोशिका के चारों ओर पतली परत जो अंदर-बाहर जाने वाली चीज़ों को नियंत्रित करती है', bengali: 'ঝিল্লি — কোষের চারপাশে পাতলা আবরণ যা ভেতরে-বাইরে যাওয়া নিয়ন্ত্রণ করে', arabic: 'الغشاء — غشاء رقيق حول الخلية يتحكم فيما يدخل ويخرج', spanish: 'membrana — una piel fina alrededor de una célula que controla lo que entra y sale', french: 'membrane — une fine peau autour d’une cellule qui contrôle ce qui entre et sort', portuguese: 'membrana — uma pele fina ao redor de uma célula que controla o que entra e sai', german: 'Membran — eine dünne Haut um eine Zelle, die steuert, was hinein- und hinausgeht', turkish: 'zar — hücrenin etrafındaki ince deri, girip çıkanı kontrol eder', indonesian: 'membran — selaput tipis di sekitar sel yang mengendalikan apa yang masuk dan keluar', chinese: '膜 — 细胞周围的薄层，控制进出物质' },
  'cytoplasm': { en: 'The jelly-like substance inside a cell where most chemical reactions happen.', roman: 'cytoplasm — cell ke andar jelly jaisa maddeh jahan zyada tar chemical reactions hoti hain', urdu: 'سائٹو پلازم — خلیے کے اندر جیلی جیسا مادہ جہاں زیادہ تر کیمیائی تعامل ہوتے ہیں', hindi: 'कोशिकाद्रव्य — कोशिका के अंदर जेली जैसा पदार्थ जहाँ अधिकांश रासायनिक अभिक्रियाएँ होती हैं', bengali: 'সাইটোপ্লাজম — কোষের ভেতরে জেলির মতো পদার্থ যেখানে বেশিরভাগ রাসায়নিক বিক্রিয়া ঘটে', arabic: 'السيتوبلازم — مادة هلامية داخل الخلية تحدث فيها معظم التفاعلات الكيميائية', spanish: 'citoplasma — la sustancia gelatinosa dentro de una célula donde ocurren la mayoría de las reacciones químicas', french: 'cytoplasme — la substance gélatineuse à l’intérieur d’une cellule où se produisent la plupart des réactions chimiques', portuguese: 'citoplasma — a substância gelatinosa dentro de uma célula onde ocorre a maioria das reações químicas', german: 'Zytoplasma — die geleeartige Substanz in einer Zelle, in der die meisten chemischen Reaktionen stattfinden', turkish: 'sitoplazma — hücrenin içinde çoğu kimyasal tepkimenin gerçekleştiği jel benzeri madde', indonesian: 'sitoplasma — zat seperti jeli di dalam sel tempat sebagian besar reaksi kimia terjadi', chinese: '细胞质 — 细胞内大多数化学反应发生的胶状物质' },
  'control': { en: 'To direct or manage something; the nucleus controls the cell.', roman: 'control — kisi cheez ko chalana ya sambhalna; nucleus cell ko control karta hai', urdu: 'کنٹرول — کسی چیز کو چلانا یا سنبھالنا؛ مرکزہ خلیے کو کنٹرول کرتا ہے', hindi: 'नियंत्रण — किसी चीज़ को चलाना या संभालना; केंद्रक कोशिका को नियंत्रित करता है', bengali: 'নিয়ন্ত্রণ — কোনো কিছু পরিচালনা করা; নিউক্লিয়াস কোষকে নিয়ন্ত্রণ করে', arabic: 'التحكم — توجيه شيء أو إدارته؛ النواة تتحكم في الخلية', spanish: 'control — dirigir o gestionar algo; el núcleo controla la célula', french: 'contrôle — diriger ou gérer quelque chose ; le noyau contrôle la cellule', portuguese: 'controle — dirigir ou gerenciar algo; o núcleo controla a célula', german: 'Steuerung — etwas lenken oder verwalten; der Zellkern steuert die Zelle', turkish: 'kontrol — bir şeyi yönetmek; çekirdek hücreyi kontrol eder', indonesian: 'kontrol — mengarahkan atau mengelola sesuatu; inti sel mengendalikan sel', chinese: '控制 — 指挥或管理某事；细胞核控制细胞' },
  'cell': { en: 'The smallest unit of life; every living thing is made of cells.', roman: 'cell — zindagi ki sab se choti unit; har zinda cheez cells se bani hoti hai', urdu: 'خلیہ — زندگی کی سب سے چھوٹی اکائی؛ ہر زندہ چیز خلیوں سے بنی ہوتی ہے', hindi: 'कोशिका — जीवन की सबसे छोटी इकाई; हर जीवित चीज़ कोशिकाओं से बनी होती है', bengali: 'কোষ — জীবনের ক্ষুদ্রতম একক; প্রতিটি জীবিত জিনিস কোষ দিয়ে তৈরি', arabic: 'الخلية — أصغر وحدة في الحياة؛ كل كائن حي يتكون من خلايا', spanish: 'célula — la unidad más pequeña de la vida; todo ser vivo está hecho de células', french: 'cellule — la plus petite unité du vivant ; tout être vivant est fait de cellules', portuguese: 'célula — a menor unidade da vida; todo ser vivo é feito de células', german: 'Zelle — die kleinste Einheit des Lebens; jedes Lebewesen besteht aus Zellen', turkish: 'hücre — yaşamın en küçük birimi; her canlı hücrelerden oluşur', indonesian: 'sel — unit terkecil kehidupan; setiap makhluk hidup tersusun dari sel', chinese: '细胞 — 生命的最小单位；每个生物都由细胞构成' },
  'protein': { en: 'A substance the cell builds using instructions from the nucleus.', roman: 'protein — woh maddeh jo cell nucleus ki instructions se banata hai', urdu: 'پروٹین — وہ مادہ جو خلیہ مرکزے کی ہدایات سے بناتا ہے', hindi: 'प्रोटीन — वह पदार्थ जो कोशिका केंद्रक के निर्देशों से बनाती है', bengali: 'প্রোটিন — সেই পদার্থ যা কোষ নিউক্লিয়াসের নির্দেশে তৈরি করে', arabic: 'البروتين — مادة تبنيها الخلية باتباع تعليمات النواة', spanish: 'proteína — una sustancia que la célula construye siguiendo las instrucciones del núcleo', french: 'protéine — une substance que la cellule construit en suivant les instructions du noyau', portuguese: 'proteína — uma substância que a célula constrói seguindo as instruções do núcleo', german: 'Protein — ein Stoff, den die Zelle nach den Anweisungen des Zellkerns aufbaut', turkish: 'protein — hücrenin çekirdeğin talimatlarıyla ürettiği madde', indonesian: 'protein — zat yang dibuat sel mengikuti instruksi dari inti sel', chinese: '蛋白质 — 细胞按照细胞核指令制造的物质' },
};

// ---------------------------------------------------------------------------
// Validation (F1)
// ---------------------------------------------------------------------------

export function validateInput(rawText, level, language) {
  const text = (rawText ?? '').trim();
  if (!text) {
    return { ok: false, code: 'empty', message: 'Paste a paragraph first — the box is empty.' };
  }
  if (text.length < MIN_CHARS) {
    return { ok: false, code: 'too_short', message: `Too short: ${text.length} characters. Paste at least ${MIN_CHARS} characters (about two sentences).` };
  }
  if (text.length > MAX_CHARS) {
    return { ok: false, code: 'too_long', message: `Too long: ${text.length} characters. Keep it under ${MAX_CHARS} characters — cut it to one paragraph.` };
  }
  // A passage mostly in a non-Latin script (e.g. Urdu or Arabic) is
  // rejected with a clear message, never crashed on. Samajh explains
  // English STEM paragraphs; the language choice is for the glossary and
  // quiz wording, not for the input text. A few non-Latin words in an
  // otherwise English paragraph are fine.
  const nonLatinChars = (text.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  const letters = (text.match(/[A-Za-z\u0600-\u06FF\u0750-\u077F]/g) || []).length;
  if (letters > 0 && nonLatinChars / letters > 0.5) {
    return { ok: false, code: 'non_latin_script', message: 'This passage is not written in English. Samajh explains English STEM paragraphs — paste the English paragraph, then choose your language for the terms and quiz.' };
  }
  if (!['class9', 'intermediate', 'university'].includes(level)) {
    return { ok: false, code: 'bad_level', message: 'Pick a level: Class 9–10, Intermediate or University.' };
  }
  if (!Object.keys(LANGUAGES).includes(language)) {
    return { ok: false, code: 'bad_language', message: `Pick a language — ${Object.values(LANGUAGES).map((l) => l.label).join(', ')}.` };
  }
  const lower = text.toLowerCase();
  const foundKeywords = STEM_KEYWORDS.filter((k) => lower.includes(k));
  const hasFormula = /[A-Za-z]\s*=\s*[A-Za-z0-9]/.test(text) || text.includes('→') || text.includes('×');
  const hasNumberWithUnit = /\d+\s*(V|A|ohm|ohms|kg|g|N|m\/s|volts|amperes|newtons|kilograms|metres|seconds|°C|cm|mm|km)/i.test(text);
  const stemLike = foundKeywords.length >= 2 || hasFormula || (/\d/.test(text) && hasNumberWithUnit);
  if (!stemLike) {
    return { ok: false, code: 'not_stem', message: 'This does not look like a STEM paragraph. Paste a science, maths or technology paragraph — with a concept, a number or a formula in it.' };
  }
  return { ok: true, code: 'ok', message: '', text };
}

// ---------------------------------------------------------------------------
// Evidence check (F6)
// ---------------------------------------------------------------------------

export function normalise(s) {
  return (s ?? '')
    .toLowerCase()
    .replace(/["“”‘’'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function checkEvidence(passage, evidence) {
  const nPassage = normalise(passage);
  const nEvidence = normalise(evidence);
  const verified = nEvidence.length > 0 && nPassage.includes(nEvidence);
  return { verified, evidence: (evidence ?? '').trim() };
}

// ---------------------------------------------------------------------------
// Number warning — numbers/formulas in an explanation that are not in the
// passage. In offline mode the explanation is extractive, so this cannot
// trigger there; it exists for the future AI provider, whose output IS
// checked the same way. Pure, so the UI warning path is unit-testable with
// a hand-built result.
// ---------------------------------------------------------------------------

export function checkNumbers(passage, explanationText) {
  const numbersIn = (s) => s.match(/\d+(?:\.\d+)?/g) || [];
  const passageNumbers = new Set(numbersIn(passage ?? ''));
  return [...new Set(numbersIn(explanationText ?? ''))].filter((n) => !passageNumbers.has(n));
}

export function numberWarningText(result) {
  if (!result) return null;
  const parts = [];
  const changed = result.changedNumbers || [];
  if (changed.length > 0) {
    parts.push(`Check ${changed.length === 1 ? 'this number' : 'these numbers'} — ${changed.join(', ')} ${changed.length === 1 ? 'does' : 'do'} not appear in your passage.`);
  }
  if (result.formulaPreserved === false) {
    parts.push('Check the formula — it does not appear in your passage as written.');
  }
  return parts.length ? `⚠ ${parts.join(' ')}` : null;
}

// ---------------------------------------------------------------------------
// Quiz scoring — pure, so it is unit-testable without the DOM.
// `answers` is an array of chosen option indexes, one per quiz item.
// ---------------------------------------------------------------------------

export function scoreQuiz(quiz, answers) {
  if (!Array.isArray(quiz) || !Array.isArray(answers)) return 0;
  let score = 0;
  for (let i = 0; i < quiz.length; i++) {
    if (answers[i] !== null && answers[i] !== undefined && answers[i] === quiz[i].answer_index) score++;
  }
  return score;
}

// ---------------------------------------------------------------------------
// Flashcard deck — pure state, so the reset-on-re-run rule is unit-testable.
// The UI creates a fresh deck per run and calls resetDeck() on re-run; the
// "Know it" marks and the card position must never carry over.
// ---------------------------------------------------------------------------

export function createFlashcardDeck(terms) {
  return { terms: [...(terms || [])], index: 0, known: new Set() };
}

export function resetDeck(deck) {
  if (!deck) return deck;
  deck.index = 0;
  deck.known = new Set();
  return deck;
}

export function deckProgress(deck, language = 'english') {
  if (!deck || !deck.terms.length) return 'No terms found.';
  return languageMeta(language).deck(deck.known.size, deck.terms.length, deck.index + 1);
}

// ---------------------------------------------------------------------------
// Sentence handling
// ---------------------------------------------------------------------------

export function splitSentences(text) {
  const protectedText = text
    .replace(/(\d)\.(\d)/g, '$1<DEC>$2')
    .replace(/\be\.g\./gi, 'e<ABBR>g')
    .replace(/\bi\.e\./gi, 'i<ABBR>e');
  const parts = protectedText.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) || [];
  return parts
    .map((p) => p.replace(/<DEC>/g, '.').replace(/<ABBR>/g, '.').trim())
    .filter(Boolean);
}

function contentWords(text) {
  return (text.toLowerCase().match(/[a-z][a-z'’-]+/g) || [])
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !GENERIC.has(w));
}

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function seededShuffle(arr, seed) {
  const out = [...arr];
  let s = seed >>> 0 || 1;
  const rand = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function singularKey(lower) {
  if (lower.endsWith('ies')) return lower.slice(0, -3) + 'y';
  if (lower.endsWith('ses') || lower.endsWith('xes')) return lower.slice(0, -2);
  if (lower.endsWith('s') && !lower.endsWith('ss')) return lower.slice(0, -1);
  return lower;
}

function seedFor(termLower) {
  return GLOSSARY_SEED[termLower]
    || GLOSSARY_SEED[singularKey(termLower)]
    || GLOSSARY_SEED[termLower.replace(/s$/, '')]
    || null;
}

// ---------------------------------------------------------------------------
// Key terms (F3)
// ---------------------------------------------------------------------------

export function extractKeyTerms(passage, sentences) {
  const freq = new Map();
  for (const w of contentWords(passage)) freq.set(w, (freq.get(w) ?? 0) + 1);

  // Bigrams that repeat or are in the seed glossary — built inside one
  // sentence only, and never from the same word twice. The old code built
  // bigrams across the whole passage, which invented phrases from words
  // that only met at a sentence boundary ("current flows" from "…
  // current. Flows of current …") and from a repeated word ("squared
  // squared" from "a squared + b squared"). Both showed up as glossary
  // terms and quiz options (spotted in the 21 Nov live click-through).
  const bigramFreq = new Map();
  for (const s of sentences) {
    const ws = contentWords(s);
    for (let i = 0; i < ws.length - 1; i++) {
      if (ws[i] === ws[i + 1]) continue;
      const b = `${ws[i]} ${ws[i + 1]}`;
      bigramFreq.set(b, (bigramFreq.get(b) ?? 0) + 1);
    }
  }

  const candidates = new Map(); // key -> {term, score}
  const add = (term, score) => {
    const key = term.toLowerCase();
    if (candidates.has(key)) candidates.get(key).score += score;
    else candidates.set(key, { term, score });
  };

  for (const [w, n] of freq) {
    let score = n * 2;
    if (seedFor(w)) score += 4;
    if (w.length >= 8) score += 1;
    if (STEM_KEYWORDS.includes(w)) score += 1;
    add(w, score);
  }
  for (const [b, n] of bigramFreq) {
    if (n >= 2 || seedFor(b)) add(b, n * 3 + (seedFor(b) ? 4 : 0));
  }
  // Formula tokens, e.g. V = I × R / F = m × a — kept as glossary terms.
  for (const m of passage.match(/[A-Z]\s*=\s*[A-Za-z]\s*×\s*[A-Za-z]/g) || []) {
    add(m.replace(/\s+/g, ' '), 6);
  }

  // Display form: first occurrence in the passage, as written.
  const ranked = [...candidates.values()]
    .filter((c) => c.term.length >= 3 && !STOPWORDS.has(c.term.toLowerCase()))
    .sort((a, b) => b.score - a.score || a.term.localeCompare(b.term));

  const seen = new Set();
  const terms = [];
  for (const c of ranked) {
    const key = singularKey(c.term.toLowerCase());
    if (seen.has(key)) continue;
    seen.add(key);
    const idx = passage.toLowerCase().indexOf(c.term.toLowerCase());
    const display = idx >= 0 ? passage.slice(idx, idx + c.term.length) : c.term;
    const firstSentence = sentences.find((s) => s.toLowerCase().includes(c.term.toLowerCase())) || sentences[0] || '';
    const seed = seedFor(c.term.toLowerCase());
    // Local meanings for every language in the seed; a language with no
    // seed entry shows the English meaning only (never a guessed
    // translation). meaning_roman / meaning_urdu are kept so existing
    // callers and tests keep working.
    const meanings = {};
    if (seed) for (const code of Object.keys(LANGUAGES)) meanings[code] = code === 'english' ? seed.en : (seed[code] || null);
    terms.push({
      term: display,
      lower: c.term.toLowerCase(),
      meaning_en: seed ? seed.en : `Used in the passage: “${firstSentence}”`,
      meaning_roman: seed ? seed.roman : null,
      meaning_urdu: seed ? seed.urdu : null,
      meanings,
      firstSentence,
    });
    if (terms.length >= 8) break;
  }
  return terms;
}

// ---------------------------------------------------------------------------
// Offline engine (F7) — extractive, deterministic
// ---------------------------------------------------------------------------

export function offlineEngine(passage, level = 'class9', language = 'english') {
  const validation = validateInput(passage, level, language);
  if (!validation.ok) throw new Error(validation.message);
  const text = validation.text;
  const sentences = splitSentences(text);
  if (sentences.length === 0) throw new Error('No sentences found in the passage.');

  // Score sentences by non-stopword term frequency.
  const freq = new Map();
  for (const w of contentWords(text)) freq.set(w, (freq.get(w) ?? 0) + 1);
  const scored = sentences.map((s, i) => ({
    sentence: s,
    index: i,
    // Bonus for sentences carrying a number or a formula: in these short
    // passages the worked example is usually the most useful sentence.
    score: contentWords(s).reduce((sum, w) => sum + (freq.get(w) ?? 0), 0)
      + (/\d/.test(s) ? 4 : 0) + (/=|→/.test(s) ? 2 : 0),
  }));
  // Level changes how much of the passage the explanation uses. Class 9
  // keeps it short (the definition + the worked example), Intermediate is
  // the default, University uses the most sentences. The definition
  // sentence and the best sentence carrying a number are always included,
  // whatever the level.
  const topCount = level === 'university' ? 5 : level === 'class9' ? 2 : 3;
  const top = [...scored].sort((a, b) => b.score - a.score || a.index - b.index).slice(0, topCount);
  const chosen = new Map(top.map((t) => [t.index, t]));
  // A worked example (a sentence carrying a number) is usually the most
  // useful sentence for a student, so include the best one if the top
  // sentences missed it.
  const numeric = scored.filter((t) => /\d/.test(t.sentence) && !chosen.has(t.index))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0];
  if (numeric) chosen.set(numeric.index, numeric);
  // The opening sentence is usually the definition ("Photosynthesis is
  // the process..."), so it belongs in the explanation even when it scores
  // lower than the worked examples.
  if (!chosen.has(0)) chosen.set(0, scored.find((t) => t.index === 0));
  const explanationSentences = [...chosen.values()].sort((a, b) => a.index - b.index).map((t) => t.sentence);
  const oneLine = explanationSentences[0];

  const keyTerms = extractKeyTerms(text, sentences);

  // Quiz (F4): cloze questions, one per key term, evidence = the sentence.
  const quiz = buildQuiz(text, sentences, keyTerms, language);

  // Numbers/formulas in the explanation that are not in the passage (should be none).
  const changedNumbers = checkNumbers(text, explanationSentences.join(' '));
  const formulaInExplanation = /[A-Z]\s*=\s*[A-Za-z]\s*×\s*[A-Za-z]/.test(explanationSentences.join(' '));
  const formulaInPassage = /[A-Z]\s*=\s*[A-Za-z]\s*×\s*[A-Za-z]/.test(text);

  const verifiedCount = quiz.filter((q) => q.verified).length;

  return {
    mode: 'offline',
    reason: 'no API key — works without one',
    level,
    language,
    oneLine,
    explanation: explanationSentences.join(' '),
    explanationSentences,
    keyTerms,
    quiz,
    verifiedCount,
    totalQuiz: quiz.length,
    changedNumbers,
    formulaPreserved: !formulaInExplanation || formulaInPassage,
  };
}

function termPattern(termLower) {
  // Matches the term or its simple plural, e.g. object / objects.
  const base = escapeRegExp(termLower);
  return termLower.endsWith('s') ? new RegExp(`\\b${base}\\b`, 'i')
    : new RegExp(`\\b${base}s?\\b`, 'i');
}

function buildQuiz(passage, sentences, keyTerms, language) {
  const quizTerms = keyTerms.filter((t) => !t.term.includes('=') && !t.term.includes('×'));
  // How many questions already blank a word from each sentence. Two passes:
  // first use a fresh sentence per question; second pass may reuse a
  // sentence (short passages have fewer sentences than questions), but it
  // reuses the LEAST-used sentence first, so the same sentence is never
  // the obvious fallback — e.g. Newton has 4 sentences for 5 questions,
  // so exactly one sentence is used twice, and it is not Q1's sentence.
  const sentenceUseCount = new Map();
  const usedTerms = new Set();
  const items = [];

  for (const allowReuse of [false, true]) {
    for (const term of quizTerms) {
      if (items.length >= 5) break;
      if (usedTerms.has(term.lower)) continue;
      const pattern = termPattern(term.lower);
      const options = sentences
        .map((s, i) => ({ s, i, others: quizTerms.filter((t) => t !== term && termPattern(t.lower).test(s)).length }))
        .filter((o) => pattern.test(o.s) && (allowReuse || !sentenceUseCount.has(o.i)));
      if (!options.length) continue;
      // Pass 1: fewest other key terms in the sentence (least ambiguous
      // cloze), then earliest sentence. Pass 2: least-used sentence first,
      // then earliest — spread the reuse instead of repeating one sentence.
      if (allowReuse) options.sort((a, b) => (sentenceUseCount.get(a.i) || 0) - (sentenceUseCount.get(b.i) || 0) || a.i - b.i);
      else options.sort((a, b) => a.others - b.others || a.i - b.i);
      const evidence = options[0].s;
      sentenceUseCount.set(options[0].i, (sentenceUseCount.get(options[0].i) || 0) + 1);
      usedTerms.add(term.lower);
      // The correct answer is the word as written in the evidence sentence
      // (so "objects" stays "objects", not the singular glossary form).
      const correctAnswer = evidence.match(pattern)[0];

      // Distractors: other key terms NOT in the evidence sentence.
      // Generic words (object, law) are never distractors: they can fit
      // almost any blank ("a 2 kg object" is also sensible), which would
      // make the question ambiguous. They can still be correct answers.
      const GENERIC_DISTRACTORS = new Set(['object', 'law']);
      let distractors = quizTerms
        .filter((t) => t !== term && !GENERIC_DISTRACTORS.has(t.lower) && !termPattern(t.lower).test(evidence))
        .map((t) => t.term);
      if (distractors.length < 3) {
        const extra = contentWords(passage)
          .filter((w) => w.length >= 4 && w !== term.lower && !w.includes("'") && !GENERIC_DISTRACTORS.has(w) && !termPattern(w).test(evidence));
        for (const w of [...new Set(extra)]) {
          if (distractors.length >= 3) break;
          if (!distractors.some((d) => d.toLowerCase() === w)) distractors.push(w);
        }
      }
      distractors = [...new Set(distractors.map((d) => d.toLowerCase()))]
        .filter((d) => d !== correctAnswer.toLowerCase())
        .slice(0, 3)
        .map((d) => {
          const hit = quizTerms.find((t) => t.lower === d);
          return hit ? hit.term : d;
        });
      if (distractors.length < 3) { usedTerms.delete(term.lower); continue; }

      const cloze = evidence.replace(pattern, '______');
      const allOptions = seededShuffle([correctAnswer, ...distractors], hashString(passage + term.lower));
      const answerIndex = allOptions.findIndex((o) => o.toLowerCase() === correctAnswer.toLowerCase());
      if (answerIndex < 0) continue;

      const meta = languageMeta(language);
      const question = meta.question(cloze);
      const reason = meta.reason(correctAnswer);

      items.push({
        question,
        options: allOptions,
        answer_index: answerIndex,
        reason,
        evidence,
        verified: checkEvidence(passage, evidence).verified,
      });
    }
    if (items.length >= 5) break;
  }
  return items;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// Study sheet (F10)
// ---------------------------------------------------------------------------

export function buildStudySheet(result, passage, level, language) {
  const lines = [
    '# Samajh — study sheet',
    '',
    `Level: ${level} · Language: ${language} · Mode: ${result.mode} (${result.reason})`,
    '',
    '## Original passage',
    '',
    passage.trim(),
    '',
    '## Simple explanation',
    '',
    result.oneLine,
    '',
    result.explanation,
    '',
    '## Key terms',
    '',
    ...result.keyTerms.map((t) => {
      const local = t.meanings ? t.meanings[language] : (language === 'urdu' ? t.meaning_urdu : language === 'roman' ? t.meaning_roman : null);
      return `- **${t.term}** — ${t.meaning_en}${local ? ` / ${local}` : ''}`;
    }),
    '',
    '## Quiz',
    '',
    ...result.quiz.flatMap((q, i) => [
      `${i + 1}. ${q.question}`,
      ...q.options.map((o, j) => `   ${String.fromCharCode(97 + j)}) ${o}`),
      `   Answer: ${q.options[q.answer_index]} — ${q.reason}`,
      `   Evidence: “${q.evidence}” (${q.verified ? 'Found in passage' : 'Could not verify — check yourself'})`,
      '',
    ]),
    '---',
    'Made with Samajh (STEM2Connect AI Hackathon 2026, Education track). ' +
      (result.mode === 'ai'
        ? 'AI mode: explanation by Pollinations (free, no key); quiz and glossary checked offline against the passage.'
        : 'Offline mode: no AI call was made; the explanation re-uses sentences from the passage.'),
  ];
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// AI provider — Pollinations (free, no key) — F7
// ---------------------------------------------------------------------------

export function getProviderInfo() {
  return {
    provider: PROVIDER, // 'pollinations' — free text API, no key, no sign-up
    model: AI_MODEL,
    endpoint: AI_ENDPOINT,
    reason: 'AI explanation via Pollinations (free, no key); quiz and glossary always checked offline',
    callsExternalApi: true,
    keyRequired: false,
    // The passage IS sent to Pollinations when AI mode is on (that is how
    // an LLM explains it). Nothing is stored by Samajh; do not paste
    // personal information. AI mode can be switched off for a fully
    // offline run that sends nothing anywhere.
  };
}

function aiLanguageInstruction(language) {
  return languageMeta(language).ai;
}

export function buildAiPrompt(passage, level, language) {
  return {
    system: 'You are Samajh, a study helper for Pakistani school students. Reply with valid JSON only. No markdown, no extra text, no code fences.',
    user: `${aiLanguageInstruction(language)}\nLevel: ${level}.\nWrite EVERY sentence of the explanation and the takeaway in the requested language — do not write any sentence in English. Only STEM terms themselves may stay in English.\nRules: use ONLY facts, numbers and formulas from the passage below. Do not add facts from outside it. Do not change any number or formula — copy them exactly as written. Keep the explanation to 2–4 short sentences.\nPassage:\n${passage}\n\nReply as JSON: {"explanation": "...", "takeaway": "..."} where takeaway is one sentence that sums the passage up.`,
  };
}

export function parseAiResponse(rawText) {
  const cleaned = (rawText ?? '').trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!parsed || typeof parsed.explanation !== 'string' || typeof parsed.takeaway !== 'string') {
    throw new Error('AI reply was not the expected JSON shape.');
  }
  const explanation = parsed.explanation.trim();
  const takeaway = parsed.takeaway.trim();
  if (explanation.length < 30 || takeaway.length < 10) {
    throw new Error('AI reply was too short to use.');
  }
  return { explanation, takeaway, explanationSentences: splitSentences(explanation) };
}

export async function callProvider(passage, level = 'class9', language = 'english', fetchImpl) {
  const fetchFn = fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
  if (!fetchFn) throw new Error('No fetch available for the AI provider.');
  const prompt = buildAiPrompt(passage, level, language);
  const res = await fetchFn(AI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ],
      model: AI_MODEL,
      jsonMode: true,
    }),
  });
  if (!res || !res.ok) throw new Error(`AI provider returned ${res ? res.status : 'no response'}.`);
  const text = typeof res.text === 'function' ? await res.text() : JSON.stringify(await res.json());
  return parseAiResponse(text);
}

// For languages written in a non-Latin script, the AI explanation must
// actually be in that script. If fewer than half of its letters are in the
// target script, the AI wrote English (or another language) for most of it
// and the offline explanation is kept. A good explanation still passes:
// STEM terms and numbers stay in English, but they are only a small share
// of the letters. Latin-script languages cannot be told apart this way, so
// they rely on the prompt alone. English gets the same check in reverse:
// an explanation in Urdu script for an English request is rejected too
// (seen live in run 4: a cells/english explanation came back in Urdu).
const SCRIPT_RANGES = {
  urdu: [0x0600, 0x06ff], arabic: [0x0600, 0x06ff],
  hindi: [0x0900, 0x097f], bengali: [0x0980, 0x09ff], chinese: [0x4e00, 0x9fff],
  english: [0x0041, 0x007a],
};
export function checkLanguageScript(text, language) {
  const range = SCRIPT_RANGES[language];
  if (!range) return true;
  // Brand names are not language content: "Pollinations" (12 Latin
  // letters) would otherwise dominate short strings such as a mode chip.
  const stripped = (text ?? '').replace(/pollinations/gi, '');
  let letters = 0, inScript = 0;
  for (const ch of stripped) {
    const cp = ch.codePointAt(0);
    if (/[A-Za-z\u0600-\u09ff\u4e00-\u9fff]/.test(ch)) {
      letters++;
      if (cp >= range[0] && cp <= range[1]) inScript++;
    }
  }
  return letters === 0 || inScript / letters >= 0.5;
}

// AI engine: offline result as the base (quiz + glossary always offline),
// AI explanation swapped in only if it passes the number check and the
// language check. A failed call OR a rejected output is retried once —
// the free provider fails transiently, and a second attempt often
// succeeds. Two failures are a real fallback, not a crash.
export async function aiEngine(passage, level = 'class9', language = 'english', fetchImpl) {
  const base = offlineEngine(passage, level, language);
  let aiError = null;
  let rejection = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    let ai = null;
    try {
      ai = await callProvider(passage, level, language, fetchImpl);
    } catch (e) {
      aiError = e && e.message ? e.message : 'AI call failed';
      continue;
    }
    const changed = checkNumbers(passage, ai.explanation);
    if (changed.length > 0) {
      rejection = {
        aiRejected: `AI changed number(s) ${changed.join(', ')} — offline explanation kept`,
        reason: `AI changed a number (${changed.join(', ')}), so the offline explanation was kept`,
      };
      continue;
    }
    if (!checkLanguageScript(`${ai.explanation} ${ai.takeaway}`, language)) {
      rejection = {
        aiRejected: 'AI wrote the explanation in the wrong language — offline explanation kept',
        reason: 'AI wrote the explanation in the wrong language, so the offline explanation was kept',
      };
      continue;
    }
    return {
      ...base, mode: 'ai', aiAttempted: true,
      oneLine: ai.takeaway,
      explanation: ai.explanation,
      explanationSentences: ai.explanationSentences,
      changedNumbers: [],
      formulaPreserved: true,
      reason: 'AI explanation (Pollinations, free, no key); quiz and glossary checked offline',
    };
  }
  if (rejection) {
    return { ...base, mode: 'offline', aiAttempted: true, ...rejection };
  }
  return {
    ...base, mode: 'offline', aiAttempted: true, aiError,
    reason: `AI call failed (${aiError}) — offline engine used`,
  };
}

export async function runPipeline(passage, level, language, opts = {}) {
  // Single entry point the UI uses. AI mode is the default; it falls back
  // to the offline engine automatically when the AI call fails or its
  // output fails the number check. Pass {useAI:false} for a fully offline
  // run that sends nothing anywhere.
  const useAI = opts.useAI !== false;
  if (!useAI) {
    const result = offlineEngine(passage, level, language);
    return { result, mode: 'offline', reason: 'AI mode off — offline engine, nothing sent anywhere' };
  }
  const result = await aiEngine(passage, level, language, opts.fetchImpl);
  return { result, mode: result.mode, reason: result.reason };
}
