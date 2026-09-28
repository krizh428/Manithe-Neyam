import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { ACTIVITY_CATEGORIES } from '../data/siteData';
import { IMAGES } from '../assets/images';
import { photosOf } from '../components/Common/PhotoSlider';
import type { ActivityCategory } from '../types';
import {
  AccordionItem,
  AreaField,
  Bilingual,
  ImageField,
  LinesField,
  MultiImageField,
  SectionCard,
  SelectField,
  TextField,
  buttonPrimary,
} from './ui';

type Data = Record<string, any>;
type Patch = (patch: Data) => void;

/** Tamil + English text side by side, for a field stored as `<base>Ta` / `<base>En`. */
const BiText: React.FC<{
  label: string;
  base: string;
  data: Data;
  onChange: Patch;
  multiline?: boolean;
  rows?: number;
}> = ({ label, base, data, onChange, multiline, rows = 3 }) => {
  const Field = multiline ? AreaField : TextField;
  return (
    <Bilingual>
      <Field label={`${label} — தமிழ்`} value={data[`${base}Ta`]} onChange={(v) => onChange({ [`${base}Ta`]: v })} {...(multiline ? { rows } : {})} />
      <Field label={`${label} — English`} value={data[`${base}En`]} onChange={(v) => onChange({ [`${base}En`]: v })} {...(multiline ? { rows } : {})} />
    </Bilingual>
  );
};

const BiLines: React.FC<{ label: string; base: string; data: Data; onChange: Patch; rows?: number }> = ({
  label,
  base,
  data,
  onChange,
  rows,
}) => (
  <Bilingual>
    <LinesField label={`${label} — தமிழ்`} value={data[`${base}Ta`]} onChange={(v) => onChange({ [`${base}Ta`]: v })} rows={rows} />
    <LinesField label={`${label} — English`} value={data[`${base}En`]} onChange={(v) => onChange({ [`${base}En`]: v })} rows={rows} />
  </Bilingual>
);

const newId = (prefix: string) => `${prefix}-${Date.now()}`;

const CATEGORY_OPTIONS = ACTIVITY_CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
  value: c.id,
  label: `${c.labelEn} / ${c.labelTa}`,
}));

const ICON_OPTIONS = ['Sparkles', 'GraduationCap', 'HeartHandshake', 'HeartPulse', 'Shirt', 'Users', 'Utensils'].map((n) => ({
  value: n,
  label: n,
}));

const AddButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button type="button" onClick={onClick} className={buttonPrimary}>
    <Plus className="w-4 h-4" />
    {label}
  </button>
);

const confirmDelete = (name: string) => window.confirm(`Delete "${name}"? This cannot be undone (except by re-adding it).`);

// ---------------------------------------------------------------------------
// Single-object editors
// ---------------------------------------------------------------------------

export const HeroEditor: React.FC = () => {
  const { hero, updateHero } = useAdminData();
  return (
    <SectionCard title="Home banner" description="The first thing visitors see at the top of the page.">
      <BiText label="Heading" base="title" data={hero} onChange={updateHero} />
      <BiText label="Sub-heading" base="subtitle" data={hero} onChange={updateHero} multiline />
      <BiText label="Location line" base="location" data={hero} onChange={updateHero} />
      <ImageField label="Banner image" value={hero.image} onChange={(image) => updateHero({ image })} />
    </SectionCard>
  );
};

export const AboutEditor: React.FC = () => {
  const { about, updateAbout } = useAdminData();
  return (
    <SectionCard title="About us" description="Your story, shown in the 'About' section.">
      <BiText label="Title" base="title" data={about} onChange={updateAbout} />
      <BiText label="Quote" base="quote" data={about} onChange={updateAbout} multiline rows={2} />
      <BiLines label="Story paragraphs" base="paragraphs" data={about} onChange={updateAbout} rows={8} />
      <ImageField label="Section image" value={about.image} onChange={(image) => updateAbout({ image })} />
    </SectionCard>
  );
};

export const FounderEditor: React.FC = () => {
  const { founder, updateFounder, updateBrand } = useAdminData();

  // The founder's name / role also appear in the footer and contact section, which read from the brand data.
  const patch: Patch = (p) => {
    updateFounder(p);
    const brandPatch: Data = {};
    if ('nameTa' in p) brandPatch.founderNameTa = p.nameTa;
    if ('nameEn' in p) brandPatch.founderNameEn = p.nameEn;
    if (Object.keys(brandPatch).length) updateBrand(brandPatch);
  };

  return (
    <SectionCard title="Founder" description="Founder's message, photo and biography.">
      <BiText label="Section title" base="title" data={founder} onChange={patch} />
      <BiText label="Name" base="name" data={founder} onChange={patch} />
      <BiText label="Role" base="role" data={founder} onChange={patch} />
      <TextField label="Phone" value={founder.phone} onChange={(phone) => patch({ phone })} />
      <BiText label="Quote" base="quote" data={founder} onChange={patch} multiline rows={3} />
      <BiLines label="Biography paragraphs" base="bio" data={founder} onChange={patch} rows={8} />
      <ImageField label="Founder photo" value={founder.image} onChange={(image) => patch({ image })} />
    </SectionCard>
  );
};

