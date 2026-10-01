export interface OrganizationBranch {
  id: string;
  en: string;
  ta: string;
  shortEn: string;
  shortTa: string;
  locationEn: string;
  locationTa: string;
  descriptionEn: string;
  descriptionTa: string;
  iconName:
    | 'HeartHandshake'
    | 'Users'
    | 'Sparkles'
    | 'BookOpen'
    | 'Home'
    | 'HeartPulse'
    | 'Scissors'
    | 'Monitor'
    | 'Stethoscope'
    | 'UtensilsCrossed';
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
    descriptionEn: 'Kodangipatti • Adoption & Infant Care',
    descriptionTa: 'கோடாங்கிபட்டி • குழந்தை தத்தெடுப்பு',
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
    descriptionEn: 'Kodangipatti • Shelter & Holistic Care',
    descriptionTa: 'கோடாங்கிபட்டி • பாதுகாப்பு இல்லம்',
    iconName: 'Users',
  },
  {
    id: 'clinic',
    en: 'MANITHANEYA FREE CLINIC, KODANGIPATTI',
    ta: 'மனிதநேயம் இலவச மருத்துவமனை, கோடாங்கிபட்டி',
    shortEn: 'Free Clinic',
    shortTa: 'இலவச மருத்துவமனை',
    locationEn: 'Kodangipatti',
    locationTa: 'கோடாங்கிபட்டி',
    descriptionEn: 'Quality Healthcare for All',
    descriptionTa: 'அனைவருக்கும் தரமான மருத்துவ சேவை',
    iconName: 'Stethoscope',
  },
  {
    id: 'rstc',
    en: 'MANITHANEYA RESIDENTIAL SPECIAL TRAINING CENTRE (RSTC), KODANGIPATTI',
    ta: 'மனிதநேயம் சிறப்பு பயிற்சி மையம் (RSTC), கோடாங்கிபட்டி',
    shortEn: 'Special Training Centre (RSTC)',
    shortTa: 'சிறப்பு பயிற்சி மையம் (RSTC)',
    locationEn: 'Kodangipatti',
    locationTa: 'கோடாங்கிபட்டி',
    descriptionEn: 'Kodangipatti • Special Education',
    descriptionTa: 'கோடாங்கிபட்டி • சிறப்பு கல்வி மையம்',
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
    descriptionEn: 'Kodangipatti • Foundation Education',
    descriptionTa: 'கோடாங்கிபட்டி • தொடக்கக் கல்வி',
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
    descriptionEn: 'Theni • Sanctuary of Love & Care',
    descriptionTa: 'தேனி • அன்பு & அரவணைப்பு இல்லம்',
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
    descriptionEn: 'Arappadi Thevan Patti • Elderly Sanctuary',
    descriptionTa: 'அரப்படிதேவன்பட்டி • முதியோர் இல்லம்',
    iconName: 'HeartPulse',
  },
  {
    id: 'food',
    en: 'MANITHANEYA FREE FOOD INITIATIVE, THENI',
    ta: 'மனிதநேயம் இலவச அன்னதான சேவை, தேனி',
    shortEn: 'Free Food',
    shortTa: 'இலவச உணவு',
    locationEn: 'Theni',
    locationTa: 'தேனி',
    descriptionEn: 'Nutritious Meals for Everyone',
    descriptionTa: 'அனைவருக்கும் சத்தான அன்னதானம்',
    iconName: 'UtensilsCrossed',
  },
  {
    id: 'sewing',
    en: 'MANITHANEYA SEWING TRAINING CENTRE, KODANGIPATTI',
    ta: 'மனிதநேயம் தையல் பயிற்சி மையம், கோடாங்கிபட்டி',
    shortEn: 'Sewing Training Centre',
    shortTa: 'தையல் பயிற்சி மையம்',
    locationEn: 'Kodangipatti',
    locationTa: 'கோடாங்கிபட்டி',
    descriptionEn: 'Kodangipatti • Women Empowerment',
    descriptionTa: 'கோடாங்கிபட்டி • மகளிர் தையற்பயிற்சி',
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
    descriptionEn: 'Kodangipatti • Digital Skills & Employment',
    descriptionTa: 'கோடாங்கிபட்டி • கணினி தொழிற்கல்வி',
    iconName: 'Monitor',
  },
];
