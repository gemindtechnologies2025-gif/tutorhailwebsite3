

export const Class_Variables: Record<number, string> = {
  0: "Pre primary(Kg/Foundation)",
  1: "Primary",
  2: "Middle school (O-level)",
  3: "High school (A-level)",
  4: "College",
  5: "Other",
};

export enum ClassMode {
  OFFLINE = 1,
  ONLINE = 2,
  HYBRID = 3
}
export const ClASS_MODE_NAME: Record<number, string> = {
  1: "Offline",
  2: "Online",
  3: "Hybrid"
}

export const TUTOR_TYPE = { POPULAR: 1, RECOMMENDED: 2 };



export enum TeachingLanguage {
  ENGLISH = 1,
  ARABIC = 2,
  BOTH = 3,
}

export enum ClassSetting {
  PUBLISH = 1,
  DRAFT = 2,
}

export enum ForumType {
  SELF = 1,
  OTHERS = 2,
}

export enum SortType {
  LATEST = 1,
  OLDEST = 2,
}

export enum CONTENT_TYPE {
  FORUM = 1,
  SHORT_VIDEO = 2,
  TEASER_VIDEO = 3,
  POST = 4,
}

export enum Engagements {
  UPVOTE = 1,
  DOWNVOTE = 2,
  LIKE = 3,
  COMMENT = 4,
  SHARE = 5,
  SAVE = 6,
  GIFT = 7,
  NOT_INTERESTED= 8,
  DONT_SHOW_CONTENT= 9,
  MUTE= 10,
}

export enum CommentEngagements {
  LIKE = 1,
  REPLY = 2,
}

export const UPVOTE_ROLE = {
  TUTOR: 1,
  PARENT: 2,
};

export const CLASS_LIST_TYPE = {
  POPULAR: 1,
  RECOMMENDED: 2,
  FREE:3
};

export const EDUCATION_ENUM_DISPLAY: Record<number, string> = {
  1: 'Diploma',
  2: 'Bachelors',
  3: 'Masters',
  4: 'Phd',
  5: 'Others',
};

export const HIGHER_EDUCATION_TYPE = {
  DIPLOMA: 1,
  BACHELORS: 2,
  MASTERS: 3,
  PHD: 4,
  OTHERS: 5,
};



export const TUTOR_DETAILS_ENUMS = {
  POST: 1,
  VIDEO: 2,
  CLASS: 3,
  IMAGE: 4,
  DOCUMENT: 5,
  FORUM: 6
}


export enum CLASS_TYPE {
  NORMAL = 1,
  RECURRENCE = 2,
}

export enum RECURRENCE_TYPE {
  DAILY = 1,
  WEEKLY = 2,
  MONTHLY = 3,
}

export const CLASS_SETTING = {
  PUBLISH: 1,
  DRAFT: 2,
};

export const TYPE_SUBJECT_LISTING = { CATEGORY: 1, SUBJECT: 2, TUTOR_SUBJECT: 3 };


export const TEASER_VIDEO_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3
}

export const STATUS_NAME: Record<number, string> = {
  1: 'Pending',
  2: 'Accepted',
  3: 'Rejected',

}

export const CLASS_TYPE2 = { NORMAL: 1, MASTER: 2, WORKSHOP: 3, SEMINAR: 4 };
export const CLASS_TYPE2_NAME: Record<number, string> = {
  1: 'Normal',
  2: 'Master',
  3: 'Workshop',
  4: 'Seminar'
}
export const CLASS_PAYMENT = { PER_HOUR: 1, SESSION: 2 };

export enum POST_TYPE {
  IMAGE = 1,
  VIDEO = 2,
  DOCUMENT = 3,
  POLL = 4,
}

export const DISCOUNT_TYPE = {
  FLAT: 1,
  PERCENTAGE: 2
}
export const PROMOCODE_TYPE_CLASS = {
  ONE_TO_ONE: 1,
  CLASS: 2,
  BOTH: 3,
};

export const INQUIRY_TYPE = { TEACHING_STYLE: 1, AVAILABILITY: 2, RESOURCES: 3, SUBJECT: 4, OTHERS: 5 };


export const GRADE_TYPE = {
  PRE_K: 1,
  KINDERGARTEN: 2,
  GRADE_1: 3,
  GRADE_2: 4,
  GRADE_3: 5,
  GRADE_4: 6,
  GRADE_5: 7,
  GRADE_6: 8,
  GRADE_7: 9,
  GRADE_8: 10,
  GRADE_9: 11,
  GRADE_10: 12,
  GRADE_11: 13,
  GRADE_12: 14,
  COLLEGE: 15,
  ADULT_LEARNING: 16,
  ALL_AGES: 17,
};

