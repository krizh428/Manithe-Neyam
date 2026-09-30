export interface OrganizationBranch {
  id: string;
  en: string;
  ta: string;
  shortEn: string;
  shortTa: string;
  locationEn: string;
  locationTa: string;
  iconName: 'HeartHandshake' | 'Users' | 'Sparkles' | 'BookOpen' | 'Home' | 'HeartPulse' | 'Scissors' | 'Monitor';
}

export const ORGANIZATIONS_DATA: OrganizationBranch[] = [
  {
    id: 'adoption',
    en: 'MANITHANEYA SPECIALISED ADOPTION CENTRE, KODANGIPATTI',
    ta: 'மனிதநேயம் சிறப்பு தத்தெடுப்பு மையம், கோடாங்கிபட்டி',
    shortEn: 'Specialised Adoption Centre',
    shortTa: 'சிறப்பு தத்தெடுப்பு மையம்',
    locationEn: 'Kodangipatti',
    locationTa: 'கோடாங்கிபட்டி',
    iconName: 'HeartHandshake',
  },
  {
    id: 'children-kodangipatti',
    en: "MANITHANEYA CHILDREN'S HOME, KODANGIPATTI",
    ta: 'மனிதநேயம் குழந்தைகள் இல்லம், கோடாங்கிபட்டி',
    shortEn: "Children's Home",
    shortTa: 'குழந்தைகள் இல்லம்',
    locationEn: 'Kodangipatti',
    locationTa: 'கோடாங்கிபட்டி',
    iconName: 'Users',
  },
  {
    id: 'rstc',
    en: 'MANITHANEYA RESIDENTIAL SPECIAL TRAINING CENTRE (RSTC), KODANGIPATTI',
    ta: 'மனிதநேயம் சிறப்பு பயிற்சி மையம் (RSTC), கோடாங்கிபட்டி',
    shortEn: 'Special Training Centre (RSTC)',
    shortTa: 'சிறப்பு பயிற்சி மையம் (RSTC)',
    locationEn: 'Kodangipatti',
    locationTa: 'கோடாங்கிபட்டி',
    iconName: 'Sparkles',
  },
  {
    id: 'school',
    en: 'MANITHANEYA DREAM NURSERY & PRIMARY SCHOOL, KODANGIPATTI',
    ta: 'மனிதநேயம் கனவு மழலையர் & தொடக்கப்பள்ளி, கோடாங்கிபட்டி',
    shortEn: 'Dream Nursery & Primary School',
    shortTa: 'கனவு மழலையர் & தொடக்கப்பள்ளி',
    locationEn: 'Kodangipatti',
    locationTa: 'கோடாங்கிபட்டி',
    iconName: 'BookOpen',
  },
  {
    id: 'children-theni',
    en: "MANITHANEYA CHILDREN'S HOME, THENI",
    ta: 'மனிதநேயம் குழந்தைகள் இல்லம், தேனி',
    shortEn: "Children's Home",
    shortTa: 'குழந்தைகள் இல்லம்',
    locationEn: 'Theni',
    locationTa: 'தேனி',
    iconName: 'Home',
  },
  {
    id: 'old-age',
    en: 'MANITHANEYA OLD AGE HOME, ARAPPADI THEVAN PATTI',
    ta: 'மனிதநேயம் முதியோர் இல்லம், அரப்படிதேவன்பட்டி',
    shortEn: 'Old Age Home',
    shortTa: 'முதியோர் நல்வாழ்வு இல்லம்',
    locationEn: 'Arappadi Thevan Patti',
    locationTa: 'அரப்படிதேவன்பட்டி',
    iconName: 'HeartPulse',
  },
  {
    id: 'sewing',
    en: 'MANITHANEYA SEWING TRAINING CENTRE, KODANGIPATTI',
    ta: 'மனிதநேயம் தையல் பயிற்சி மையம், கோடாங்கிபட்டி',
    shortEn: 'Sewing Training Centre',
    shortTa: 'தையல் பயிற்சி மையம்',
    locationEn: 'Kodangipatti',
    locationTa: 'கோடாங்கிபட்டி',
    iconName: 'Scissors',
  },
  {
    id: 'computer',
    en: 'MANITHANEYA COMPUTER TRAINING CENTRE, KODANGIPATTI',
    ta: 'மனிதநேயம் கணினி பயிற்சி மையம், கோடாங்கிபட்டி',
    shortEn: 'Computer Training Centre',
    shortTa: 'கணினி தொழிற்பயிற்சி மையம்',
    locationEn: 'Kodangipatti',
    locationTa: 'கோடாங்கிபட்டி',
    iconName: 'Monitor',
  },
];
