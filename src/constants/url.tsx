export const API_URL = process.env.REACT_APP_API_URL;
export const MEDIA_UPLOAD = process.env.REACT_APP_MEDIA_UPLOAD ||'';
export const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
export const Linkedin_clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
export const LinkedIn_clientSecret =process.env.REACT_APP_LINKEDIN_CLIENT_SECRET;
export const REDIRECTLINK = process.env.REACT_APP_REDIRECT_LINK;
export const Linkedin_redirect_url =process.env.REACT_APP_LINKEDIN_REDIRECT_URL;
export const EXCHANGE_KEY = process.env.REACT_APP_EXCHANGE_API;

export const END_POINTS = {
  //auth
  signup: "signup",
  socialLogin: "socialLogin",
  login: "login",
  mediaUpload: "upload",
  get_user: "getProfile",
  logout: "logout",
  forgotPassword: "forgotPassword",
  verifyOtp: "verifyOtp",
  resetPassword: "resetPassword",
  changePassword: "changePassword",
  updateProfile: "updateProfile",
  deleteProfile: "deleteProfile",
  sendOtp: "sendOtp",
  linkedinLogin: "linkedInToken",

  //tutor profile setup
  addBank: "addBank",
  getBank: "getBank",
  updateBank: "updateBank",
  deleteBank: "deleteBank",
  teachingDetails: "teachingDetails",
  deleteTeachingDetails: "deleteTeachingDetails",
  deleteSubjectDetails: "deleteSubjectDetails",
  getTeachingDetails: "getTeachingDetails",
  addDocuments: "addDocuments",
  getDocuments: "getDocuments",
  updateDocuments: "updateDocuments",
  deleteDocuments: "deleteDocuments",
  withdraw: "withdraw",
  getBooking: "getBooking",
  updateBooking: "updateBooking",
  pairingOtp: "pairingOtp",
  contentMaterial: "contentMaterial",
  reviews: "reviews",
  notification: "notification",
  addRating: "addRating",

  // CMS
  cms: "cms",

  // DashBoard
  DashBoard: "dashboard",
  homepage: "homepage",
  subject: "subject",
  search: "dashboardSearch",

  // address
  addAddress: "addAddress",
  getAddress: "getAddress",
  updateAddress: "updateAddress",
  deleteAddress: "deleteAddress",

  // study Material
  studyMaterial: "studyMaterial",
  // booking
  timeCheck: "timeCheck",
  booking: "booking",
  cancelBooking: "cancelBooking",
  verifyPairingOtp: "verifyPairingOtp",

  // tutor details
  tutor: "tutor",
  popularTutor: "popularTutor",
  recommendedTutor: "recommendedTutor",
  homepageTutor: "homepageTutor",
  viewers:'viewers',
  followers:'followers',

  // chat
  chatList: "chatList",
  chating: "chating",

  // wishlist
  getWishlist: "getWishlist",
  addWishlist: "addWishlist",

  //videoCall
  joinVideoCall: "joinVideoCall",

  // content
  createContent: "createContent",
  getContent: "getContent",
  getContentById: "getContent",
  updateContent: "updateContent",
  deleteContent: "deleteContent",

  // engagement
  engagement: "engagement",
  commentEngagement: "commentEngagement",
  comments: "comments",
  follow: 'follow',


  //class
  getClass: "getClass",
  catSubList: "catSubList",
  subClassList: "subClassList",
  tutorList: 'tutorList',
  createClass: "createClass",
  updateClass: 'updateClass',
  deleteClass: 'deleteClass',
  classSlots:'classSlots',
  classBook:"classBook",

  //promocodes
  addPromocode:"addPromocode",
  getPromocode:"getPromocode",
  updatePromoCode:"updatePromoCode",
  deletePromoCode:"deletePromoCode",
  promocodeList:"promocodeList",
  promoDetails:"promoDetails",
  promocode:"promocode",

  //inquiry
  inquiry:"inquiry",
  tutorReport:'reportTutor',
  inquiryRevert:"inquiryRevert",
  saveContent:"saveContent",
  saveClass:"saveClass",
  reportContent:"reportContent",
  socialLinks:"socialLinks",

  blockReportChat:"blockReportChat",
  subjectList:'subjectList',
  iconCount:'iconCount',
  agreeChat:'agreeChat',
  reportClass:'reportClass',
  pollVote:'pollVote',
  pollResult:'pollResult',
  usersVoted:'usersVoted',
  coTutorStatus:'coTutorStatus',
  gifts:'gifts',
  

};
