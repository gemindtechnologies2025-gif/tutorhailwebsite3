
export interface User {
  location: {
    type: string;
    coordinates: [number, number];
  };
  name: string;
  userName: string;
  bioMetricId: string;
  email: string;
  phoneNo: string;
  dialCode: string;
  countryISOCode: string;
  age: string;
  isProfileComplete:boolean;
  gender?:string;
  image?: string;
  tutorStatus: number;
  isNotification: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  isSocialLogin: boolean;
  appleId: string;
  googleId: string;
  linkedInId: string;
  microsoftId: string;
  deviceToken: string;
  loginCount: number;
  isPasswordSet: boolean;
  shortBio: string;
  isProfileComplete: boolean;
  profileCompletedAt: number;
  documentVerification: boolean;
  address: string;
  type: number;
  isActive: boolean;
  isOnline: boolean;
  longitude: number;
  latitude: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  deviceType: string;
  accessToken:string;
  notificationUnreadCount?:number;
  chatUnreadCount?:number;
}

