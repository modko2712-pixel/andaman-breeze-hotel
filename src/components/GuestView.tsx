import { useState } from 'react';
import {
  BedDouble,
  Check,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  Gift,
  Home,
  Info,
  MapPin,
  Phone,
  Plug,
  ShieldCheck,
  Shirt,
  Sparkles,
  Umbrella,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
  X,
} from 'lucide-react';
import {
  AMENITIES_CATALOG,
  GUIDE_CATEGORIES,
  HOTEL_FACILITIES,
  HOTEL_INFO,
  LOCAL_GUIDE_PLACES,
} from '../data/hotelData';
import { AddLoanInput } from '../hooks/useLoanTracker';
import { AmenityItem, GuideCategory } from '../types';

interface GuestViewProps {
  onRequestAmenity: (input: AddLoanInput) => void;
  onNotify: (text: string, tone?: 'success' | 'info') => void;
}

function FacilityIcon({ icon }: { icon: 'clock' | 'utensils' | 'waves' | 'shield' }) {
  const cls = 'h-5 w-5 text-[#9F762D]';
  switch (icon) {
    case 'clock':
      return <Clock className={cls} />;
    case 'utensils':
      return <UtensilsCrossed className={cls} />;
    case 'waves':
      return <Waves className={cls} />;
    case 'shield':
      return <ShieldCheck className={cls} />;
  }
}

function AmenityIcon({ iconName }: { iconName: AmenityItem['iconName'] }) {
  const cls = 'h-5 w-5 text-[#102538]';
  switch (iconName) {
    case 'plug':
      return <Plug className={cls} />;
    case 'umbrella':
      return <Umbrella className={cls} />;
    case 'shirt':
      return <Shirt className={cls} />;
    case 'wind':
      return <Wind className={cls} />;
    case 'bed':
      return <BedDouble className={cls} />;
    case 'waves':
      return <Waves className={cls} />;
  }
}

