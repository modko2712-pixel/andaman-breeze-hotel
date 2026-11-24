export type AppMode = 'guest' | 'staff';

export type GuideCategory = 'all' | 'dining' | 'beach' | 'essentials';

export interface LocalGuidePlace {
  id: string;
  nameTh: string;
  nameEn: string;
  category: Exclude<GuideCategory, 'all'>;
  categoryLabel: string;
  distance: string;
  walkTime: string;
  hours: string;
  description: string;
  highlight: string;
  image: string;
  mapsUrl: string;
}

export interface AmenityItem {
  id: string;
  nameTh: string;
  nameEn: string;
  description: string;
  iconName: 'plug' | 'umbrella' | 'shirt' | 'wind' | 'bed' | 'waves';
  maxQty: number;
  note: string;
}

export type LoanStatus = 'active' | 'overdue' | 'returned';

export interface LoanRecord {
  id: string;
  roomNumber: string;
  guestName: string;
  amenityId: string;
  amenityName: string;
  quantity: number;
  borrowedAt: string; // ISO string
  dueAt: string; // ISO string
  returnedAt?: string; // ISO string
  source?: 'staff' | 'guest-request';
  notes?: string;
}
