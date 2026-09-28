import type { ContactFormData, SupportInquiryData, DocumentItem, AnnouncementItem } from '../types';
import {
  SERVICES_DATA,
  HOME_LOCATIONS,
  ACTIVITIES_DATA,
  GALLERY_ITEMS,
  STATISTICS_DATA,
} from '../data/siteData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const ADMIN_TOKEN_KEY = 'adminToken';

/** Error thrown by admin requests; `status` lets callers react to 401/403 (expired login). */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Authenticated request that surfaces the server's own error message. */
const adminRequest = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { ...authHeaders(), ...(init.headers || {}) },
    });
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0);
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body?.message || `Request failed (${res.status})`, res.status);
  }
  return body as T;
};

/**
 * Backend-ready API Client for Manithaneyam Orphanage Home.
 * Falls back to local datasets if API backend is not deployed.
 */
export const api = {
  // Services
  getServices: async () => {
    if (!API_BASE_URL) return SERVICES_DATA;
    const res = await fetch(`${API_BASE_URL}/api/services`);
    return res.json();
  },

  // Home Locations
  getLocations: async () => {
    if (!API_BASE_URL) return HOME_LOCATIONS;
    const res = await fetch(`${API_BASE_URL}/api/locations`);
    return res.json();
  },

  // Activities
  getActivities: async () => {
    if (!API_BASE_URL) return ACTIVITIES_DATA;
    const res = await fetch(`${API_BASE_URL}/api/activities`);
    return res.json();
  },

  // Gallery
  getGallery: async () => {
    if (!API_BASE_URL) return GALLERY_ITEMS;
    const res = await fetch(`${API_BASE_URL}/api/gallery`);
    return res.json();
  },

  // Statistics
  getStatistics: async () => {
    if (!API_BASE_URL) return STATISTICS_DATA;
    const res = await fetch(`${API_BASE_URL}/api/statistics`);
    return res.json();
  },

  // Submit Contact Form
  submitContact: async (data: ContactFormData) => {
    if (!API_BASE_URL) {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true, message: 'Message recorded successfully' };
    }
    const res = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Submit Support Inquiry
  submitSupport: async (data: SupportInquiryData) => {
    if (!API_BASE_URL) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true, message: 'Support inquiry recorded' };
    }
    const res = await fetch(`${API_BASE_URL}/api/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // ---------------------------------
  // Documents Management (Public)
  // ---------------------------------
  getPublicDocuments: async (): Promise<DocumentItem[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

  // ---------------------------------
  // Announcement popup
  // ---------------------------------
  /** The active announcement for visitors, or null when there is nothing to show. */
  getAnnouncement: async (): Promise<AnnouncementItem | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/announcement`, { cache: 'no-cache' });
      if (!res.ok) return null;
      const body = await res.json();
      return body.announcement ?? null;
    } catch {
      return null;
    }
  },

  getAdminAnnouncement: async (): Promise<AnnouncementItem | null> =>
    (await adminRequest<{ announcement: AnnouncementItem | null }>('/api/announcement/admin')).announcement,

  /** Uploads a new image and publishes it, replacing the current announcement. */
  publishAnnouncement: (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    return adminRequest<{ message: string; announcement: AnnouncementItem | null }>('/api/announcement/admin', {
      method: 'POST',
      body: formData,
    });
  },

  setAnnouncementActive: (isActive: boolean) =>
    adminRequest<{ message: string; announcement: AnnouncementItem | null }>('/api/announcement/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    }),

  removeAnnouncement: () =>
    adminRequest<{ message: string }>('/api/announcement/admin', { method: 'DELETE' }),

  /** Custom sections created by the admin (the built-in ones live in data/documentSections). */
  getDocumentSections: async (): Promise<{ key: string; name: string }[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents/sections`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

  createDocumentSection: (name: string) =>
    adminRequest<{ key: string; name: string }>('/api/documents/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }),

  deleteDocumentSection: (key: string) =>
    adminRequest<{ message: string; movedDocuments: number }>(`/api/documents/sections/${key}`, { method: 'DELETE' }),

  downloadDocumentUrl: (id: string) => {
    return `${API_BASE_URL}/api/documents/${id}/download`;
  },

  viewDocumentUrl: (id: string) => {
    return `${API_BASE_URL}/api/documents/${id}/view`;
  },

  // ---------------------------------
  // Admin: authentication & media
  // ---------------------------------
  adminLogin: async (username: string, password: string) => {
    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
    } catch {
      throw new ApiError('Cannot reach the server. Is the backend running?', 0);
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(body?.message || 'Login failed', res.status);
    return body as { token: string; user: { id: string; username: string; role: string } };
  },

  /** Change the signed-in admin's login id and/or password. */
  updateAccount: (data: { currentPassword: string; newUsername?: string; newPassword?: string }) =>
    adminRequest<{ message: string; user: { id: string; username: string; role: string } }>('/api/auth/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  /** First-time setup: creates the default admin account (admin / admin123) if none exists. */
  seedAdmin: async (): Promise<string> => {
    const res = await fetch(`${API_BASE_URL}/api/auth/seed`, { method: 'POST' });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(body?.message || 'Could not create the admin account', res.status);
    return body.message as string;
  },

  /** Uploads an image and returns the URL to store in the site content. */
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const body = await adminRequest<{ imageUrl: string }>('/api/media/upload', {
      method: 'POST',
      body: formData,
    });
    return body.imageUrl;
  },

  // ---------------------------------
  // Documents Management (Admin)
  // ---------------------------------
  getAdminDocuments: (): Promise<DocumentItem[]> => adminRequest('/api/documents/admin/all'),

  createDocument: (formData: FormData): Promise<{ document: DocumentItem }> =>
    adminRequest('/api/documents', { method: 'POST', body: formData }),

  /** Multipart update: text fields, optional new PDF, new images, removeImages (JSON), changeNote. */
  updateDocument: (id: string, formData: FormData): Promise<{ document: DocumentItem }> =>
    adminRequest(`/api/documents/${id}`, { method: 'PUT', body: formData }),

  deleteDocument: (id: string): Promise<{ message: string }> =>
    adminRequest(`/api/documents/${id}`, { method: 'DELETE' }),

  updateDocumentOrder: (updates: { id: string; displayOrder: number }[]) =>
    adminRequest('/api/documents/order', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    }),
};
