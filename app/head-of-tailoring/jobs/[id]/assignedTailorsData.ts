export interface AssignedTailor {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  workload: string;
  status: "Active" | "On Leave" | "Busy";
  specialty: string;
}

export const assignedTailorsDummyData: AssignedTailor[] = [
  {
    id: 1,
    name: "Ada Chukwu",
    role: "Lead Tailor",
    email: "ada.chukwu@hildam.com",
    phone: "+234 803 112 4455",
    workload: "3 active jobs",
    status: "Active",
    specialty: "Bridal and Bespoke Gowns",
  },
  {
    id: 2,
    name: "Tolu Ajayi",
    role: "Pattern Specialist",
    email: "tolu.ajayi@hildam.com",
    phone: "+234 706 553 8844",
    workload: "2 active jobs",
    status: "Busy",
    specialty: "Structured Bodice Patterns",
  },
  {
    id: 3,
    name: "Efe Okorie",
    role: "Finishing Tailor",
    email: "efe.okorie@hildam.com",
    phone: "+234 812 004 9921",
    workload: "1 active job",
    status: "Active",
    specialty: "Hand Finishing and Embellishments",
  },
];