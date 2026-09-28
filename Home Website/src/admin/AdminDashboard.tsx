import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  ExternalLink,
  FileText,
  HeartHandshake,
  History,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Layers,
  LogOut,
  Phone,
  RotateCcw,
  Sparkles,
  Target,
  MapPin,
  Settings,
  Megaphone,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { ThemeToggle } from '../components/Theme/ThemeToggle';
import {
  AboutEditor,
  ActivitiesEditor,
  ContactEditor,
  FounderEditor,
  GalleryEditor,
  HeroEditor,
  LocationsEditor,
  ServicesEditor,
  StatisticsEditor,
  VisionEditor,
} from './ContentEditors';
import { ChangeHistory, FieldChangeRows, AttachmentList, formatDateTime } from './ChangeHistory';
import { DocumentsManager } from './DocumentsManager';
import { SettingsPanel } from './SettingsPanel';
import { AnnouncementPanel } from './AnnouncementPanel';
import { buttonGhost, cardClass } from './ui';

interface TabDef {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  group: 'Website content' | 'Files & records';
}

const TABS: TabDef[] = [
  { id: 'overview', label: 'Overview', description: 'A summary of your website and the latest changes.', icon: LayoutDashboard, group: 'Website content' },
  { id: 'hero', label: 'Home banner', description: 'Heading, sub-heading and picture at the top of the site.', icon: Home, group: 'Website content' },
  { id: 'about', label: 'About us', description: 'Your story and introduction.', icon: BookOpen, group: 'Website content' },
  { id: 'homes', label: 'Our homes', description: 'The homes / campuses, their addresses and photos.', icon: MapPin, group: 'Website content' },
  { id: 'services', label: 'Services', description: 'Add, edit or remove the services you offer.', icon: Layers, group: 'Website content' },
  { id: 'founder', label: 'Founder', description: "Founder's message, photo and biography.", icon: HeartHandshake, group: 'Website content' },
  { id: 'vision', label: 'Vision & mission', description: 'Your guiding principles.', icon: Target, group: 'Website content' },
  { id: 'activities', label: 'Activities', description: 'Programmes and events.', icon: Sparkles, group: 'Website content' },
  { id: 'gallery', label: 'Gallery', description: 'Photos and the story behind each moment.', icon: ImageIcon, group: 'Website content' },
  { id: 'statistics', label: 'Statistics', description: 'The impact counters.', icon: BarChart3, group: 'Website content' },
  { id: 'contact', label: 'Contact & brand', description: 'Names, phone numbers, email, address and hours.', icon: Phone, group: 'Website content' },
  { id: 'announcement', label: 'Announcement', description: 'The popup visitors see when they open the website: upload, preview, switch on or off.', icon: Megaphone, group: 'Files & records' },
  { id: 'documents', label: 'Documents', description: 'Upload PDFs, file them under your own sections, attach images and see how each was changed.', icon: FileText, group: 'Files & records' },
  { id: 'settings', label: 'Settings', description: 'Change your login ID and password.', icon: Settings, group: 'Files & records' },
  { id: 'history', label: 'Change history', description: 'Everything that was changed: what, when, by whom.', icon: History, group: 'Files & records' },
];

