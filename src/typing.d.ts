const {
  DotSeparator = "、",
  ColonSeparator = ":",
  OrSymbolSeparator = "|",
}

type GeneralResponse = {
  message?: string;
}

type ReportRequest = {
  type: string;
  cause: string;
  content: string;
}

type SubmissionSupply = {
  name: string;
  unit: string;
  need: string;
  daily: string;
  have: string;
  requirements: string;
}

type Submission = {
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
  supplies: SubmissionSupply[];
  pathways: string;
  logisticsStatus: string;
  source?: string;
  proof?: string;
  notes?: string;
}

type CommunitySubmission = {
  name: string;
  age: number;
  province: string;
  city: string;
  suburb: string;
  address: string;
  contractPhone?: string;
  agentName?: string;
  agentContactPhone?: string;
  medicalSupplies?: SubmissionSupply[];
  liveSupplies?: SubmissionSupply[];
  needsVehicle?: boolean;
  notes?: string;
}

type GetSubmissionsRequest = {
  page: number;
  limit: number;
}