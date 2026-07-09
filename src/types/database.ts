// Hand-written types mirroring supabase/migrations/0001_init.sql and 0002_users_and_avatars.sql.
// Keep in sync manually if the schema changes (no CLI codegen available in this environment).

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";
export type GroupType = "family" | "couple" | "friends" | "solo" | "other";
export type UserRole = "admin" | "staff" | "customer";

export interface SiteType {
  id: string;
  code: "rv" | "free";
  name_ja: string;
  description: string | null;
  price_per_night: number;
  capacity_people: number;
  capacity_note: string | null;
  sort_order: number;
  active: boolean;
}

export interface ExperienceOption {
  id: string;
  code: string;
  name_ja: string;
  description: string | null;
  price: number;
  unit: "per_group" | "per_person";
  sort_order: number;
  active: boolean;
}

export interface Booking {
  id: string;
  created_at: string;
  updated_at: string;
  status: BookingStatus;

  stay_date: string;
  nights: number;
  site_type_id: string;

  num_adults: number;
  num_children: number;
  num_infants: number;

  customer_name: string;
  customer_email: string;
  customer_phone: string | null;

  region: string | null;
  group_type: GroupType | null;
  purpose: string | null;
  desired_experience: string[];
  stay_style: string | null;
  referral_source: string | null;
  repeat_intention: string | null;

  notes: string | null;
  admin_memo: string | null;
  total_price: number;

  cancel_token: string;
  approved_at: string | null;
  approved_by: string | null;
  cancelled_at: string | null;
  user_id: string | null;
}

export interface BookingOption {
  id: string;
  booking_id: string;
  option_id: string;
  quantity: number;
  unit_price: number;
}

export interface BookingWithRelations extends Booking {
  site_type?: SiteType;
  booking_options?: (BookingOption & { experience_option?: ExperienceOption })[];
}

export interface Survey {
  id: string;
  booking_id: string;
  token: string;
  sent_at: string | null;
  responded_at: string | null;
  satisfaction_score: number | null;
  memorable_experience: string | null;
  improvement_points: string | null;
  revisit_intention: string | null;
  review_ok: boolean | null;
  review_text: string | null;
  large_facility_wishes: string | null;
  ai_summary: string | null;
  ai_tags: string[];
}

export interface Review {
  id: string;
  survey_id: string | null;
  booking_id: string | null;
  display_name: string;
  content: string;
  rating: number | null;
  published: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  handled: boolean;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}
