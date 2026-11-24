import { AmenityItem, LoanRecord, LocalGuidePlace } from '../types';

export const HOTEL_INFO = {
  nameEn: 'Andaman Breeze Hotel',
  nameTh: 'อันดามัน บรีซ โฮเทล',
  tagline: 'Boutique Coastal Retreat • Southern Thailand',
  welcomeTh: 'ยินดีต้อนรับสู่การพักผ่อนอันอบอุ่นริมทะเลอันดามัน',
  welcomeEn: 'Warm coastal hospitality tailored for your restful stay.',
  wifiName: 'AndamanBreeze_Guest_5G',
  wifiPassword: 'Breeze@2026',
  frontDeskPhone: '+6676381999',
  frontDeskDisplay: '076-381-999 (กด 0 จากห้องพัก)',
  hotelMapsUrl: 'https://maps.app.goo.gl/KPqtY4k29DdCWhLj9',
  heroImage: '/images/hero-hotel.jpg',
};

export const HOTEL_FACILITIES = [
  {
    id: 'checkin',
    titleTh: 'เวลา Check-in / Check-out',
    titleEn: 'Arrival & Departure',
    icon: 'clock' as const,
    primary: 'Check-in 14:00 น. • Check-out 12:00 น.',
    details: [
      'ฝากสัมภาระฟรีที่ล็อบบี้ได้ตลอด 24 ชม.',
      'ต้องการ Late Check-out กรุณาแจ้งล่วงหน้าก่อน 10:00 น.',
    ],
  },
  {
    id: 'breakfast',
    titleTh: 'ห้องอาหารเช้า',
    titleEn: 'The Breeze Terrace',
    icon: 'utensils' as const,
    primary: 'ทุกวัน 06:30 – 10:30 น.',
    details: [
      'ชั้น 1 ริมสระว่ายน้ำ (Poolside Pavilion)',
      'บุฟเฟต์อาหารเช้านานาชาติ, ขนมจีนน้ำยาปู และกาแฟคั่วสด',
    ],
  },
  {
    id: 'pool-gym',
    titleTh: 'สระว่ายน้ำ & ฟิตเนส',
    titleEn: 'Saltwater Pool & Studio',
    icon: 'waves' as const,
    primary: 'สระว่ายน้ำ 07:00 – 21:00 น. • ฟิตเนส 06:00 – 22:00 น.',
    details: [
      'สระระบบเกลือชั้น 1 พร้อมบาร์เครื่องดื่มริมสระ',
      'ฟิตเนสชั้น 2 ใช้คีย์การ์ดห้องพักแตะเข้าใช้งาน',
    ],
  },
  {
    id: 'rules',
    titleTh: 'กฎระเบียบเบื้องต้น',
    titleEn: 'House Etiquette',
    icon: 'shield' as const,
    primary: 'Quiet Hours 22:00 – 07:00 น.',
    details: [
      'ห้องพักปลอดบุหรี่ 100% (มีจุดสูบบุหรี่บริเวณสวนด้านข้าง)',
      'รับผ้าขนหนูชายหาดฟรีที่เคาน์เตอร์ต้อนรับ (Beach Towel Service)',
    ],
  },
];

export const GUIDE_CATEGORIES = [
  { id: 'all' as const, label: 'ทั้งหมด', subLabel: 'All' },
  { id: 'dining' as const, label: 'ร้านอาหาร / คาเฟ่', subLabel: 'Dining & Cafe' },
  { id: 'beach' as const, label: 'ชายหาด / จุดชมวิว', subLabel: 'Beach & Views' },
  { id: 'essentials' as const, label: 'ร้านสะดวกซื้อ / ยา', subLabel: 'Essentials' },
];