export const ContactEditor: React.FC = () => {
  const { brand, updateBrand } = useAdminData();
  const data = brand as unknown as Data;
  return (
    <div className="space-y-6">
      <SectionCard title="Organisation names" description="Shown in the navigation bar, footer and browser title.">
        <BiText label="Short name" base="name" data={data} onChange={updateBrand} />
        <BiText label="Full name" base="fullName" data={data} onChange={updateBrand} />
        <BiText label="Tagline" base="tagline" data={data} onChange={updateBrand} />
        <BiText label="Founder role" base="founderRole" data={data} onChange={updateBrand} />
      </SectionCard>
      <SectionCard title="Contact details" description="Phone, email, address and opening hours.">
        <Bilingual>
          <TextField label="Phone 1 (also used for WhatsApp)" value={brand.phone1} onChange={(v) => updateBrand({ phone1: v, whatsapp1: v })} />
          <TextField label="Phone 2 (also used for WhatsApp)" value={brand.phone2} onChange={(v) => updateBrand({ phone2: v, whatsapp2: v })} />
          <TextField label="Email" type="email" value={brand.email} onChange={(email) => updateBrand({ email })} />
          <TextField
            label="Website"
            value={brand.website}
            onChange={(v) => updateBrand({ website: v, websiteUrl: /^https?:\/\//.test(v) ? v : `http://${v}` })}
          />
        </Bilingual>
        <BiText label="Short location" base="locationBrief" data={data} onChange={updateBrand} />
        <BiText label="Full address" base="fullAddress" data={data} onChange={updateBrand} multiline rows={2} />
        <BiText label="Opening hours" base="timings" data={data} onChange={updateBrand} />
      </SectionCard>
    </div>
  );
};

export const VisionEditor: React.FC = () => {
  const { vision, updateVisionBlock } = useAdminData();
  return (
    <div className="space-y-6">
      {(['vision', 'mission'] as const).map((block) => {
        const data = vision[block] as unknown as Data;
        const onChange: Patch = (p) => updateVisionBlock(block, p);
        return (
          <SectionCard key={block} title={block === 'vision' ? 'Our vision' : 'Our mission'}>
            <BiText label="Badge" base="badge" data={data} onChange={onChange} />
            <BiText label="Title" base="title" data={data} onChange={onChange} />
            <BiText label="Description" base="text" data={data} onChange={onChange} multiline />
            <BiLines label="Key points" base="points" data={data} onChange={onChange} rows={4} />
            <ImageField label="Image" value={vision[block].image} onChange={(image) => onChange({ image })} />
          </SectionCard>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// List editors
// ---------------------------------------------------------------------------

export const LocationsEditor: React.FC = () => {
  const { locations, updateLocation, addLocation, deleteLocation } = useAdminData();
  const [openId, setOpenId] = useState<string | null>(locations[0]?.id ?? null);

  const add = () => {
    const id = newId('home');
    addLocation({
      id,
      number: String(locations.length + 1).padStart(2, '0'),
      titleTa: 'புதிய இல்லம்',
      titleEn: 'New home',
      locationTa: '',
      locationEn: '',
      descTa: '',
      descEn: '',
      detailsTa: '',
      detailsEn: '',
      capacityTa: '',
      capacityEn: '',
      phone: '',
      email: '',
      image: IMAGES.hero,
      images: [IMAGES.hero],
      mapUrl: '',
      featuresTa: [],
      featuresEn: [],
    });
    setOpenId(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-theme-text-secondary">{locations.length} homes shown in the "Our Homes" section and the footer.</p>
        <AddButton label="Add home" onClick={add} />
      </div>
      {locations.map((loc) => {
        const patch: Patch = (p) => updateLocation(loc.id, p);
        const data = loc as unknown as Data;
        return (
          <AccordionItem
            key={loc.id}
            title={`${loc.number}. ${loc.titleEn}`}
            subtitle={loc.locationEn}
            image={loc.image}
            open={openId === loc.id}
            onToggle={() => setOpenId(openId === loc.id ? null : loc.id)}
            onDelete={() => confirmDelete(loc.titleEn || loc.titleTa) && deleteLocation(loc.id)}
          >
            <BiText label="Name" base="title" data={data} onChange={patch} />
            <BiText label="Location" base="location" data={data} onChange={patch} />
            <BiText label="Short description" base="desc" data={data} onChange={patch} multiline />
            <BiText label="Detailed description" base="details" data={data} onChange={patch} multiline />
            <BiText label="Capacity" base="capacity" data={data} onChange={patch} />
            <TextField label="Phone number of this home" hint="shown on the website as a tap-to-call link" value={loc.phone} onChange={(phone) => patch({ phone })} placeholder="+91 98765 43210" />
            <TextField label="Email address of this home" hint="shown on the website as a tap-to-email link" type="email" value={loc.email} onChange={(email) => patch({ email })} placeholder="home@example.com" />
            <BiLines label="Features" base="features" data={data} onChange={patch} />
            <TextField label="Google Maps link" value={loc.mapUrl} onChange={(mapUrl) => patch({ mapUrl })} />
            <MultiImageField
              label="Photos (slide view)"
              value={photosOf(loc)}
              onChange={(images) => patch({ images, image: images[0] ?? '' })}
            />
          </AccordionItem>
        );
      })}
    </div>
  );
};

export const ServicesEditor: React.FC = () => {
  const { services, addService, updateService, deleteService } = useAdminData();
  const [openId, setOpenId] = useState<string | null>(null);

  const add = () => {
    const id = newId('service');
    addService({
      id,
      iconName: 'Sparkles',
      titleTa: 'புதிய சேவை',
      titleEn: 'New service',
      descTa: '',
      descEn: '',
      whyTa: '',
      whyEn: '',
      whenTa: '',
      whenEn: '',
      dateTa: String(new Date().getFullYear()),
      dateEn: String(new Date().getFullYear()),
      image: IMAGES.hero,
      longDescTa: '',
      longDescEn: '',
    });
    setOpenId(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-theme-text-secondary">{services.length} services shown in the "Services" section.</p>
        <AddButton label="Add service" onClick={add} />
      </div>
      {services.map((srv) => {
        const patch: Patch = (p) => updateService(srv.id, p);
        const data = srv as unknown as Data;
        return (
          <AccordionItem
            key={srv.id}
            title={srv.titleEn || srv.titleTa}
            subtitle={srv.titleTa}
            image={srv.image}
            open={openId === srv.id}
            onToggle={() => setOpenId(openId === srv.id ? null : srv.id)}
            onDelete={() => confirmDelete(srv.titleEn || srv.titleTa) && deleteService(srv.id)}
          >
            <BiText label="Title" base="title" data={data} onChange={patch} />
            <BiText label="Short description" base="desc" data={data} onChange={patch} multiline rows={2} />
            <BiText label="Why we do this" base="why" data={data} onChange={patch} />
            <BiText label="When / how often" base="when" data={data} onChange={patch} />
            <BiText label="Date" base="date" data={data} onChange={patch} />
            <BiText label="Full description" base="longDesc" data={data} onChange={patch} multiline rows={4} />
            <SelectField label="Icon" value={srv.iconName} options={ICON_OPTIONS} onChange={(iconName) => patch({ iconName })} />
            <ImageField label="Image" value={srv.image} onChange={(image) => patch({ image })} />
          </AccordionItem>
        );
      })}
    </div>
  );
};

export const ActivitiesEditor: React.FC = () => {
  const { activities, addActivity, updateActivity, deleteActivity } = useAdminData();
  const [openId, setOpenId] = useState<string | null>(null);

  const add = () => {
    const id = newId('activity');
    addActivity({
      id,
      category: 'community',
      titleTa: 'புதிய நிகழ்வு',
      titleEn: 'New activity',
      descTa: '',
      descEn: '',
      dateTa: '',
      dateEn: '',
      beneficiariesTa: '',
      beneficiariesEn: '',
      image: IMAGES.hero,
      images: [IMAGES.hero],
    });
    setOpenId(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-theme-text-secondary">{activities.length} activities shown in "Service Activities".</p>
        <AddButton label="Add activity" onClick={add} />
      </div>
      {activities.map((act) => {
        const patch: Patch = (p) => updateActivity(act.id, p);
        const data = act as unknown as Data;
        return (
          <AccordionItem
            key={act.id}
            title={act.titleEn || act.titleTa}
            subtitle={act.titleTa}
            image={act.image}
            open={openId === act.id}
            onToggle={() => setOpenId(openId === act.id ? null : act.id)}
            onDelete={() => confirmDelete(act.titleEn || act.titleTa) && deleteActivity(act.id)}
          >
            <SelectField
              label="Category"
              value={act.category}
              options={CATEGORY_OPTIONS}
              onChange={(category) => patch({ category: category as ActivityCategory })}
            />
            <BiText label="Title" base="title" data={data} onChange={patch} />
            <BiText label="Description" base="desc" data={data} onChange={patch} multiline />
            <BiText label="Date" base="date" data={data} onChange={patch} />
            <BiText label="People helped" base="beneficiaries" data={data} onChange={patch} />
            <MultiImageField
              label="Photos (slide view)"
              value={photosOf(act)}
              onChange={(images) => patch({ images, image: images[0] ?? '' })}
            />
          </AccordionItem>
        );
      })}
    </div>
  );
};

export const GalleryEditor: React.FC = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useAdminData();
  const [openId, setOpenId] = useState<string | null>(null);

  const add = () => {
    const id = newId('gallery');
    addGalleryItem({
      id,
      category: 'community',
      titleTa: 'புதிய தருணம்',
      titleEn: 'New moment',
      captionTa: '',
      captionEn: '',
      momentDateTa: '',
      momentDateEn: '',
      detailedStoryTa: '',
      detailedStoryEn: '',
      image: IMAGES.hero,
      altTa: 'தொண்டு நிகழ்வு',
      altEn: 'Humanitarian moment',
      images: [IMAGES.hero],
    });
    setOpenId(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-theme-text-secondary">{gallery.length} photos in the gallery.</p>
        <AddButton label="Add photo" onClick={add} />
      </div>
      {gallery.map((item) => {
        const patch: Patch = (p) => updateGalleryItem(item.id, p);
        const data = item as unknown as Data;
        return (
          <AccordionItem
            key={item.id}
            title={item.titleEn || item.titleTa}
            subtitle={item.momentDateEn || item.momentDateTa}
            image={item.image}
            open={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            onDelete={() => confirmDelete(item.titleEn || item.titleTa) && deleteGalleryItem(item.id)}
          >
            <MultiImageField
              label="Photos (slide view)"
              value={photosOf(item)}
              onChange={(images) => patch({ images, image: images[0] ?? '' })}
            />
            <SelectField
              label="Category"
              value={item.category}
              options={CATEGORY_OPTIONS}
              onChange={(category) => patch({ category: category as ActivityCategory })}
            />
            <BiText label="Title" base="title" data={data} onChange={patch} />
            <BiText label="Short caption" base="caption" data={data} onChange={patch} />
            <BiText label="Date of the moment" base="momentDate" data={data} onChange={patch} />
            <BiText label="Story — describe the moment" base="detailedStory" data={data} onChange={patch} multiline rows={4} />
            <BiText label="Image description (alt text)" base="alt" data={data} onChange={patch} />
          </AccordionItem>
        );
      })}
    </div>
  );
};

export const StatisticsEditor: React.FC = () => {
  const { statistics, addStatistic, updateStatistic, deleteStatistic } = useAdminData();
  const [openId, setOpenId] = useState<string | null>(null);

  const add = () => {
    const id = newId('stat');
    addStatistic({ id, value: 0, suffix: '+', labelTa: 'புதிய புள்ளிவிவரம்', labelEn: 'New statistic', descTa: '', descEn: '' });
    setOpenId(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-theme-text-secondary">The counters shown in the "Our Impact" section.</p>
        <AddButton label="Add statistic" onClick={add} />
      </div>
      {statistics.map((stat) => {
        const patch: Patch = (p) => updateStatistic(stat.id, p);
        const data = stat as unknown as Data;
        return (
          <AccordionItem
            key={stat.id}
            title={`${stat.value}${stat.suffix} — ${stat.labelEn || stat.labelTa}`}
            subtitle={stat.labelTa}
            open={openId === stat.id}
            onToggle={() => setOpenId(openId === stat.id ? null : stat.id)}
            onDelete={() => confirmDelete(stat.labelEn || stat.labelTa) && deleteStatistic(stat.id)}
          >
            <Bilingual>
              <TextField
                label="Number"
                type="number"
                value={stat.value}
                onChange={(v) => patch({ value: Number(v) || 0 })}
              />
              <TextField label="Suffix (e.g. +)" value={stat.suffix} onChange={(suffix) => patch({ suffix })} />
            </Bilingual>
            <BiText label="Label" base="label" data={data} onChange={patch} />
            <BiText label="Description" base="desc" data={data} onChange={patch} />
          </AccordionItem>
        );
      })}
    </div>
  );
};
