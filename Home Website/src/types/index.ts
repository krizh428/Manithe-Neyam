export type Language = 'ta' | 'en';

export type SectionId = 'hero' | 'about' | 'locations' | 'services' | 'founder' | 'vision' | 'activities' | 'gallery' | 'stats' | 'documents' | 'contact';

export interface NavItem {
  id: SectionId;
  labelTa: string;
  labelEn: string;
  href: string;
}

export interface HomeLocation {
  id: string;
  number: string;
  titleTa: string;
  titleEn: string;
  locationTa: string;
  locationEn: string;
  descTa: string;
  descEn: string;
  detailsTa: string;
  detailsEn: string;
  capacityTa: string;
  capacityEn: string;
  /** Contact number for this home (optional). */
  phone?: string;
  /** Contact email for this home (optional). */
  email?: string;
  image: string;
  /** Up to 6 photos shown as a slider. When missing, only `image` is shown. `image` always mirrors the first one. */
  images?: string[];
  mapUrl: string;
  featuresTa: string[];
  featuresEn: string[];
}

export interface ServiceItem {
  id: string;
  iconName: string;
  titleTa: string;
  titleEn: string;
  descTa: string;
  descEn: string;
  whyTa: string;
  whyEn: string;
  whenTa: string;
  whenEn: string;
  dateTa: string;
  dateEn: string;
  image: string;
  longDescTa: string;
  longDescEn: string;
}

export type ActivityCategory = 'all' | 'education' | 'food' | 'medical' | 'senior' | 'community';

export interface ActivityItem {
  id: string;
  category: ActivityCategory;
  titleTa: string;
  titleEn: string;
  descTa: string;
  descEn: string;
  dateTa: string;
  dateEn: string;
  beneficiariesTa: string;
  beneficiariesEn: string;
  image: string;
  /** Up to 6 photos shown as a slider; `image` mirrors the first one. */
  images?: string[];
}

export interface GalleryItem {
  id: string;
  category: ActivityCategory;
  titleTa: string;
  titleEn: string;
  captionTa: string;
  captionEn: string;
  momentDateTa: string;
  momentDateEn: string;
  detailedStoryTa: string;
  detailedStoryEn: string;
  image: string;
  altTa: string;
  altEn: string;
  /** Up to 6 photos; `image` mirrors the first one. */
  images?: string[];
}

export interface StatisticItem {
  id: string;
  value: number;
  suffix: string;
  labelTa: string;
  labelEn: string;
  descTa: string;
  descEn: string;
}

export interface FounderInfo {
  titleTa: string;
  titleEn: string;
  nameTa: string;
  nameEn: string;
  roleTa: string;
  roleEn: string;
  phone: string;
  quoteTa: string;
  quoteEn: string;
  bioTa: string[];
  bioEn: string[];
  image: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface SupportInquiryData {
  name: string;
  phone: string;
  email: string;
  supportType: 'education' | 'food' | 'medical' | 'volunteer' | 'general';
  message?: string;
}

export interface DocumentImage {
  url: string;
  name: string;
  size: number;
}

export interface Attachment {
  type: 'pdf' | 'image';
  name: string;
  url?: string;
}

export interface FieldChange {
  field: string;
  from?: string;
  to?: string;
  /** 'image' values are urls and rendered as thumbnails */
  kind?: 'text' | 'image';
}

export interface DocumentChange {
  at: string;
  by: string;
  action: 'created' | 'updated';
  note?: string;
  changes: FieldChange[];
  attachments: Attachment[];
}

export interface DocumentItem {
  _id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  /** Website section this document belongs to ('general' = not tied to a section). */
  section?: string;
  images?: DocumentImage[];
  changeLog?: DocumentChange[];
  displayOrder: number;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

/** One line in the admin "Change History": what was edited, from what, to what. */
export interface ChangeEntry {
  id: string;
  at: string;
  by: string;
  section: string;
  sectionLabel: string;
  /** Stable id of the edited item, so renaming an item keeps merging into one entry. */
  targetId?: string;
  target: string;
  action: 'edit' | 'add' | 'delete' | 'reset' | 'document';
  note?: string;
  changes: FieldChange[];
  attachments?: Attachment[];
}

/** The homepage announcement popup (image + on/off switch). */
export interface AnnouncementItem {
  imageUrl: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt: string;
}

export interface UserItem {
  _id: string;
  username: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
}