export const LOCAL_GUIDE_PLACES: LocalGuidePlace[] = [
  {
    id: 'place-seafood',
    nameTh: 'ครัวริมเล อันดามัน ซีฟู้ด',
    nameEn: 'Rimlay Andaman Seafood Terrace',
    category: 'dining',
    categoryLabel: 'ร้านอาหาร / คาเฟ่',
    distance: '320 ม.',
    walkTime: 'เดิน 4 นาที',
    hours: '11:00 – 22:30 น.',
    description:
      'ร้านอาหารทะเลพื้นบ้านบรรยากาศริมหาด โดดเด่นด้วยกุ้งลายเสือย่างเตาถ่าน แกงส้มปลากะพงยอดมะพร้าว และน้ำจิ้มซีฟู้ดสูตรเด็ด',
    highlight: 'แนะนำจองโต๊ะริมหาดก่อน 17:30 น.',
    image: '/images/guide-seafood.jpg',
    mapsUrl: 'https://maps.app.goo.gl/KPqtY4k29DdCWhLj9',
  },
  {
    id: 'place-cafe',
    nameTh: 'ซอลต์ แอนด์ ซัน คาเฟ่',
    nameEn: 'Salt & Sun Specialty Coffee',
    category: 'dining',
    categoryLabel: 'ร้านอาหาร / คาเฟ่',
    distance: '180 ม.',
    walkTime: 'เดิน 2 นาที',
    hours: '07:30 – 18:00 น.',
    description:
      'คาเฟ่สไตล์มินิมอลโทนสีทราย เสิร์ฟกาแฟเมล็ดไทย-เอธิโอเปียคั่วกลาง ครัวซองต์อบใหม่ และ Coconut Cold Brew ยอดนิยม',
    highlight: 'โชว์คีย์การ์ดโรงแรมรับส่วนลด 10%',
    image: '/images/guide-cafe.jpg',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Specialty+Coffee+Cafe+Phuket+Andaman',
  },
  {
    id: 'place-beach',
    nameTh: 'หาดอันดามัน บรีซ & อ่าวทรายทอง',
    nameEn: 'Golden Cove Beach',
    category: 'beach',
    categoryLabel: 'ชายหาด / จุดชมวิว',
    distance: '240 ม.',
    walkTime: 'เดิน 3 นาที',
    hours: 'เปิดตลอด 24 ชม.',
    description:
      'ชายหาดน้ำใสเงียบสงบ เหมาะสำหรับเดินรับลมยามเช้า ว่ายน้ำ และพายแพดเดิลบอร์ด สามารถยืมเสื่อและผ้าขนหนูจากโรงแรมไปได้ฟรี',
    highlight: 'น้ำใสที่สุดช่วง 08:00 – 11:00 น.',
    image: '/images/guide-beach.jpg',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kata+Noi+Beach+Phuket',
  },
  {
    id: 'place-sunset',
    nameTh: 'จุดชมวิวผาตะวันลับฟ้า',
    nameEn: 'Andaman Horizon Sunset Point',
    category: 'beach',
    categoryLabel: 'ชายหาด / จุดชมวิว',
    distance: '1.4 กม.',
    walkTime: 'ขับรถ 5 นาที',
    hours: '06:00 – 20:00 น.',
    description:
      'จุดชมวิวหน้าผาริมทะเลแบบพาโนรามา 180 องศา มองเห็นเส้นขอบฟ้าสีทองและเกาะน้อยใหญ่กลางทะเลอันดามันช่วงพระอาทิตย์ตก',
    highlight: 'พระอาทิตย์ตกประมาณ 18:10 น.',
    image: '/images/guide-sunset.jpg',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Promthep+Cape+Viewpoint+Phuket',
  },
  {
    id: 'place-market',
    nameTh: 'เซเว่น อีเลฟเว่น & พรอมเมอนาด มาร์เก็ต',
    nameEn: '7-Eleven & Breeze Promenade',
    category: 'essentials',
    categoryLabel: 'ร้านสะดวกซื้อ / ยา',
    distance: '120 ม.',
    walkTime: 'เดิน 2 นาที',
    hours: 'เปิดตลอด 24 ชม.',
    description:
      'ร้านสะดวกซื้อ 24 ชั่วโมง พร้อมตู้ ATM ทุกธนาคาร ร้านแลกเปลี่ยนเงินตรา และของใช้เดินทางครบครัน อยู่ปากซอยด้านซ้ายของโรงแรม',
    highlight: 'มีตู้ ATM & บริการแลกเงินติดกัน',
    image: '/images/guide-market.jpg',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=7-Eleven+near+Kata+Beach+Phuket',
  },
  {
    id: 'place-pharmacy',
    nameTh: 'อันดามัน แคร์ ฟาร์มาซี (ร้านยาเภสัชกร)',
    nameEn: 'Andaman Care Pharmacy',
    category: 'essentials',
    categoryLabel: 'ร้านสะดวกซื้อ / ยา',
    distance: '210 ม.',
    walkTime: 'เดิน 3 นาที',
    hours: '08:30 – 22:00 น.',
    description:
      'ร้านขายยาที่มีเภสัชกรสื่อสารได้ทั้งภาษาไทยและภาษาอังกฤษ จำหน่ายยาสามัญ ครีมกันแดด เจลว่านหางจระเข้ และอุปกรณ์ปฐมพยาบาล',
    highlight: 'เภสัชกรประจำร้านพูดภาษาอังกฤษได้',
    image: '/images/guide-pharmacy.jpg',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pharmacy+Kata+Beach+Phuket',
  },
];

