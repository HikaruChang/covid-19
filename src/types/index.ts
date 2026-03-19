// ===== 数据库模型 =====

export interface Accommodation {
  id: number;
  name: string;
  province: string;
  city: string;
  suburb: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  beds: string;
  room: string;
  contact_name: string;
  contact_phone: string;
  notes: string;
  lin_bao_ru_zhu: number;
  verified: number;
  created_at: string;
  updated_at: string;
}

export interface PeopleAccommodation {
  id: number;
  name: string;
  province: string;
  city: string;
  suburb: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  contact_name: string;
  contact_phone: string;
  notes: string;
  created_at: string;
}

export interface Platform {
  id: number;
  name: string;
  description: string;
  url: string;
  contact: string;
  province: string;
  city: string;
  notes: string;
  created_at: string;
}

export interface HospitalSupply {
  id: number;
  name: string;
  province: string;
  city: string;
  suburb: string;
  address: string;
  patients: string;
  beds: string;
  contact_name: string;
  contact_org: string;
  contact_phone: string;
  pathways: string;
  logistic_status: string;
  source: string;
  proof: string;
  notes: string;
  verified: number;
  created_at: string;
  items?: SupplyItem[];
}

export interface SupplyItem {
  id?: number;
  supply_id?: number;
  community_supply_id?: number;
  type?: 'medical' | 'live';
  name: string;
  unit: string;
  need: string;
  daily: string;
  have: string;
  requirements: string;
}

export interface CommunitySupply {
  id: number;
  name: string;
  age: number;
  province: string;
  city: string;
  suburb: string;
  address: string;
  contact_phone: string;
  agent_name: string;
  agent_contact_phone: string;
  needs_vehicle: number;
  notes: string;
  created_at: string;
  medicalSupplies?: SupplyItem[];
  liveSupplies?: SupplyItem[];
}

export interface Report {
  id: number;
  type: string;
  cause: string;
  content: string;
  created_at: string;
}

export interface WikiStream {
  id: number;
  title: string;
  content: string;
  source: string;
  created_at: string;
}

export interface EpidemicData {
  id: number;
  area_type: 'country' | 'province' | 'city';
  name: string;
  short_name: string;
  parent_name: string;
  confirmed: number;
  suspected: number;
  cured: number;
  dead: number;
  updated_at: string;
}

export interface EpidemicSubscription {
  id: number;
  city: string;
  subscriber_type: 'webhook' | 'telegram';
  subscriber_id: string;
  created_at: string;
}

// ===== API 请求/响应 =====

export interface HospitalSubmissionRequest {
  name: string;
  province: string;
  city: string;
  suburb: string;
  address: string;
  patients?: string;
  beds?: string;
  contactName?: string;
  contactOrg: string;
  contactPhone: string;
  supplies: SupplyItem[];
  pathways: string;
  logisticStatus?: string;
  source?: string;
  proof?: string;
  notes?: string;
}

export interface CommunitySubmissionRequest {
  name: string;
  age: number;
  province: string;
  city: string;
  suburb: string;
  address: string;
  contactPhone?: string;
  agentName?: string;
  agentContactPhone?: string;
  medicalSupplies?: SupplyItem[];
  liveSupplies?: SupplyItem[];
  needsVehicle?: boolean;
  notes?: string;
}

export interface ReportRequest {
  type: string;
  cause: string;
  content: string;
}

// ===== 疫情 API 外部响应格式 =====

export interface EpidemicApiCity {
  cityName: string;
  confirmed: number;
  suspected: number;
  cured: number;
  dead: number;
}

export interface EpidemicApiProvince {
  provinceName: string;
  provinceShortName: string;
  confirmed: number;
  suspected: number;
  cured: number;
  dead: number;
  cities: EpidemicApiCity[];
}

// ===== 证书验证 =====

export enum Validity {
  WAITING = 0,
  OK = 1,
  SIGNATURE_MISMATCH = 2,
  ILLEGAL_ARGUMENTS = 3,
}
