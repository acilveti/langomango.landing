// Reader Demo Widget Translations
export interface TranslationMap {
  [key: string]: string;
}

export interface Translations {
  [languageCode: string]: TranslationMap;
}

export const readerTranslations: Translations = {
  // English (source language - included for completeness)
  en: {
    // Sentences (B1+)
    'He opened his eyes': 'He opened his eyes',
    'storm': 'storm',
    'Joan struggled to his feet': 'Joan struggled to his feet',
    'The deck was chaos': 'The deck was chaos',
    'darkness': 'darkness',
    'ship': 'ship',
    'Lightning split the sky': 'Lightning split the sky',
    'captain': 'captain',
    '"All hands on deck!"': '"All hands on deck!"',
    'Joan grabbed a rope': 'Joan grabbed a rope',
    'wave': 'wave',
    'Time seemed to slow': 'Time seemed to slow',
    // Words (A1-A2)
    'eyes': 'eyes',
    'night': 'night',
    'feet': 'feet',
    'deck': 'deck',
    'sail': 'sail',
    'wind': 'wind',
    'lightning': 'lightning',
    'sky': 'sky',
    'face': 'face',
    'sailors': 'sailors',
    'rope': 'rope',
    'water': 'water',
    'time': 'time',
    'sailor': 'sailor'
  },
  
  // Spanish
  es: {
    // Sentences (B1+)
    'He opened his eyes': 'Abrió los ojos',
    'storm': 'tormenta',
    'Joan struggled to his feet': 'Joan luchó para ponerse de pie',
    'The deck was chaos': 'La cubierta era un caos',
    'darkness': 'oscuridad',
    'ship': 'barco',
    'Lightning split the sky': 'Un rayo partió el cielo',
    'captain': 'capitán',
    '"All hands on deck!"': '"¡Todos a cubierta!"',
    'Joan grabbed a rope': 'Joan agarró una cuerda',
    'wave': 'ola',
    'Time seemed to slow': 'El tiempo pareció ralentizarse',
    // Words (A1-A2)
    'eyes': 'ojos',
    'night': 'noche',
    'feet': 'pies',
    'deck': 'cubierta',
    'sail': 'vela',
    'wind': 'viento',
    'lightning': 'rayo',
    'sky': 'cielo',
    'face': 'cara',
    'sailors': 'marineros',
    'rope': 'cuerda',
    'water': 'agua',
    'time': 'tiempo',
    'sailor': 'marinero'
  },
  
  // French
  fr: {
    // Sentences (B1+)
    'He opened his eyes': 'Il ouvrit les yeux',
    'storm': 'tempête',
    'Joan struggled to his feet': 'Joan se leva avec difficulté',
    'The deck was chaos': 'Le pont était le chaos',
    'darkness': 'obscurité',
    'ship': 'navire',
    'Lightning split the sky': 'Un éclair fendit le ciel',
    'captain': 'capitaine',
    '"All hands on deck!"': '"Tout le monde sur le pont !"',
    'Joan grabbed a rope': 'Joan saisit une corde',
    'wave': 'vague',
    'Time seemed to slow': 'Le temps sembla ralentir',
    // Words (A1-A2)
    'eyes': 'yeux',
    'night': 'nuit',
    'feet': 'pieds',
    'deck': 'pont',
    'sail': 'voile',
    'wind': 'vent',
    'lightning': 'éclair',
    'sky': 'ciel',
    'face': 'visage',
    'sailors': 'marins',
    'rope': 'corde',
    'water': 'eau',
    'time': 'temps',
    'sailor': 'marin'
  },
  
  // German
  de: {
    // Sentences (B1+)
    'He opened his eyes': 'Er öffnete die Augen',
    'storm': 'Sturm',
    'Joan struggled to his feet': 'Joan kämpfte sich auf die Füße',
    'The deck was chaos': 'Das Deck war ein Chaos',
    'darkness': 'Dunkelheit',
    'ship': 'Schiff',
    'Lightning split the sky': 'Ein Blitz zerriss den Himmel',
    'captain': 'Kapitän',
    '"All hands on deck!"': '"Alle Mann an Deck!"',
    'Joan grabbed a rope': 'Joan griff nach einem Seil',
    'wave': 'Welle',
    'Time seemed to slow': 'Die Zeit schien sich zu verlangsamen',
    // Words (A1-A2)
    'eyes': 'Augen',
    'night': 'Nacht',
    'feet': 'Füße',
    'deck': 'Deck',
    'sail': 'Segel',
    'wind': 'Wind',
    'lightning': 'Blitz',
    'sky': 'Himmel',
    'face': 'Gesicht',
    'sailors': 'Seeleute',
    'rope': 'Seil',
    'water': 'Wasser',
    'time': 'Zeit',
    'sailor': 'Seemann'
  },
  
  // Chinese
  zh: {
    // Sentences (B1+)
    'He opened his eyes': '他睁开了眼睛',
    'storm': '风暴',
    'Joan struggled to his feet': '琼挣扎着站起来',
    'The deck was chaos': '甲板一片混乱',
    'darkness': '黑暗',
    'ship': '船',
    'Lightning split the sky': '闪电划破天空',
    'captain': '船长',
    '"All hands on deck!"': '"所有人都到甲板上！"',
    'Joan grabbed a rope': '琼抓住了一根绳子',
    'wave': '波浪',
    'Time seemed to slow': '时间似乎放慢了',
    // Words (A1-A2)
    'eyes': '眼睛',
    'night': '夜晚',
    'feet': '脚',
    'deck': '甲板',
    'sail': '帆',
    'wind': '风',
    'lightning': '闪电',
    'sky': '天空',
    'face': '脸',
    'sailors': '水手们',
    'rope': '绳子',
    'water': '水',
    'time': '时间',
    'sailor': '水手'
  },
  
  // Japanese
  ja: {
    // Sentences (B1+)
    'He opened his eyes': '彼は目を開いた',
    'storm': '嵐',
    'Joan struggled to his feet': 'ジョアンは立ち上がろうと奮闘した',
    'The deck was chaos': 'デッキは大混乱だった',
    'darkness': '暗闇',
    'ship': '船',
    'Lightning split the sky': '稲妻が空を切り裂いた',
    'captain': '船長',
    '"All hands on deck!"': '"全員甲板へ！"',
    'Joan grabbed a rope': 'ジョアンはロープを掴んだ',
    'wave': '波',
    'Time seemed to slow': '時間が遅くなったようだった',
    // Words (A1-A2)
    'eyes': '目',
    'night': '夜',
    'feet': '足',
    'deck': 'デッキ',
    'sail': '帆',
    'wind': '風',
    'lightning': '稲妻',
    'sky': '空',
    'face': '顔',
    'sailors': '船員たち',
    'rope': 'ロープ',
    'water': '水',
    'time': '時間',
    'sailor': '船員'
  },
  
  // Italian
  it: {
    // Sentences (B1+)
    'He opened his eyes': 'Aprì gli occhi',
    'storm': 'tempesta',
    'Joan struggled to his feet': 'Joan si alzò a fatica',
    'The deck was chaos': 'Il ponte era il caos',
    'darkness': 'oscurità',
    'ship': 'nave',
    'Lightning split the sky': 'Un fulmine squarciò il cielo',
    'captain': 'capitano',
    '"All hands on deck!"': '"Tutti sul ponte!"',
    'Joan grabbed a rope': 'Joan afferrò una corda',
    'wave': 'onda',
    'Time seemed to slow': 'Il tempo sembrò rallentare',
    // Words (A1-A2)
    'eyes': 'occhi',
    'night': 'notte',
    'feet': 'piedi',
    'deck': 'ponte',
    'sail': 'vela',
    'wind': 'vento',
    'lightning': 'fulmine',
    'sky': 'cielo',
    'face': 'viso',
    'sailors': 'marinai',
    'rope': 'corda',
    'water': 'acqua',
    'time': 'tempo',
    'sailor': 'marinaio'
  },
  
  // Korean
  ko: {
    'He opened his eyes': '그는 눈을 떴다',
    'storm': '폭풍',
    'Joan struggled to his feet': '조안은 일어서려고 애썼다',
    'The deck was chaos': '갑판은 혼돈이었다',
    'darkness': '어둠',
    'ship': '배',
    'Lightning split the sky': '번개가 하늘을 갈랐다',
    'captain': '선장',
    '"All hands on deck!"': '"모두 갑판으로!"',
    'Joan grabbed a rope': '조안이 밧줄을 잡았다',
    'wave': '파도',
    'Time seemed to slow': '시간이 느려진 것 같았다'
  },
  
  // Portuguese
  pt: {
    'He opened his eyes': 'Ele abriu os olhos',
    'storm': 'tempestade',
    'Joan struggled to his feet': 'Joan lutou para se levantar',
    'The deck was chaos': 'O convés era o caos',
    'darkness': 'escuridão',
    'ship': 'navio',
    'Lightning split the sky': 'Um raio cortou o céu',
    'captain': 'capitão',
    '"All hands on deck!"': '"Todos ao convés!"',
    'Joan grabbed a rope': 'Joan agarrou uma corda',
    'wave': 'onda',
    'Time seemed to slow': 'O tempo pareceu desacelerar'
  },
  
  // Russian
  ru: {
    'He opened his eyes': 'Он открыл глаза',
    'storm': 'шторм',
    'Joan struggled to his feet': 'Жоан с трудом поднялся на ноги',
    'The deck was chaos': 'На палубе царил хаос',
    'darkness': 'темнота',
    'ship': 'корабль',
    'Lightning split the sky': 'Молния расколола небо',
    'captain': 'капитан',
    '"All hands on deck!"': '"Все наверх!"',
    'Joan grabbed a rope': 'Жоан схватил верёвку',
    'wave': 'волна',
    'Time seemed to slow': 'Время словно замедлилось'
  },
  
  // Arabic
  ar: {
    'He opened his eyes': 'فتح عينيه',
    'storm': 'عاصفة',
    'Joan struggled to his feet': 'كافح جوان للوقوف على قدميه',
    'The deck was chaos': 'كان السطح فوضى',
    'darkness': 'ظلام',
    'ship': 'سفينة',
    'Lightning split the sky': 'شق البرق السماء',
    'captain': 'قبطان',
    '"All hands on deck!"': '"الجميع على السطح!"',
    'Joan grabbed a rope': 'أمسك جوان بحبل',
    'wave': 'موجة',
    'Time seemed to slow': 'بدا الوقت وكأنه يتباطأ'
  },
  
  // Hindi
  hi: {
    'He opened his eyes': 'उसने अपनी आँखें खोलीं',
    'storm': 'तूफान',
    'Joan struggled to his feet': 'जोआन अपने पैरों पर खड़ा होने के लिए संघर्ष कर रहा था',
    'The deck was chaos': 'डेक पर अफरा-तफरी थी',
    'darkness': 'अंधेरा',
    'ship': 'जहाज',
    'Lightning split the sky': 'बिजली ने आकाश को चीर दिया',
    'captain': 'कप्तान',
    '"All hands on deck!"': '"सभी डेक पर!"',
    'Joan grabbed a rope': 'जोआन ने एक रस्सी पकड़ी',
    'wave': 'लहर',
    'Time seemed to slow': 'समय धीमा होता दिखा'
  },
  
  // Dutch
  nl: {
    'He opened his eyes': 'Hij opende zijn ogen',
    'storm': 'storm',
    'Joan struggled to his feet': 'Joan worstelde overeind',
    'The deck was chaos': 'Het dek was een chaos',
    'darkness': 'duisternis',
    'ship': 'schip',
    'Lightning split the sky': 'Bliksem spleet de lucht',
    'captain': 'kapitein',
    '"All hands on deck!"': '"Alle hens aan dek!"',
    'Joan grabbed a rope': 'Joan greep een touw',
    'wave': 'golf',
    'Time seemed to slow': 'De tijd leek te vertragen'
  },
  
  // Polish
  pl: {
    'He opened his eyes': 'Otworzył oczy',
    'storm': 'burza',
    'Joan struggled to his feet': 'Joan z trudem wstał',
    'The deck was chaos': 'Na pokładzie panował chaos',
    'darkness': 'ciemność',
    'ship': 'statek',
    'Lightning split the sky': 'Błyskawica rozerżnęła niebo',
    'captain': 'kapitan',
    '"All hands on deck!"': '"Wszyscy na pokład!"',
    'Joan grabbed a rope': 'Joan chwycił linę',
    'wave': 'fala',
    'Time seemed to slow': 'Czas zdawał się zwalniać'
  },
  
  // Turkish
  tr: {
    'He opened his eyes': 'Gözlerini açtı',
    'storm': 'fırtına',
    'Joan struggled to his feet': 'Joan ayağa kalkmak için mücadele etti',
    'The deck was chaos': 'Güverte kaos içindeydi',
    'darkness': 'karanlık',
    'ship': 'gemi',
    'Lightning split the sky': 'Şimşek gökyüzünü yarıp geçti',
    'captain': 'kaptan',
    '"All hands on deck!"': '"Herkes güverteye!"',
    'Joan grabbed a rope': 'Joan bir ip yakaladı',
    'wave': 'dalga',
    'Time seemed to slow': 'Zaman yavaşlıyor gibiydi'
  },
  
  // Swedish
  sv: {
    'He opened his eyes': 'Han öppnade ögonen',
    'storm': 'storm',
    'Joan struggled to his feet': 'Joan kämpade sig upp på fötter',
    'The deck was chaos': 'Däcket var kaos',
    'darkness': 'mörker',
    'ship': 'skepp',
    'Lightning split the sky': 'Blixten klöv himlen',
    'captain': 'kapten',
    '"All hands on deck!"': '"Alla man på däck!"',
    'Joan grabbed a rope': 'Joan grep tag i ett rep',
    'wave': 'våg',
    'Time seemed to slow': 'Tiden tycktes sakta ner'
  },
  
  // Hebrew
  he: {
    'He opened his eyes': 'הוא פתח את עיניו',
    'storm': 'סערה',
    'Joan struggled to his feet': 'ג׳ואן נאבק לקום על רגליו',
    'The deck was chaos': 'הסיפון היה כאוס',
    'darkness': 'חושך',
    'ship': 'אונייה',
    'Lightning split the sky': 'ברק בקע את השמיים',
    'captain': 'קברניט',
    '"All hands on deck!"': '"כולם על הסיפון!"',
    'Joan grabbed a rope': 'ג׳ואן תפס חבל',
    'wave': 'גל',
    'Time seemed to slow': 'הזמן נראה כאילו האט'
  },
  
  // Norwegian
  no: {
    'He opened his eyes': 'Han åpnet øynene',
    'storm': 'storm',
    'Joan struggled to his feet': 'Joan kjempet seg opp på beina',
    'The deck was chaos': 'Dekket var kaos',
    'darkness': 'mørke',
    'ship': 'skip',
    'Lightning split the sky': 'Lynet delte himmelen',
    'captain': 'kaptein',
    '"All hands on deck!"': '"Alle mann på dekk!"',
    'Joan grabbed a rope': 'Joan grep et tau',
    'wave': 'bølge',
    'Time seemed to slow': 'Tiden syntes å sakne'
  },
  
  // Danish
  da: {
    'He opened his eyes': 'Han åbnede øjnene',
    'storm': 'storm',
    'Joan struggled to his feet': 'Joan kæmpede sig op på benene',
    'The deck was chaos': 'Dækket var kaos',
    'darkness': 'mørke',
    'ship': 'skib',
    'Lightning split the sky': 'Lynet delte himlen',
    'captain': 'kaptajn',
    '"All hands on deck!"': '"Alle mand på dæk!"',
    'Joan grabbed a rope': 'Joan greb et reb',
    'wave': 'bølge',
    'Time seemed to slow': 'Tiden syntes at gå langsommere'
  },
  
  // Greek
  el: {
    'He opened his eyes': 'Άνοιξε τα μάτια του',
    'storm': 'καταιγίδα',
    'Joan struggled to his feet': 'Ο Τζόαν πάλεψε να σηκωθεί',
    'The deck was chaos': 'Το κατάστρωμα ήταν χάος',
    'darkness': 'σκοτάδι',
    'ship': 'πλοίο',
    'Lightning split the sky': 'Ο κεραυνός έσχισε τον ουρανό',
    'captain': 'καπετάνιος',
    '"All hands on deck!"': '"Όλοι στο κατάστρωμα!"',
    'Joan grabbed a rope': 'Ο Τζόαν άρπαξε ένα σχοινί',
    'wave': 'κύμα',
    'Time seemed to slow': 'Ο χρόνος φάνηκε να επιβραδύνεται'
  },
  
  // Vietnamese
  vi: {
    'He opened his eyes': 'Anh mở mắt',
    'storm': 'bão',
    'Joan struggled to his feet': 'Joan vật lộn để đứng dậy',
    'The deck was chaos': 'Boong tàu hỗn loạn',
    'darkness': 'bóng tối',
    'ship': 'tàu',
    'Lightning split the sky': 'Sét xé toạc bầu trời',
    'captain': 'thủyền trưởng',
    '"All hands on deck!"': '"Tất cả lên boong!"',
    'Joan grabbed a rope': 'Joan nắm lấy một sợi dây',
    'wave': 'sóng',
    'Time seemed to slow': 'Thời gian dường như chậm lại'
  },
  
  // Thai
  th: {
    'He opened his eyes': 'เขาลืมตา',
    'storm': 'พายุ',
    'Joan struggled to his feet': 'โจนดิ้นรนลุกขึ้นยืน',
    'The deck was chaos': 'ดาดฟ้าเรือวุ่นวาย',
    'darkness': 'ความมืด',
    'ship': 'เรือ',
    'Lightning split the sky': 'ฟ้าแลบผ่าท้องฟ้า',
    'captain': 'กัปตัน',
    '"All hands on deck!"': '"ทุกคนขึ้นดาดฟ้า!"',
    'Joan grabbed a rope': 'โจนคว้าเชือก',
    'wave': 'คลื่น',
    'Time seemed to slow': 'เวลาดูเหมือนช้าลง'
  },
  
  // Indonesian
  id: {
    'He opened his eyes': 'Dia membuka matanya',
    'storm': 'badai',
    'Joan struggled to his feet': 'Joan berjuang untuk berdiri',
    'The deck was chaos': 'Geladak dalam kekacauan',
    'darkness': 'kegelapan',
    'ship': 'kapal',
    'Lightning split the sky': 'Petir membelah langit',
    'captain': 'kapten',
    '"All hands on deck!"': '"Semua ke geladak!"',
    'Joan grabbed a rope': 'Joan meraih tali',
    'wave': 'gelombang',
    'Time seemed to slow': 'Waktu seakan melambat'
  },
  
  // Finnish
  fi: {
    'He opened his eyes': 'Hän avasi silmänsä',
    'storm': 'myrsky',
    'Joan struggled to his feet': 'Joan kamppaili jaloilleen',
    'The deck was chaos': 'Kansi oli kaaoksessa',
    'darkness': 'pimeys',
    'ship': 'laiva',
    'Lightning split the sky': 'Salama halkaisi taivaan',
    'captain': 'kapteeni',
    '"All hands on deck!"': '"Kaikki kannelle!"',
    'Joan grabbed a rope': 'Joan tarttui köyteen',
    'wave': 'aalto',
    'Time seemed to slow': 'Aika näytti hidastuvan'
  },
  
  // Romanian
  ro: {
    'He opened his eyes': 'Și-a deschis ochii',
    'storm': 'furtună',
    'Joan struggled to his feet': 'Joan s-a chinuit să se ridice',
    'The deck was chaos': 'Puntea era haos',
    'darkness': 'întuneric',
    'ship': 'navă',
    'Lightning split the sky': 'Fulgerul a despicat cerul',
    'captain': 'căpitan',
    '"All hands on deck!"': '"Toată lumea pe punte!"',
    'Joan grabbed a rope': 'Joan a apucat o frânghie',
    'wave': 'val',
    'Time seemed to slow': 'Timpul părea să încetinească'
  },
  
  // Hungarian
  hu: {
    'He opened his eyes': 'Kinyitotta a szemét',
    'storm': 'vihar',
    'Joan struggled to his feet': 'Joan küszködve talpra állt',
    'The deck was chaos': 'A fedélzet káosz volt',
    'darkness': 'sötétség',
    'ship': 'hajó',
    'Lightning split the sky': 'Villám hasította ketté az eget',
    'captain': 'kapitány',
    '"All hands on deck!"': '"Mindenki a fedélzetre!"',
    'Joan grabbed a rope': 'Joan megragadott egy kötelet',
    'wave': 'hullám',
    'Time seemed to slow': 'Az idő mintha lelassult volna'
  },
  
  // Czech
  cs: {
    'He opened his eyes': 'Otevřel oči',
    'storm': 'bouře',
    'Joan struggled to his feet': 'Joan se s námahou postavil',
    'The deck was chaos': 'Na palubě byl chaos',
    'darkness': 'tma',
    'ship': 'loď',
    'Lightning split the sky': 'Blesk rozťal oblohu',
    'captain': 'kapitán',
    '"All hands on deck!"': '"Všichni na palubu!"',
    'Joan grabbed a rope': 'Joan popadl lano',
    'wave': 'vlna',
    'Time seemed to slow': 'Čas jako by se zpomalil'
  },
  
  // Ukrainian
  uk: {
    'He opened his eyes': 'Він відкрив очі',
    'storm': 'шторм',
    'Joan struggled to his feet': 'Джоан з труднощами піднявся на ноги',
    'The deck was chaos': 'На палубі панував хаос',
    'darkness': 'темрява',
    'ship': 'корабель',
    'Lightning split the sky': 'Блискавка розколола небо',
    'captain': 'капітан',
    '"All hands on deck!"': '"Всі на палубу!"',
    'Joan grabbed a rope': 'Джоан схопив мотузку',
    'wave': 'хвиля',
    'Time seemed to slow': 'Час ніби сповільнився'
  },
  
  // Malay
  ms: {
    'He opened his eyes': 'Dia membuka matanya',
    'storm': 'ribut',
    'Joan struggled to his feet': 'Joan bergelut untuk bangun',
    'The deck was chaos': 'Dek dalam keadaan huru-hara',
    'darkness': 'kegelapan',
    'ship': 'kapal',
    'Lightning split the sky': 'Kilat membelah langit',
    'captain': 'kapten',
    '"All hands on deck!"': '"Semua ke dek!"',
    'Joan grabbed a rope': 'Joan mencapai tali',
    'wave': 'gelombang',
    'Time seemed to slow': 'Masa seolah-olah perlahan'
  },
  
  // Persian/Farsi
  fa: {
    'He opened his eyes': 'چشمانش را باز کرد',
    'storm': 'طوفان',
    'Joan struggled to his feet': 'ژوآن به سختی بلند شد',
    'The deck was chaos': 'عرشه پر از هرج و مرج بود',
    'darkness': 'تاریکی',
    'ship': 'کشتی',
    'Lightning split the sky': 'رعد و برق آسمان را شکافت',
    'captain': 'ناخدا',
    '"All hands on deck!"': '"همه روی عرشه!"',
    'Joan grabbed a rope': 'ژوآن طنابی را گرفت',
    'wave': 'موج',
    'Time seemed to slow': 'زمان به نظر کند شده بود'
  },
  
  // Bengali
  bn: {
    'He opened his eyes': 'সে তার চোখ খুলল',
    'storm': 'ঝড়',
    'Joan struggled to his feet': 'জোয়ান পা দিয়ে দাঁড়াতে সংগ্রাম করল',
    'The deck was chaos': 'ডেক ছিল বিশৃঙ্খলা',
    'darkness': 'অন্ধকার',
    'ship': 'জাহাজ',
    'Lightning split the sky': 'বিদ্যুৎ আকাশকে বিভক্ত করল',
    'captain': 'ক্যাপ্টেন',
    '"All hands on deck!"': '"সবাই ডেকে!"',
    'Joan grabbed a rope': 'জোয়ান একটি দড়ি ধরল',
    'wave': 'ঢেউ',
    'Time seemed to slow': 'সময় ধীর হয়ে যাচ্ছে বলে মনে হল'
  },
  
  // Bulgarian
  bg: {
    'He opened his eyes': 'Той отвори очи',
    'storm': 'буря',
    'Joan struggled to his feet': 'Жоан се бореше да се изправи',
    'The deck was chaos': 'Палубата беше хаос',
    'darkness': 'мрак',
    'ship': 'кораб',
    'Lightning split the sky': 'Мълния разцепи небето',
    'captain': 'капитан',
    '"All hands on deck!"': '"Всички на палубата!"',
    'Joan grabbed a rope': 'Жоан сграбчи въже',
    'wave': 'вълна',
    'Time seemed to slow': 'Времето сякаш се забави'
  },
  
  // Croatian
  hr: {
    'He opened his eyes': 'Otvorio je oči',
    'storm': 'oluja',
    'Joan struggled to his feet': 'Joan se s mukom digao na noge',
    'The deck was chaos': 'Paluba je bila kaos',
    'darkness': 'tama',
    'ship': 'brod',
    'Lightning split the sky': 'Munja je rasporila nebo',
    'captain': 'kapetan',
    '"All hands on deck!"': '"Svi na palubu!"',
    'Joan grabbed a rope': 'Joan je zgrabio uže',
    'wave': 'val',
    'Time seemed to slow': 'Činilo se da vrijeme usporava'
  },
  
  // Serbian
  sr: {
    'He opened his eyes': 'Отворио је очи',
    'storm': 'олуја',
    'Joan struggled to his feet': 'Џоан се мучио да устане',
    'The deck was chaos': 'Палуба је била хаос',
    'darkness': 'тама',
    'ship': 'брод',
    'Lightning split the sky': 'Муња је расцепила небо',
    'captain': 'капетан',
    '"All hands on deck!"': '"Сви на палубу!"',
    'Joan grabbed a rope': 'Џоан је зграбио уже',
    'wave': 'талас',
    'Time seemed to slow': 'Чинило се да време успорава'
  },
  
  // Slovak
  sk: {
    'He opened his eyes': 'Otvoril oči',
    'storm': 'búrka',
    'Joan struggled to his feet': 'Joan sa s námahou postavil',
    'The deck was chaos': 'Na palube bol chaos',
    'darkness': 'tma',
    'ship': 'loď',
    'Lightning split the sky': 'Blesk roztrhol oblohu',
    'captain': 'kapitán',
    '"All hands on deck!"': '"Všetci na palubu!"',
    'Joan grabbed a rope': 'Joan chytil lano',
    'wave': 'vlna',
    'Time seemed to slow': 'Čas akoby spomalil'
  },
  
  // Catalan
  ca: {
    'He opened his eyes': 'Va obrir els ulls',
    'storm': 'tempesta',
    'Joan struggled to his feet': 'Joan va lluitar per posar-se dret',
    'The deck was chaos': 'La coberta era un caos',
    'darkness': 'foscor',
    'ship': 'vaixell',
    'Lightning split the sky': 'Un llamp va partir el cel',
    'captain': 'capità',
    '"All hands on deck!"': '"Tothom a coberta!"',
    'Joan grabbed a rope': 'Joan va agafar una corda',
    'wave': 'onada',
    'Time seemed to slow': 'El temps semblava alentir-se'
  }
};

// Helper function to get translation with fallback
export function getFallbackTranslation(key: string): string {
  return key;
}