export const GRADE_TYPE_NAME: Record<number, string> = {
  1: 'Pre-K (Ages 3-4)',
  2: 'Kindergarten (Ages 5-6)',
  3: 'Grade 1 (Ages 6-7)',
  4: 'Grade 2 (Ages 7-8)',
  5: 'Grade 3 (Ages 8-9)',
  6: 'Grade 4 (Ages 9-10)',
  7: 'Grade 5 (Ages 10-11)',
  8: 'Grade 6 (Ages 11-12)',
  9: 'Grade 7 (Ages 12-13)',
  10: 'Grade 8 (Ages 13-14)',
  11: 'Grade 9 (Ages 14-15)',
  12: 'Grade 10 (Ages 15-16)',
  13: 'Grade 11 (Ages 16-17)',
  14: 'Grade 12 (Ages 17-18)',
  15: 'College (Ages 18+)',
  16: 'Adult Learning (Ages 25+)',
  17: 'All Ages',
};


export const CLASS_BOOK = { ALL: 1, SLOTS: 2 };

export const BOOK_FOR = { MYSELF: 1, OTHER: 2 }


export const REPORT = {
  NUDITY_SEXUAL: 1,
  VIOLENCE_HARMFUL_BEHAVIOR: 2,
  MISINFORMATION_FAKE_NEWS: 3,
  HARASSMENT_HATE_SPEECH: 4,
  SPAM_SCAMS: 5,
  COPYRIGHT_INFRINGEMENT: 6,
  CHILD_SAFETY_VIOLATIONS: 7
}

export const TEACHING_WRITTEN: Record<number, string> = {
  1: 'Visual Learning',
  2: 'Auditory Learning',
  3: 'Reading and Writing',
  4: 'Integrated Approach',
  5: 'Other',
};

export const DURATION_TYPE = {
  HOURS: 1,
  DAYS: 2,
};


export const SOCIAL_LINK_TYPE = {
  FACEBOOK: 1,
  LINKEDIN: 2,
  YOUTUBE: 3,
  INSTAGRAM: 4,
};

 export const CHAT_TYPE = {
  BOOKING: 1,
  NORMAL: 2,
};

export enum CHAT_MEDIA {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
  DOC = 'DOC',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  LOCATION = 'LOCATION',
}

export enum CHAT_REPORT {
  REPORT = 1,
  BLOCK = 2,
  UNBLOCK = 3,
}

export enum REPORT_CHAT {
  SCAM_FRAUD = 1,
  HARASSMENT = 2,
  OFF_PLATFORM_TRANSACTION = 3,
  INAPPROPRIATE_CONTENT = 4,
  SPAM = 5,
  OTHER = 6,
}


export enum POLL_DURATION {
  ONE_DAY = 1,
  THREE_DAYS = 2,
  ONE_WEEK = 3,
  TWO_WEEK = 4,
}


export enum PUSH_TYPE_KEYS {
  DEFAULT = 0,
  TUTOR_ACCEPTED = 1,
  TUTOR_REJECTED = 2,
  REVERT_COMPLAINT = 3,
  REGISTER = 4,
  BOOKING_ACCEPTED = 5,
  BOOKING_COMPLETED = 6,
  BOOKING_CANCELLED = 7,
  BOOKING_REJECTED = 8,
  PAIRING = 9,
  PARENT_REGISTER = 10,
  TUTOR_REGISTER = 11,
  REVERT_QUERY = 12,
  COMPLAINT = 13,
  QUERY = 14,
  BOOKING_ADDED = 15,
  MESSAGE_SENT = 16,
  REFUND_PAYMENT = 17,
  WITHDRAWL_REQUEST = 18,
  WITHDRAW_ACCEPTED = 19,
  WITHDRAW_REJECTED = 20,
  PAYMENT_COMPLETED = 21,
  REFUND_REJECTED = 22,
  PAIRING_OTP_START = 23,
  PAIRING_OTP_END = 24,
  BOOKING_COMPLETED_PARENT = 25,
  BEFORE_BOOKING_START = 26,
  END_OF_CLASS = 27,
  TUTOR_CALL_JOINED = 28,
  PARENT_CALL_JOINED = 29,
  GIFT_ADDED = 30,
  CLASS_ACCEPT = 31,
  CLASS_REJECT = 32,
  FOLLOW = 33,
  FORUM = 34,
  SHORT_VIDEO = 35,
  TEASER_VIDEO = 36,
  POST = 37,
  COTUTOR = 38,
  LIKE_POST = 39,
  LIKE_FORUM = 40,
  LIKE_TEASER = 41,
  LIKE_SHORT_VIDEO = 42,
  COMMENT_POST = 43,
  COMMENT_FORUM = 44,
  COMMENT_TEASER = 45,
  COMMENT_SHORT_VIDEO = 46,
  UPDATE_CLASS = 47,
  CLASS_BOOKED = 48,
}