export function GuestView({ onRequestAmenity, onNotify }: GuestViewProps) {
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory>('all');
  const [selectedAmenity, setSelectedAmenity] = useState<AmenityItem | null>(null);

  // Request modal form state
  const [roomNumber, setRoomNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [durationHours, setDurationHours] = useState(4);
  const [notes, setNotes] = useState('');

  const filteredPlaces =
    selectedCategory === 'all'
      ? LOCAL_GUIDE_PLACES
      : LOCAL_GUIDE_PLACES.filter((p) => p.category === selectedCategory);

  const handleCopyWifi = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(HOTEL_INFO.wifiPassword);
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = HOTEL_INFO.wifiPassword;
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopiedWifi(true);
      onNotify(`คัดลอกรหัส Wi-Fi "${HOTEL_INFO.wifiPassword}" เรียบร้อยแล้ว`);
      window.setTimeout(() => setCopiedWifi(false), 2600);
    } catch {
      onNotify(`รหัส Wi-Fi คือ ${HOTEL_INFO.wifiPassword}`, 'info');
    }
  };

  const handleCallFrontDesk = () => {
    onNotify(`กำลังติดต่อแผนกต้อนรับ (${HOTEL_INFO.frontDeskDisplay})`, 'info');
  };

  const openAmenityModal = (item: AmenityItem) => {
    setSelectedAmenity(item);
    setQuantity(1);
    setDurationHours(item.id === 'steam-iron' ? 3 : 24);
    setNotes('');
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmenity || !roomNumber.trim()) return;

    const dueAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
    onRequestAmenity({
      roomNumber: roomNumber.trim(),
      guestName: guestName.trim() || `Guest Room ${roomNumber.trim()}`,
      amenityId: selectedAmenity.id,
      amenityName: `${selectedAmenity.nameTh} (${selectedAmenity.nameEn})`,
      quantity,
      dueAt,
      source: 'guest-request',
      notes: notes.trim() || 'คำขอจาก Digital Welcome Book',
    });

    onNotify(
      `ส่งคำขอยืม "${selectedAmenity.nameTh}" ห้อง ${roomNumber.trim()} แล้ว — พนักงานจะจัดส่งภายใน 10 นาที`
    );
    setSelectedAmenity(null);
    setRoomNumber('');
    setGuestName('');
    setNotes('');
  };

  return (
    <div className="pb-24 md:pb-14">
      {/* 1. HERO SECTION */}
      <section id="welcome" className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 sm:pt-7">
        <div className="relative overflow-hidden rounded-3xl border border-[#E8E0D2] bg-[#102538] shadow-lg">
          {/* Background Image */}
          <img
            src={HOTEL_INFO.heroImage}
            alt="Andaman Breeze Hotel courtyard infinity pool at twilight"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1E2E] via-[#102538]/78 to-[#102538]/45" />

          <div className="relative z-10 flex flex-col gap-6 p-5 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
            {/* Left: Welcome Copy */}
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#DFC285]/40 bg-[#102538]/70 px-3 py-1 text-[11px] font-medium tracking-wider text-[#DFC285] uppercase backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{HOTEL_INFO.tagline}</span>
              </div>

              <div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-[#FAF7F2] sm:text-5xl">
                  {HOTEL_INFO.nameEn}
                </h1>
                <p className="mt-1 text-sm font-medium text-[#DFC285] sm:text-base">
                  {HOTEL_INFO.nameTh} • Digital Welcome Book
                </p>
              </div>

              <p className="text-sm leading-relaxed text-[#FAF7F2]/90 sm:text-base">
                {HOTEL_INFO.welcomeTh}
                <span className="mt-0.5 block text-xs text-[#FAF7F2]/70 sm:text-sm">
                  {HOTEL_INFO.welcomeEn}
                </span>
              </p>

              {/* Action Buttons: Call Front Desk + Hotel Map */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href={`tel:${HOTEL_INFO.frontDeskPhone}`}
                  onClick={handleCallFrontDesk}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C59B4E] px-4 py-3 text-sm font-semibold text-[#102538] shadow-md transition hover:bg-[#D5AE64] active:scale-[0.99] sm:flex-none sm:px-5"
                >
                  <Phone className="h-4 w-4" />
                  <span>โทรด่วนแผนกต้อนรับ</span>
                  <span className="hidden sm:inline text-xs font-medium opacity-80">(Call Front Desk)</span>
                </a>

                <a
                  href={HOTEL_INFO.hotelMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-medium text-[#FAF7F2] backdrop-blur-sm transition hover:bg-white/20"
                >
                  <MapPin className="h-4 w-4 text-[#DFC285]" />
                  <span>พิกัดโรงแรม</span>
                </a>
              </div>
            </div>

            {/* Right: Instant Wi-Fi Card */}
            <div className="w-full rounded-2xl border border-[#DFC285]/35 bg-[#FAF7F2]/95 p-4 text-[#102538] shadow-xl backdrop-blur-md lg:w-88">
              <div className="flex items-center justify-between gap-2 border-b border-[#E8E0D2] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102538] text-[#DFC285]">
                    <Wifi className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#9F762D]">
                      Complimentary Wi-Fi
                    </div>
                    <div className="text-sm font-bold text-[#102538]">อินเทอร์เน็ตความเร็วสูงฟรี</div>
                  </div>
                </div>
                <span className="rounded-full bg-[#EDF7F1] px-2.5 py-0.5 text-[11px] font-semibold text-[#1F6E4A]">
                  5G Ready
                </span>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-[#F3ECE0]/70 px-3 py-2">
                  <span className="text-xs text-[#5D6B78]">Wi-Fi Name</span>
                  <span className="font-mono text-xs font-semibold text-[#102538] sm:text-sm">
                    {HOTEL_INFO.wifiName}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#F3ECE0]/70 px-3 py-2">
                  <span className="text-xs text-[#5D6B78]">Password</span>
                  <span className="font-mono text-sm font-bold tracking-wide text-[#102538]">
                    {HOTEL_INFO.wifiPassword}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyWifi}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition cursor-pointer ${
                  copiedWifi
                    ? 'bg-[#1F6E4A] text-white'
                    : 'bg-[#102538] text-[#FAF7F2] hover:bg-[#1B3A54]'
                }`}
              >
                {copiedWifi ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>คัดลอกรหัสแล้ว! (Copied)</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-[#DFC285]" />
                    <span>คัดลอกรหัส Wi-Fi (Copy Password)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOTEL INFO CARDS */}
      <section id="hotel-info" className="mx-auto max-w-6xl px-4 pt-9 sm:px-6 sm:pt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9F762D]">
              Stay Essentials
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#102538] sm:text-2xl">
              ข้อมูลการเข้าพักและสิ่งอำนวยความสะดวก
            </h2>
          </div>
          <span className="hidden text-xs text-[#5D6B78] sm:inline">
            ติดต่อแผนกต้อนรับได้ตลอด 24 ชม. (กด 0)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {HOTEL_FACILITIES.map((card) => (
            <article
              key={card.id}
              className="flex flex-col rounded-2xl border border-[#E8E0D2] bg-white p-4.5 shadow-[0_2px_10px_rgba(16,37,56,0.03)] transition hover:border-[#C59B4E]/60 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F0E1] border border-[#E8D9B5]">
                  <FacilityIcon icon={card.icon} />
                </div>
                <span className="text-[11px] font-medium text-[#5D6B78]">{card.titleEn}</span>
              </div>

              <h3 className="mt-3.5 text-base font-bold text-[#102538]">{card.titleTh}</h3>
              <p className="mt-1 rounded-lg bg-[#FAF7F2] px-2.5 py-1.5 text-xs font-semibold text-[#1D3B56] border border-[#EDE6D8]">
                {card.primary}
              </p>

              <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-[#5D6B78]">
                {card.details.map((line, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C59B4E]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* 3. LOCAL GUIDE */}
      <section id="local-guide" className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9F762D]">
              Curated Concierge Picks
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#102538] sm:text-2xl">
              คู่มือแนะนำที่เที่ยว & ร้านอาหารใกล้เคียง
            </h2>
          </div>
          <p className="text-xs text-[#5D6B78] sm:text-sm">
            คัดสรรสถานที่น่าประทับใจในระยะเดินและขับรถใกล้โรงแรม
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className="no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          {GUIDE_CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? LOCAL_GUIDE_PLACES.length
                : LOCAL_GUIDE_PLACES.filter((p) => p.category === cat.id).length;
            const active = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition cursor-pointer sm:text-sm ${
                  active
                    ? 'border-[#102538] bg-[#102538] text-[#FAF7F2] shadow-sm'
                    : 'border-[#E2D8C7] bg-white text-[#102538] hover:border-[#C59B4E] hover:bg-[#FAF7F2]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active ? 'bg-[#C59B4E] text-[#102538]' : 'bg-[#F3ECE0] text-[#5D6B78]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Guide Cards Grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlaces.map((place) => (
            <article
              key={place.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8E0D2] bg-white shadow-[0_2px_12px_rgba(16,37,56,0.04)] transition hover:-translate-y-0.5 hover:border-[#C59B4E]/70 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3ECE0]">
                <img
                  src={place.image}
                  alt={place.nameEn}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#102538]/75 to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-[#FAF7F2]/95 px-2.5 py-1 text-[11px] font-semibold text-[#102538] shadow-sm backdrop-blur-sm">
                  {place.categoryLabel}
                </span>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-medium text-white">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#102538]/75 px-2.5 py-0.5 backdrop-blur-sm">
                    <MapPin className="h-3 w-3 text-[#DFC285]" />
                    {place.distance} • {place.walkTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div>
                  <h3 className="text-base font-bold leading-snug text-[#102538]">
                    {place.nameTh}
                  </h3>
                  <p className="text-xs font-medium text-[#9F762D]">{place.nameEn}</p>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#5D6B78]">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-[#C59B4E]" />
                  <span>เวลาเปิด-ปิด: {place.hours}</span>
                </div>

                <p className="mt-2.5 flex-1 text-xs leading-relaxed text-[#465564]">
                  {place.description}
                </p>

                <div className="mt-3 rounded-xl bg-[#FAF7F2] px-3 py-2 text-[11px] font-medium text-[#1D3B56] border border-[#EFE7D9]">
                  <span className="font-semibold text-[#9F762D]">Concierge Tip:</span>{' '}
                  {place.highlight}
                </div>

                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#102538] bg-[#102538] px-4 py-2.5 text-xs font-semibold text-[#FAF7F2] transition hover:bg-[#1D3B56]"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#DFC285]" />
                  <span>เปิดแผนที่นำทาง (Open in Google Maps)</span>
                  <ExternalLink className="h-3 w-3 opacity-75" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. REQUEST AMENITIES */}
      <section id="amenities" className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="rounded-3xl border border-[#E8E0D2] bg-gradient-to-br from-white via-[#FFFDF9] to-[#F7F0E1]/70 p-5 sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9F762D]">
                Complimentary Loan Service
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#102538] sm:text-2xl">
                เมนูขอยืมอุปกรณ์เพิ่มเติม (ฟรีสำหรับแขกเข้าพัก)
              </h2>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#102538] px-3 py-1 text-xs font-medium text-[#DFC285]">
              <Gift className="h-3.5 w-3.5" />
              ไม่มีค่าใช้จ่ายเพิ่มเติม • จัดส่งถึงห้องพัก
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {AMENITIES_CATALOG.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E8E0D2] bg-white p-4 shadow-xs transition hover:border-[#C59B4E]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7F0E1] border border-[#E8D9B5]">
                      <AmenityIcon iconName={item.iconName} />
                    </div>
                    <span className="rounded-full bg-[#EDF7F1] px-2.5 py-0.5 text-[11px] font-semibold text-[#1F6E4A]">
                      ยืมฟรี (Free)
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-[#102538]">{item.nameTh}</h3>
                  <p className="text-xs font-medium text-[#9F762D]">{item.nameEn}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[#5D6B78]">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EAE0] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#5D6B78]">สูงสุด {item.maxQty} ชิ้น/ห้อง</span>
                  <button
                    type="button"
                    onClick={() => openAmenityModal(item)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#C59B4E] px-3.5 py-2 text-xs font-semibold text-[#102538] transition hover:bg-[#D5AE64] cursor-pointer"
                  >
                    <span>ขอยืมอุปกรณ์</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Bottom Quick-Jump Bar */}
      <div className="fixed inset-x-0 bottom-3 z-30 mx-auto w-[calc(100%-1.5rem)] max-w-md md:hidden">
        <div className="grid grid-cols-4 rounded-2xl border border-[#DFC285]/30 bg-[#102538]/95 p-1.5 text-[#FAF7F2] shadow-xl backdrop-blur-md">
          <a
            href="#welcome"
            className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium text-[#DFC285] hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            <span>ต้อนรับ</span>
          </a>
          <a
            href="#hotel-info"
            className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium text-[#FAF7F2]/85 hover:bg-white/10"
          >
            <Info className="h-4 w-4" />
            <span>ข้อมูลที่พัก</span>
          </a>
          <a
            href="#local-guide"
            className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium text-[#FAF7F2]/85 hover:bg-white/10"
          >
            <Compass className="h-4 w-4" />
            <span>ที่เที่ยว</span>
          </a>
          <a
            href="#amenities"
            className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium text-[#FAF7F2]/85 hover:bg-white/10"
          >
            <Gift className="h-4 w-4" />
            <span>ยืมอุปกรณ์</span>
          </a>
        </div>
      </div>

      {/* Guest Amenity Request Modal */}
      {selectedAmenity && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#102538]/60 p-0 backdrop-blur-xs sm:items-center sm:p-4"
          onClick={() => setSelectedAmenity(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl border border-[#E8E0D2] bg-[#FAF7F2] p-5 shadow-2xl sm:rounded-3xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#E8E0D2] pb-3.5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9F762D]">
                  Complimentary Request
                </span>
                <h3 className="mt-0.5 text-lg font-bold text-[#102538]">
                  ขอยืม {selectedAmenity.nameTh}
                </h3>
                <p className="text-xs text-[#5D6B78]">{selectedAmenity.nameEn}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAmenity(null)}
                aria-label="ปิดหน้าต่าง"
                className="rounded-xl p-1.5 text-[#5D6B78] hover:bg-[#EFE7D9] hover:text-[#102538] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#102538]">
                    เลขห้องพัก (Room No.) <span className="text-[#B43C2F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="เช่น 205, 302"
                    className="mt-1 w-full rounded-xl border border-[#DDD3C3] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#102538] placeholder:font-normal placeholder:text-[#9AA5B1] focus:border-[#C59B4E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102538]">
                    จำนวน (Quantity)
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#DDD3C3] bg-white px-3 py-2.5 text-sm font-medium text-[#102538] focus:border-[#C59B4E] focus:outline-none"
                  >
                    {Array.from({ length: selectedAmenity.maxQty }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} ชิ้น
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102538]">
                  ชื่อผู้เข้าพัก (Guest Name — ไม่บังคับ)
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="เช่น คุณกานดา / Mr. Alex"
                  className="mt-1 w-full rounded-xl border border-[#DDD3C3] bg-white px-3.5 py-2.5 text-sm text-[#102538] placeholder:text-[#9AA5B1] focus:border-[#C59B4E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102538]">
                  ระยะเวลาที่คาดว่าจะใช้งาน
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {[
                    { label: '3 ชม.', hours: 3 },
                    { label: 'วันนี้ (8 ชม.)', hours: 8 },
                    { label: 'คืนตอนเช็คเอาท์', hours: 24 },
                  ].map((opt) => (
                    <button
                      key={opt.hours}
                      type="button"
                      onClick={() => setDurationHours(opt.hours)}
                      className={`rounded-xl border px-2 py-2 text-xs font-semibold transition cursor-pointer ${
                        durationHours === opt.hours
                          ? 'border-[#102538] bg-[#102538] text-[#FAF7F2]'
                          : 'border-[#DDD3C3] bg-white text-[#102538] hover:border-[#C59B4E]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102538]">
                  หมายเหตุเพิ่มเติม (Optional Note)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="เช่น ขอหมอนแบบนุ่ม / ส่งช่วง 18:00 น."
                  className="mt-1 w-full rounded-xl border border-[#DDD3C3] bg-white px-3.5 py-2.5 text-sm text-[#102538] placeholder:text-[#9AA5B1] focus:border-[#C59B4E] focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-[#F3ECE0]/70 px-3 py-2 text-[11px] text-[#5D6B78]">
                {selectedAmenity.note} • รายการจะถูกส่งไปยังระบบพนักงานต้อนรับทันที
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedAmenity(null)}
                  className="flex-1 rounded-xl border border-[#DDD3C3] bg-white px-4 py-2.5 text-sm font-semibold text-[#102538] hover:bg-[#F3ECE0] cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-2 rounded-xl bg-[#102538] px-4 py-2.5 text-sm font-semibold text-[#FAF7F2] shadow-sm transition hover:bg-[#1B3A54] cursor-pointer"
                >
                  ยืนยันการขอยืม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
