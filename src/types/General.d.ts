export interface SignUpType {
  email?: string;
  phoneNo?: string;
  dialCode?: string;
  password?: string;
  countryISOCode?: string;
}

export interface VerifyOtp {
  email?: string;
  phoneNo?: string;
  countryISOCode?: string;
  dialCode?: string;
  deviceType?: any;
  deviceToken?: any;
  deviceDetails?: any;
  otp?: string;
  type?: number;
}
export type ContactSupport = {
  dialCode: string;
  phoneNo: string;
  countryISOCode?: string;
  email: string;
};

export type FAQ = {
  question: string;
  answer: string;
  _id: string;
};

export type CMSData = {
  contactSupport: ContactSupport;
  privacyPolicy: string;
  termsAndConditions: string;
  cancellationPolicy: string;
  refundPolicy: string;
  customerPolicy: string | null;
  eula: string;
  aboutUs: string;
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  faq: FAQ[];
  id: string;
};

export interface ResetPassword {
  email?: string;
  phoneNo?: string;
  countryISOCode?: string;
  type: number;
  dialCode?: string;
}

export interface Login {
  email?: string;
  phoneNo?: string;
  countryISOCode?: string;
  deviceToken?: any;
  deviceType?: string;
  dialCode?: string;
  password?: string;
  deviceDetails?: any;
}

export interface UpdateProfile {
  name?: string;
  gender?: string;
  image?: string;
  address?: string;
  isActive?: boolean;
  secondaryRole?:any;
  bannerImg?:string;
}

export interface TutorDetails {
  latitude: number;
  longitude: number;
  address: string;
  _id: string;
  name: string;
  image: string;
  avgRating: number;
  isFav: boolean;
  subjects: string[];
  price: number;
  classCount: number;
  documentVerification: boolean;
}

export interface ParentDashBoardResponse {
  recomended: TutorDetails[];
  tutor: TutorDetails[];
  parentAddress: any;
}

interface Parent {
  _id: string;
  name: string;
  image: string;
}

interface Rating {
  rating: number;
  review: string;
  parents: Parent;
}

interface Subject {
  _id?: string;
  name: string;
  isDeleted?: boolean;
}

interface Class {
  _id: Key | null | undefined;
  name: string;
}

interface Certificate {
  fieldOfStudy: string;
  description: string;
  startDate?: string;
  endDate?: string;
  institutionName?: string;
}

interface Achievement {
  description: string;
  startDate?: string;
  endDate?: string;
  institutionName?: string;
}

interface TeachingDetails {
  totalTeachingExperience: number;
  startTime: string;
  endTime: string;
  price: number;
  teachingLanguage: number;
   classes: number[];
   usdPrice:number;
}

export interface TutorDetailsById extends TutorDetails {
  shortBio: string;
  address: string;
  isActive: boolean;
  gender: "MALE" | "FEMALE";
  teachingdetails: TeachingDetails;
  subjects: Subject[];
  classes: Class[];
  ratings: Rating[];
  ratingCount: number;
  certificates: Certificate[];
  achievements: Achievement[];
  latitude: number;
  longitude: number;
  classCount?: number;
  bannerImg?:string;
}