const Overview: React.FC = () => {
  const { services, gallery, activities, statistics, locations, changes, resetToDefaults } = useAdminData();
  const navigate = useNavigate();
  const counts = [
    { label: 'Homes', value: locations.length, to: 'homes' },
    { label: 'Services', value: services.length, to: 'services' },
    { label: 'Activities', value: activities.length, to: 'activities' },
    { label: 'Gallery photos', value: gallery.length, to: 'gallery' },
    { label: 'Statistics', value: statistics.length, to: 'statistics' },
    { label: 'Changes recorded', value: changes.length, to: 'history' },
  ];
  const recent = changes.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {counts.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => navigate(`/admin/${c.to}`)}
            className={`${cardClass} p-4 text-left hover:border-brand-primary/50 transition-colors`}
          >
            <div className="text-2xl font-bold text-theme-text">{c.value}</div>
            <div className="text-xs text-theme-text-muted mt-0.5">{c.label}</div>
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-theme-text">Latest changes</h3>
          <Link to="/admin/history" className="text-sm text-brand-primary hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className={`${cardClass} p-6 text-sm text-theme-text-muted`}>
            Nothing has been changed yet. Pick a section on the left to start editing — every change is recorded here.
          </div>
        ) : (
          <ul className="space-y-3">
            {recent.map((entry) => (
              <li key={entry.id} className={`${cardClass} p-4 space-y-2`}>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-theme-text">{entry.sectionLabel}</span>
                  {entry.target !== entry.sectionLabel && <span className="text-theme-text-secondary">› {entry.target}</span>}
                  <span className="ml-auto text-xs text-theme-text-muted">{formatDateTime(entry.at)}</span>
                </div>
                <FieldChangeRows changes={entry.changes.slice(0, 3)} />
                {entry.changes.length > 3 && <p className="text-xs text-theme-text-muted">+ {entry.changes.length - 3} more changes</p>}
                <AttachmentList attachments={entry.attachments} />
                {entry.note && <p className="text-sm text-theme-text bg-theme-secondary rounded-lg px-3 py-2">“{entry.note}”</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`${cardClass} p-5 flex flex-col sm:flex-row sm:items-center gap-3`}>
        <div className="flex-1">
          <h3 className="font-bold text-theme-text">Start over</h3>
          <p className="text-sm text-theme-text-muted">Put every section back to its original content. This is recorded in the history.</p>
        </div>
        <button
          type="button"
          className={`${buttonGhost} text-red-500`}
          onClick={() => window.confirm('Reset ALL website content to the original defaults?') && resetToDefaults()}
        >
          <RotateCcw className="w-4 h-4" /> Reset all content
        </button>
      </div>
    </div>
  );
};

export function AdminDashboard() {
  const { isAdmin, adminUser, logout } = useAdminData();
  const { tab = 'overview' } = useParams();
  const navigate = useNavigate();

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const active = TABS.find((t) => t.id === tab);
  if (!active) return <Navigate to="/admin" replace />;

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const renderTab = () => {
    switch (active.id) {
      case 'overview':
        return <Overview />;
      case 'hero':
        return <HeroEditor />;
      case 'about':
        return <AboutEditor />;
      case 'homes':
        return <LocationsEditor />;
      case 'services':
        return <ServicesEditor />;
      case 'founder':
        return <FounderEditor />;
      case 'vision':
        return <VisionEditor />;
      case 'activities':
        return <ActivitiesEditor />;
      case 'gallery':
        return <GalleryEditor />;
      case 'statistics':
        return <StatisticsEditor />;
      case 'contact':
        return <ContactEditor />;
      case 'documents':
        return <DocumentsManager onAuthError={handleLogout} />;
      case 'history':
        return <ChangeHistory />;
      case 'announcement':
        return <AnnouncementPanel onAuthError={handleLogout} />;
      case 'settings':
        return <SettingsPanel onAuthError={handleLogout} />;
    }
  };

  const groups = Array.from(new Set(TABS.map((t) => t.group)));

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:shrink-0 lg:h-screen lg:sticky lg:top-0 bg-theme-card border-b lg:border-b-0 lg:border-r border-theme-border flex flex-col">
        <div className="px-5 py-4 flex items-center justify-between lg:block">
          <div>
            <div className="font-bold text-theme-text leading-tight">Admin Panel</div>
            <div className="text-xs text-theme-text-muted">Manithaneyam Orphanage Home</div>
          </div>
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex lg:flex-col gap-1 px-3 pb-3 lg:pb-4 overflow-x-auto lg:overflow-y-auto lg:flex-1">
          {groups.map((group) => (
            <React.Fragment key={group}>
              <div className="hidden lg:block px-2 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-theme-text-muted">
                {group}
              </div>
              {TABS.filter((t) => t.group === group).map((t) => {
                const Icon = t.icon;
                const isActive = t.id === active.id;
                return (
                  <Link
                    key={t.id}
                    to={t.id === 'overview' ? '/admin' : `/admin/${t.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive ? 'bg-brand-primary text-on-primary' : 'text-theme-text-secondary hover:bg-theme-secondary'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {t.label}
                  </Link>
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        <div className="hidden lg:flex items-center justify-between gap-2 px-4 py-3 border-t border-theme-border">
          <ThemeToggle />
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-theme-text-secondary hover:text-brand-primary">
            View site <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center gap-3 px-5 sm:px-8 py-4 border-b border-theme-border bg-theme-card/60 backdrop-blur sticky top-0 z-20">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">{active.label}</h1>
            <p className="text-xs sm:text-sm text-theme-text-muted truncate">{active.description}</p>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className={`${buttonGhost} lg:hidden`} title="View website">
            <ExternalLink className="w-4 h-4" />
          </a>
          <span className="hidden sm:inline text-sm text-theme-text-secondary">{adminUser || 'admin'}</span>
          <button type="button" onClick={handleLogout} className={buttonGhost}>
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        <main className="flex-1 p-5 sm:p-8 pb-32 max-w-5xl w-full mx-auto">
          {active.group === 'Website content' && active.id !== 'overview' && (
            <p className="mb-5 text-xs text-theme-text-muted bg-brand-primary/5 border border-brand-primary/20 rounded-lg px-3 py-2">
              Make all your edits, then press “Save changes” at the bottom of the screen. Saved changes are recorded in the Change history and are stored in this browser.
            </p>
          )}
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