export const AMENITIES_CATALOG: AmenityItem[] = [
  {
    id: 'universal-adapter',
    nameTh: 'ปลั๊กแปลงไฟสากล',
    nameEn: 'Universal Adapter',
    description: 'รองรับหัวปลั๊ก US / UK / EU / AU พร้อมช่องชาร์จ USB-C Fast Charge',
    iconName: 'plug',
    maxQty: 3,
    note: 'คืนเมื่อเช็คเอาท์หรือเมื่อใช้งานเสร็จ',
  },
  {
    id: 'umbrella',
    nameTh: 'ร่มกันแดด-กันฝน',
    nameEn: 'Boutique Umbrella',
    description: 'ร่มผ้าเคลือบกัน UV ขนาดใหญ่สี Deep Navy สำหรับเดินเที่ยวหรือกันฝน',
    iconName: 'umbrella',
    maxQty: 2,
    note: 'ให้บริการฟรีไม่จำกัดเวลาในระหว่างเข้าพัก',
  },
  {
    id: 'steam-iron',
    nameTh: 'เตารีดไอน้ำ & โต๊ะรองรีด',
    nameEn: 'Steam Iron & Board',
    description: 'เตารีดไอน้ำถนอมผ้าพร้อมโต๊ะรองรีดแบบพับเก็บได้ ส่งตรงถึงห้องพัก',
    iconName: 'shirt',
    maxQty: 1,
    note: 'แนะนำยืมครั้งละ 2–3 ชั่วโมงเพื่อให้แขกท่านอื่นใช้งานต่อได้',
  },
  {
    id: 'hair-dryer',
    nameTh: 'ไดร์เป่าผมกำลังสูง',
    nameEn: 'Ionic Hair Dryer',
    description: 'ไดร์เป่าผมระบบไอออนิก 2000W เป่าแห้งไว ถนอมเส้นผม พร้อมหัวเป่ากระจายลม',
    iconName: 'wind',
    maxQty: 1,
    note: 'ยืมเพิ่มเติมนอกเหนือจากเครื่องมาตรฐานในห้อง',
  },
  {
    id: 'extra-pillow',
    nameTh: 'หมอนเสริมเพื่อสุขภาพ',
    nameEn: 'Extra Ergonomic Pillow',
    description: 'เลือกได้ทั้งหมอนขนเป็ดเทียมสัมผัสนุ่ม (Soft) หรือหมอนยางพารารองรับต้นคอ (Firm)',
    iconName: 'bed',
    maxQty: 2,
    note: 'จัดส่งพร้อมปลอกหมอนผ้าฝ้ายออร์แกนิก 400 เส้นด้าย',
  },
  {
    id: 'beach-set',
    nameTh: 'ชุดเสื่อชายหาด & ผ้าขนหนู',
    nameEn: 'Beach Mat & Towel Set',
    description: 'กระเป๋าสานพร้อมเสื่อชายหาดและผ้าขนหนูผืนใหญ่ 2 ผืน สำหรับเดินไปริมหาด',
    iconName: 'waves',
    maxQty: 2,
    note: 'นำมาส่งคืนที่ล็อบบี้หลังกลับจากชายหาด',
  },
];

