import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import {
  SITE_BRAND,
  HERO_DATA,
  INTRODUCTION_DATA,
  HOME_LOCATIONS,
  SERVICES_DATA,
  GALLERY_ITEMS,
  FOUNDER_DATA,
  ACTIVITIES_DATA,
  STATISTICS_DATA,
  VISION_MISSION_DATA,
} from '../data/siteData';
import { IMAGES } from '../assets/images';
import { api, ADMIN_TOKEN_KEY } from '../services/api';
import { diffObjects } from './changeTracking';
import type {
  HomeLocation,
  ServiceItem,
  GalleryItem,
  FounderInfo,
  ActivityItem,
  StatisticItem,
  ChangeEntry,
  FieldChange,
  Attachment,
} from '../types';

export interface SiteBrandData {
  nameTa: string;
  nameEn: string;
  fullNameTa: string;
  fullNameEn: string;
  taglineTa: string;
  taglineEn: string;
  founderNameTa: string;
  founderNameEn: string;
  founderRoleTa: string;
  founderRoleEn: string;
  locationBriefTa?: string;
  locationBriefEn?: string;
  fullAddressTa: string;
  fullAddressEn: string;
  phone1: string;
  phone2: string;
  whatsapp1: string;
  whatsapp2: string;
  email: string;
  website: string;
  websiteUrl: string;
  timingsTa?: string;
  timingsEn?: string;
}

export interface HeroContentData {
  titleTa: string;
  titleEn: string;
  subtitleTa: string;
  subtitleEn: string;
  image?: string;
}

export interface AboutContentData {
  titleTa: string;
  titleEn: string;
  quoteTa: string;
  quoteEn: string;
  paragraphsTa: string[];
  paragraphsEn: string[];
  image?: string;
}

export interface VisionBlock {
  badgeTa: string;
  badgeEn: string;
  titleTa: string;
  titleEn: string;
  textTa: string;
  textEn: string;
  pointsTa: string[];
  pointsEn: string[];
  image: string;
}

export interface VisionMissionData {
  vision: VisionBlock;
  mission: VisionBlock;
}

/** What a caller can log for something that happened outside the site content (e.g. documents). */
export interface ExternalChange {
  section: string;
  sectionLabel: string;
  target: string;
  targetId?: string;
  action: ChangeEntry['action'];
  note?: string;
  changes: FieldChange[];
  attachments?: Attachment[];
  by?: string;
  at?: string;
}