interface OTP {
  _id: string;
  otp: string;
  phoneNo: string;
  email: string;
  dialCode: string;
  expiredAt: string;
  parentId: string | null;
  tutorId: string;
  bookingId: string;
  bookingDetailId: string;
  isDeleted: boolean;
  pairingType: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BookingDetail {
  date: string;
  startTime: string;
  endTime: string;
  bookingStatus: number;
  otp: OTP;
}

export interface Booking {
  _id: string;
  tutors: {
    name: string;
    image: string;
  };
  teachingdetails: {
    price: number;
  };
  subjects: {
    name: string;
    isDeleted?: boolean;
  }[];
  bookingdetails: BookingDetail[];
}

export interface CurrentBooking {
  booking: Booking;
  tutor: TutorDetails[];
  totalTutor: number;
  classCount?: number;
}

export interface BankAccount {
  accountNumber: string;
  accountHolderName: string;
  swiftCode: string;
  bankName: string;
}

export interface Content {
  subjectId: string;
  title: string;
  description: string;
  images: string[];
  contentType: number;
}

interface TeachingClass {
  name: string;
}

interface SubjectProfile {
  name: string;
}

export interface TeachingProfile {
  totalTeachingExperience: number;
  teachingStyle: number[];
  curriculum: number[];
  teachingLanguage: number;
  classes: TeachingClass[];
  subject: SubjectProfile[];
  price: number;
  startTime: string | null; // ISO date string
  endTime: string | null; // ISO date string
}

export interface DocumentsList {
  documents: Document[];
}

interface Document {
  frontImage?: string;
  description?: string;
  documentName?: number;
  documentType?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  institutionName?: string;
}

interface Document {
  frontImage?: string;
  description?: string;
  documentName?: number;
  documentType?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  institutionName?: string;
}

export interface Subject {
  _id: string;
  tutorId: string;
  name: string;
  isDeleted: boolean;
  specializationType: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TutorFilterResponse {
  tutor: TutorDetails[];
  totalTutor: number;
}

export interface SearchData {
  tutor: TutorDetails[];
  totalTutor: number;
}

export interface Address {
  private _id(_id: any): void;
  latitude: number;
  longitude: number;
  houseNumber: string;
  landMark: string;
  city: string;
  country: string;
  addressType: number;
  id: string;
  parentId: {
    latitude: number;
    longitude: number;
    phoneNo: string;
    countryISOCode: string;
    dialCode: string;
  };
}

interface AddressResponse {
  address: Address[];
  totaluserAddress: number;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface BookingDataResponse {
  bookings: TimeSlot[];
  date: string;
}

// Interface for the time slot details
interface TimeSlotResponse {
  date: string; // ISO date string
  startTime: string; // ISO date string for start time
  endTime: string; // ISO date string for end time
  tutorId: string; // ID of the tutor
  noOfHours: number; // Number of hours for the time slot
  perHourPrice: number; // Price per hour for the time slot
}

// Interface for the booking details
interface BookingResponse {
  tutorId: string; // ID of the tutor
  subjectId: string[]; // Array of subject IDs
  parentAddressId: string; // ID of the parent address
  distance: number; // Distance in kilometers
  latitude: number; // Latitude of the location
  longitude: number; // Longitude of the location
  timeSlots: TimeSlot[]; // Array of time slots
  parentId: string; // ID of the parent
  transportationFees: number; // Transportation fees
  bookingNumber: string; // Booking number
  totalNoOfHours: number; // Total number of hours
  totalPrice: number; // Total price
  totalDistance: number; // Total distance
  totalTransportationFees: number; // Total transportation fees
  serviceFees: number; // Service fees
  grandTotal: string; // Grand total as a string
  promocodeId:string;
  discountAmount:any;
}

// Interface for the setting details
interface SettingResponse {
  distanceAmount: number; // Amount per unit distance
  serviceFees: number; // Service fees
  isDeleted: boolean; // Whether the setting is deleted
  _id: string; // MongoDB ID
  distanceType: number; // Type of distance measurement
  createdAt: string; // ISO date string for creation time
  updatedAt: string; // ISO date string for last update time
  __v: number; // Version key for MongoDB
  serviceType: number; // Type of service
  id: string; // Alternative ID (possibly redundant)
}

// Main interface that includes both booking and setting
interface BookingResponseData {
  booking: BookingResponse;
  setting: SettingResponse;
}

interface LinkPayment {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: string | null;
  status: string;
}

interface SettingCheckout {
  distanceAmount: number;
  serviceFees: number;
  isDeleted: boolean;
  _id: string;
  distanceType: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  serviceType: number;
  id: string;
}

export interface CheckoutResponse {
  link: LinkPayment;
  setting: SettingCheckout;
}

type tutorBookingDetails = Pick<
  TutorDetails,
  "image" | "avgRating" | "classCount" | "name"
>;

interface ParentBooking {
  grandTotal: number;
  classId: any;
  teachingdetails: any;
  classModeOnline: any;
  _id: string;
  bookingStatus: number;
  cancelReason: string;
  isRated: boolean;
  cancelledAt: string | null;
  additionalInfo: string;
  tutors: tutorBookingDetails;
  subjects: { name: string; isDeleted?: boolean }[];
  bookingdetails: BookingDetail[];
}

export interface ParenBookingResponse {
  booking: ParentBooking[];
  totalBooking: number;
}

interface BookingDetailsById extends BookingDetail {
  _id?: string;
  callJoinedByParent?: boolean;
  distance: number;
  pairingType: number;
}

interface ParentAddress {
  _id: string;
  location: Location;
  parentId: string;
  houseNumber: string;
  landMark: string;
  streetAddress: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isDeleted: boolean;
  addressType: number;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  __v: number;
}

interface TutorBookingDetails {
  _id: string;
  name: string;
  image: string;
  address: string;
  longitude: number;
  latitude: number;
  classCount: number;
  avgRating: number;
}
export interface BookingDetailsByIdResponse {
  subjects: any;
  classModeOnline: any;
  classId: any;
  _id: string;
  totalNoOfHours: number;
  totalPrice: number;
  bookingStatus: number;
  cancelReason: string;
  totalDistance: number;
  totalTransportationFees: number;
  serviceFees: number;
  grandTotal: number;
  isRated: boolean;
  refundDate: string | null; // ISO 8601 format or null
  refundRejectReason: string | null;
  cancelledAt: string | null; // ISO 8601 format or null
  additionalInfo: string;
  tutors: TutorBookingDetails;
  teachingdetails: {
    price: number;
  };
  bookingdetails: BookingDetailsById[];
  subjectspecializations: {
    name: string;
  }[];
  parentAddress: ParentAddress[];
  connectionId: string;
}

interface PairingData {
  _id: string;
  bookingStatus: number;
  cancelReason: string;
  isRated: boolean;
  cancelledAt: string | null;
  additionalInfo: string;
  tutors: {
    name: string;
    image: string;
    avgRating: number;
  };
  teachingdetails: {
    price: number;
  };
  subjects: {
    name: string;
    isDeleted?: boolean;
  }[];
  bookingdetails: {
    date: string;
    startTime: string;
    endTime: string;
    bookingStatus: number;
    pairingType: number;
    otp: OTP;
  }[];
}

export interface PairingResponse {
  booking: PairingData[];
  totalBooking: number;
}

interface ChatItem {
  connectionId: string;
  unreadCount: ReactNode;
  _id: string;
  message: string;
  parentId: {
    _id: string;
    name: string;
    email: string;
    phoneNo: string;
    image: string;
    createdAt: string;
  };
  tutorId: {
    _id: string;
    name: string;
    email: string;
    phoneNo: string;
    image: string;
  };
  bookingId: string;
  sentBy: number;
  createdAt: string;
  bookings: {
    _id: string;
    bookingStatus: number;
  };
}

export interface ChatData {
  chat: ChatItem[];
  totalchat: number;
}
export interface chatHistory {
  tutorId: any;
  isParentBlocked: boolean;
  isTutorBlocked: boolean;
  message: string;
  isDeleted: boolean;
  isParentRead: boolean;
  isTutorRead: boolean;
  sentBy: number;
  createdAt: string;
  updatedAt: string;
  connectionId: string;
  _id: string;
}
export interface chatHistoryResponse {
  chatAgree: any;
  message: chatHistory[];
  totalmessage: number;
}

export interface Material {
  _id: string;
  bookingId: string;
  parentId: string;
  bookingDetailId: string | null;
  title: string;
  description: string;
  content: string;
  isDeleted: boolean;
  createdAt: string; // Consider using `Date` type if you want to work with dates more effectively
  updatedAt: string; // Consider using `Date` type if you want to work with dates more effectively
  __v: number;
}

export interface MaterialResponse {
  material: Material[];
  totalContent: number;
}

export interface wishList {
  _id: string;
  tutorId: string;
  tutors: {
    name: string;
    image: string;
  };
  teachingdetails: {
    price: number;
  }[];
  avgRating: number | null;
  isFav: boolean;
  classCount?: number; // Marked as optional because one object does not have it
}

export interface wishListResponse {
  data: wishList[];
  total: number;
}

export interface ForumTypeInterface {
  votesCount: any;
  userVotedOptionId: any;
  pollOptions: any;
  options: any;
  question: string;
  _id: string;
  images: string[];
  title: string;
  description: string;
  upVoteCount: number;
  downVoteCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;
  createdBy: number;
  createdAt: string;
  views: number;
  subjects: any;
  user: PostedUser;
  isUpvote: boolean;
  isDownvote: boolean;
  isLike: boolean;
  isSave: boolean;
  isFollowing: boolean;
  category?:any;
  uploadType?:any;
  contentType?:any;
}
export interface PostedUser {
  _id: string;
  name: string;
  userName: string;
  image: string;
  followers: number;
}

export interface EngagementType {
  contentId: string;
  engagementType: number;
  commentText?: string;
  image?: string;
}

export interface CommentEngagementType {
  commentId: string;
  type: number;
  reply?: string;
  image?: string;
}