export function createInitialMockLoans(): LoanRecord[] {
  const now = Date.now();
  const hour = 60 * 60 * 1000;

  return [
    {
      id: 'LN-2026-01',
      roomNumber: '205',
      guestName: 'คุณพิมพ์ชนก รัตนากร',
      amenityId: 'steam-iron',
      amenityName: 'เตารีดไอน้ำ & โต๊ะรองรีด (Steam Iron)',
      quantity: 1,
      borrowedAt: new Date(now - 5 * hour).toISOString(),
      dueAt: new Date(now - 1.5 * hour).toISOString(), // Overdue
      source: 'staff',
      notes: 'ใช้เตรียมชุดงานเลี้ยงเย็น',
    },
    {
      id: 'LN-2026-02',
      roomNumber: '412',
      guestName: 'Mr. Daniel Lindqvist',
      amenityId: 'universal-adapter',
      amenityName: 'ปลั๊กแปลงไฟสากล (Universal Adapter)',
      quantity: 2,
      borrowedAt: new Date(now - 18 * hour).toISOString(),
      dueAt: new Date(now - 0.75 * hour).toISOString(), // Overdue
      source: 'staff',
      notes: 'EU to TH plug + USB-C',
    },
    {
      id: 'LN-2026-03',
      roomNumber: '101',
      guestName: 'คุณกิตติพงศ์ วัฒนา',
      amenityId: 'umbrella',
      amenityName: 'ร่มกันแดด-กันฝน (Boutique Umbrella)',
      quantity: 2,
      borrowedAt: new Date(now - 1.5 * hour).toISOString(),
      dueAt: new Date(now + 4.5 * hour).toISOString(), // Active
      source: 'guest-request',
      notes: 'เดินไปร้านกาแฟและชายหาด',
    },
    {
      id: 'LN-2026-04',
      roomNumber: '308',
      guestName: 'Ms. Hannah Park',
      amenityId: 'extra-pillow',
      amenityName: 'หมอนเสริมเพื่อสุขภาพ (Extra Pillow)',
      quantity: 1,
      borrowedAt: new Date(now - 3 * hour).toISOString(),
      dueAt: new Date(now + 24 * hour).toISOString(), // Active until tomorrow check-out
      source: 'staff',
      notes: 'Soft microfiber pillow',
    },
    {
      id: 'LN-2026-05',
      roomNumber: '214',
      guestName: 'คุณณัฐิดา & ครอบครัว',
      amenityId: 'beach-set',
      amenityName: 'ชุดเสื่อชายหาด & ผ้าขนหนู (Beach Set)',
      quantity: 2,
      borrowedAt: new Date(now - 2 * hour).toISOString(),
      dueAt: new Date(now + 3 * hour).toISOString(), // Active
      source: 'guest-request',
    },
    {
      id: 'LN-2026-06',
      roomNumber: '109',
      guestName: 'Mr. Lucas Moreau',
      amenityId: 'hair-dryer',
      amenityName: 'ไดร์เป่าผมกำลังสูง (Ionic Hair Dryer)',
      quantity: 1,
      borrowedAt: new Date(now - 4.5 * hour).toISOString(),
      dueAt: new Date(now - 2 * hour).toISOString(),
      returnedAt: new Date(now - 2.2 * hour).toISOString(), // Returned today
      source: 'staff',
    },
    {
      id: 'LN-2026-07',
      roomNumber: '303',
      guestName: 'คุณศิริพร ชัยมงคล',
      amenityId: 'universal-adapter',
      amenityName: 'ปลั๊กแปลงไฟสากล (Universal Adapter)',
      quantity: 1,
      borrowedAt: new Date(now - 6 * hour).toISOString(),
      dueAt: new Date(now - 1 * hour).toISOString(),
      returnedAt: new Date(now - 1.3 * hour).toISOString(), // Returned today
      source: 'guest-request',
    },
  ];
}