interface AdminDataContextType {
  isAdmin: boolean;
  adminUser: string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  /** Call after the login id was changed on the server so the header shows the new name. */
  setAdminUsername: (username: string) => void;
  brand: SiteBrandData;
  updateBrand: (data: Partial<SiteBrandData>) => void;
  hero: HeroContentData;
  updateHero: (data: Partial<HeroContentData>) => void;
  about: AboutContentData;
  updateAbout: (data: Partial<AboutContentData>) => void;
  locations: HomeLocation[];
  updateLocation: (id: string, updated: Partial<HomeLocation>) => void;
  addLocation: (item: HomeLocation) => void;
  deleteLocation: (id: string) => void;
  services: ServiceItem[];
  addService: (item: ServiceItem) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  gallery: GalleryItem[];
  addGalleryItem: (item: GalleryItem) => void;
  updateGalleryItem: (id: string, updated: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  activities: ActivityItem[];
  addActivity: (item: ActivityItem) => void;
  updateActivity: (id: string, updated: Partial<ActivityItem>) => void;
  deleteActivity: (id: string) => void;
  statistics: StatisticItem[];
  addStatistic: (item: StatisticItem) => void;
  updateStatistic: (id: string, updated: Partial<StatisticItem>) => void;
  deleteStatistic: (id: string) => void;
  vision: VisionMissionData;
  updateVisionBlock: (block: 'vision' | 'mission', data: Partial<VisionBlock>) => void;
  founder: FounderInfo;
  updateFounder: (data: Partial<FounderInfo>) => void;
  resetToDefaults: () => void;
  /** True while there are edits that have not been saved yet. */
  hasUnsavedChanges: boolean;
  /** Saves every pending edit and records what changed in the history. Returns how many changes were recorded. */
  saveChanges: (note?: string) => number;
  /** Throws away every pending edit and goes back to the last saved content. */
  discardChanges: () => void;
  changes: ChangeEntry[];
  logExternalChange: (entry: ExternalChange) => void;
  annotateChange: (id: string, note: string) => void;
  clearChanges: () => void;
}

const STORAGE_KEYS = {
  BRAND: 'manithaneyam_data_brand',
  HERO: 'manithaneyam_data_hero',
  ABOUT: 'manithaneyam_data_about',
  LOCATIONS: 'manithaneyam_data_locations',
  SERVICES: 'manithaneyam_data_services',
  GALLERY: 'manithaneyam_data_gallery',
  FOUNDER: 'manithaneyam_data_founder',
  ACTIVITIES: 'manithaneyam_data_activities',
  STATISTICS: 'manithaneyam_data_statistics',
  VISION: 'manithaneyam_data_vision',
  CHANGES: 'manithaneyam_data_changelog',
  ADMIN_USER: 'manithaneyam_admin_user',
};

const MAX_LOG_ENTRIES = 300;

const DEFAULT_HERO: HeroContentData = {
  titleTa: HERO_DATA.titleTa,
  titleEn: HERO_DATA.titleEn,
  subtitleTa: HERO_DATA.subtitleTa,
  subtitleEn: HERO_DATA.subtitleEn,
  image: IMAGES.hero,
};

const DEFAULT_ABOUT: AboutContentData = {
  titleTa: INTRODUCTION_DATA.titleTa,
  titleEn: INTRODUCTION_DATA.titleEn,
  quoteTa: INTRODUCTION_DATA.quoteTa,
  quoteEn: INTRODUCTION_DATA.quoteEn,
  paragraphsTa: INTRODUCTION_DATA.paragraphsTa,
  paragraphsEn: INTRODUCTION_DATA.paragraphsEn,
  image: IMAGES.introduction,
};

const readStored = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved) as T;
  } catch {
    /* storage unavailable or corrupt: use defaults */
  }
  return fallback;
};

export interface DraftStore<T> {
  value: T;
  /** Latest (possibly unsaved) value, readable synchronously. */
  ref: React.MutableRefObject<T>;
  /** Last saved value. */
  saved: React.MutableRefObject<T>;
  set: (next: T) => void;
  /** Marks the current value as saved and writes it to localStorage. */
  commit: () => void;
  revert: () => void;
  resetTo: (next: T) => void;
}

/** State that is edited as a draft and only written to localStorage when committed (saved). */
function useDraft<T>(key: string, initial: T, merge = false): DraftStore<T> {
  const [value, setValue] = useState<T>(() => {
    const stored = readStored<T | null>(key, null);
    if (stored === null) return initial;
    return merge && typeof initial === 'object' && !Array.isArray(initial)
      ? ({ ...initial, ...stored } as T)
      : stored;
  });
  const ref = useRef(value);
  const saved = useRef(value);

  const set = useCallback((next: T) => {
    ref.current = next;
    setValue(next);
  }, []);

  const commit = useCallback(() => {
    saved.current = ref.current;
    try {
      localStorage.setItem(key, JSON.stringify(ref.current));
    } catch {
      /* quota exceeded: keep the in-memory value */
    }
  }, [key]);

  const revert = useCallback(() => {
    ref.current = saved.current;
    setValue(saved.current);
  }, []);

  const resetTo = useCallback(
    (next: T) => {
      ref.current = next;
      saved.current = next;
      setValue(next);
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
    [key]
  );

  return { value, ref, saved, set, commit, revert, resetTo };
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return false;
    }
  });
  const [adminUser, setAdminUser] = useState<string>(() => readStored<string>(STORAGE_KEYS.ADMIN_USER, ''));

  const brandS = useDraft<SiteBrandData>(STORAGE_KEYS.BRAND, SITE_BRAND, true);
  const heroS = useDraft<HeroContentData>(STORAGE_KEYS.HERO, DEFAULT_HERO, true);
  const aboutS = useDraft<AboutContentData>(STORAGE_KEYS.ABOUT, DEFAULT_ABOUT, true);
  const locationsS = useDraft<HomeLocation[]>(STORAGE_KEYS.LOCATIONS, HOME_LOCATIONS);
  const servicesS = useDraft<ServiceItem[]>(STORAGE_KEYS.SERVICES, SERVICES_DATA);
  const galleryS = useDraft<GalleryItem[]>(STORAGE_KEYS.GALLERY, GALLERY_ITEMS);
  const founderS = useDraft<FounderInfo>(STORAGE_KEYS.FOUNDER, FOUNDER_DATA, true);
  const activitiesS = useDraft<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, ACTIVITIES_DATA);
  const statisticsS = useDraft<StatisticItem[]>(STORAGE_KEYS.STATISTICS, STATISTICS_DATA);
  const visionS = useDraft<VisionMissionData>(STORAGE_KEYS.VISION, VISION_MISSION_DATA as VisionMissionData);
  const changesS = useDraft<ChangeEntry[]>(STORAGE_KEYS.CHANGES, []);

  const brand = brandS.value;
  const hero = heroS.value;
  const about = aboutS.value;
  const locations = locationsS.value;
  const services = servicesS.value;
  const gallery = galleryS.value;
  const founder = founderS.value;
  const activities = activitiesS.value;
  const statistics = statisticsS.value;
  const vision = visionS.value;
  const changes = changesS.value;

  const adminUserRef = useRef(adminUser);
  adminUserRef.current = adminUser;

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Every store whose edits wait for "Save"
  const contentStores = [
    brandS,
    heroS,
    aboutS,
    locationsS,
    servicesS,
    galleryS,
    founderS,
    activitiesS,
    statisticsS,
    visionS,
  ] as unknown as DraftStore<unknown>[];

  const refreshDirty = () =>
    setHasUnsavedChanges(contentStores.some((st) => JSON.stringify(st.ref.current) !== JSON.stringify(st.saved.current)));

  // ---------------------------------
  // Change history
  // ---------------------------------
  const appendChanges = (entries: ChangeEntry[]) => {
    changesS.set([...entries, ...changesS.ref.current].slice(0, MAX_LOG_ENTRIES));
    changesS.commit();
  };

  const newEntryId = (n = 0) => `chg-${Date.now()}-${n}-${Math.round(Math.random() * 1e6)}`;

  const logExternalChange = (entry: ExternalChange) =>
    appendChanges([
      { ...entry, id: newEntryId(), at: entry.at || new Date().toISOString(), by: entry.by || adminUserRef.current || 'admin' },
    ]);

  const annotateChange = (id: string, note: string) => {
    changesS.set(changesS.ref.current.map((e) => (e.id === id ? { ...e, note } : e)));
    changesS.commit();
  };

  const clearChanges = () => {
    changesS.set([]);
    changesS.commit();
  };

  // ---------------------------------
  // Editing (drafts until saved)
  // ---------------------------------
  const itemTitle = (item: { titleEn?: string; titleTa?: string; labelEn?: string; labelTa?: string; id: string }) =>
    item.titleEn || item.titleTa || item.labelEn || item.labelTa || item.id;

  const editObject = <T extends object>(store: DraftStore<T>, patch: Partial<T>) => {
    store.set({ ...store.ref.current, ...patch });
    refreshDirty();
  };

  const editListItem = <T extends { id: string }>(store: DraftStore<T[]>, id: string, patch: Partial<T>) => {
    store.set(store.ref.current.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    refreshDirty();
  };

  const addListItem = <T extends { id: string }>(store: DraftStore<T[]>, item: T, append = false) => {
    store.set(append ? [...store.ref.current, item] : [item, ...store.ref.current]);
    refreshDirty();
  };

  const deleteListItem = <T extends { id: string }>(store: DraftStore<T[]>, id: string) => {
    store.set(store.ref.current.filter((i) => i.id !== id));
    refreshDirty();
  };

  const updateBrand = (data: Partial<SiteBrandData>) => editObject(brandS, data);
  const updateHero = (data: Partial<HeroContentData>) => editObject(heroS, data);
  const updateAbout = (data: Partial<AboutContentData>) => editObject(aboutS, data);
  const updateFounder = (data: Partial<FounderInfo>) => editObject(founderS, data);

  const updateVisionBlock = (block: 'vision' | 'mission', data: Partial<VisionBlock>) => {
    const before = visionS.ref.current;
    visionS.set({ ...before, [block]: { ...before[block], ...data } });
    refreshDirty();
  };

  const updateLocation = (id: string, updated: Partial<HomeLocation>) => editListItem(locationsS, id, updated);
  const addLocation = (item: HomeLocation) => addListItem(locationsS, item, true);
  const deleteLocation = (id: string) => deleteListItem(locationsS, id);

  const addService = (item: ServiceItem) => addListItem(servicesS, item);
  const updateService = (id: string, updated: Partial<ServiceItem>) => editListItem(servicesS, id, updated);
  const deleteService = (id: string) => deleteListItem(servicesS, id);

  const addGalleryItem = (item: GalleryItem) => addListItem(galleryS, item);
  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => editListItem(galleryS, id, updated);
  const deleteGalleryItem = (id: string) => deleteListItem(galleryS, id);

  const addActivity = (item: ActivityItem) => addListItem(activitiesS, item);
  const updateActivity = (id: string, updated: Partial<ActivityItem>) => editListItem(activitiesS, id, updated);
  const deleteActivity = (id: string) => deleteListItem(activitiesS, id);

  const addStatistic = (item: StatisticItem) => addListItem(statisticsS, item);
  const updateStatistic = (id: string, updated: Partial<StatisticItem>) => editListItem(statisticsS, id, updated);
  const deleteStatistic = (id: string) => deleteListItem(statisticsS, id);

  // ---------------------------------
  // Save / discard
  // ---------------------------------
  const saveChanges = (note = '') => {
    const at = new Date().toISOString();
    const by = adminUserRef.current || 'admin';
    const text = note.trim();
    const entries: ChangeEntry[] = [];
    const add = (e: Omit<ChangeEntry, 'id' | 'at' | 'by' | 'note'>) =>
      entries.push({ ...e, note: text || undefined, id: newEntryId(entries.length), at, by });

    const diffSingle = (store: { saved: { current: object }; ref: { current: object } }, section: string, sectionLabel: string) => {
      const changes = diffObjects(store.saved.current, store.ref.current);
      if (changes.length) add({ section, sectionLabel, target: sectionLabel, action: 'edit', changes });
    };
    diffSingle(heroS, 'hero', 'Home Banner');
    diffSingle(aboutS, 'about', 'About Us');
    diffSingle(founderS, 'founder', 'Founder');
    diffSingle(brandS, 'contact', 'Contact & Brand');

    (['vision', 'mission'] as const).forEach((block) => {
      const changes = diffObjects(visionS.saved.current[block], visionS.ref.current[block]);
      if (changes.length) {
        add({
          section: 'vision',
          sectionLabel: 'Vision & Mission',
          targetId: block,
          target: block === 'vision' ? 'Our Vision' : 'Our Mission',
          action: 'edit',
          changes,
        });
      }
    });

    const diffList = <T extends { id: string }>(store: DraftStore<T[]>, section: string, sectionLabel: string) => {
      const before = store.saved.current;
      const after = store.ref.current;
      const imageChange = (item: T, side: 'from' | 'to') => {
        const image = (item as { image?: string }).image;
        return image ? [{ field: 'Image', [side]: image, kind: 'image' as const }] : [];
      };

      after.forEach((item) => {
        const prev = before.find((b) => b.id === item.id);
        if (!prev) {
          add({
            section,
            sectionLabel,
            targetId: item.id,
            target: itemTitle(item as never),
            action: 'add',
            changes: [{ field: 'New item', to: itemTitle(item as never) }, ...imageChange(item, 'to')],
          });
          return;
        }
        const changes = diffObjects(prev, item);
        if (changes.length) {
          add({ section, sectionLabel, targetId: item.id, target: itemTitle(item as never), action: 'edit', changes });
        }
      });

      before.forEach((prev) => {
        if (after.some((a) => a.id === prev.id)) return;
        add({
          section,
          sectionLabel,
          targetId: prev.id,
          target: itemTitle(prev as never),
          action: 'delete',
          changes: [{ field: 'Removed item', from: itemTitle(prev as never) }, ...imageChange(prev, 'from')],
        });
      });
    };
    diffList(locationsS, 'locations', 'Our Homes');
    diffList(servicesS, 'services', 'Services');
    diffList(activitiesS, 'activities', 'Activities');
    diffList(galleryS, 'gallery', 'Gallery');
    diffList(statisticsS, 'statistics', 'Statistics');

    contentStores.forEach((st) => st.commit());
    if (entries.length) appendChanges(entries);
    setHasUnsavedChanges(false);
    return entries.length;
  };

  const discardChanges = () => {
    contentStores.forEach((st) => st.revert());
    setHasUnsavedChanges(false);
  };

  // ---------------------------------
  // Auth (backend JWT)
  // ---------------------------------
  const login = async (username: string, password: string) => {
    const { token, user } = await api.adminLogin(username.trim(), password);
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(user.username));
    setAdminUser(user.username);
    setIsAdmin(true);
  };

  const setAdminUsername = (username: string) => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(username));
    setAdminUser(username);
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
    setAdminUser('');
    setIsAdmin(false);
  };

  const resetToDefaults = () => {
    brandS.resetTo(SITE_BRAND);
    heroS.resetTo(DEFAULT_HERO);
    aboutS.resetTo(DEFAULT_ABOUT);
    locationsS.resetTo(HOME_LOCATIONS);
    servicesS.resetTo(SERVICES_DATA);
    galleryS.resetTo(GALLERY_ITEMS);
    founderS.resetTo(FOUNDER_DATA);
    activitiesS.resetTo(ACTIVITIES_DATA);
    statisticsS.resetTo(STATISTICS_DATA);
    visionS.resetTo(VISION_MISSION_DATA as VisionMissionData);
    setHasUnsavedChanges(false);
    appendChanges([
      {
        id: newEntryId(),
        at: new Date().toISOString(),
        by: adminUserRef.current || 'admin',
        section: 'all',
        sectionLabel: 'Whole website',
        target: 'All content',
        action: 'reset',
        changes: [{ field: 'Reset', from: 'Edited content', to: 'Original default content' }],
      },
    ]);
  };

  return (
    <AdminDataContext.Provider
      value={{
        isAdmin,
        adminUser,
        login,
        logout,
        setAdminUsername,
        brand,
        updateBrand,
        hero,
        updateHero,
        about,
        updateAbout,
        locations,
        updateLocation,
        addLocation,
        deleteLocation,
        services,
        addService,
        updateService,
        deleteService,
        gallery,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        statistics,
        addStatistic,
        updateStatistic,
        deleteStatistic,
        vision,
        updateVisionBlock,
        founder,
        updateFounder,
        resetToDefaults,
        hasUnsavedChanges,
        saveChanges,
        discardChanges,
        changes,
        logExternalChange,
        annotateChange,
        clearChanges,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
};
