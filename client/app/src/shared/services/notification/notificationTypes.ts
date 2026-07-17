export const NotificationChannel = {
  DEFAULT: "default",
  DOCTOR: "doctor",
  CHEMIST: "chemist",
  LEAVE: "leave",
  ATTENDANCE: "attendance",
  DAY_PLAN: "day-plan",
  TOUR: "tour",
  EXPENSE: "expense",
  EMERGENCY: "emergency",
} as const;

export const NotificationScreen = {
  HOME: "Home",
  DOCTOR_DETAILS: "DoctorDetails",
  CHEMIST_DETAILS: "ChemistDetails",
  LEAVE: "Leave",
  DAY_PLAN: "DayPlan",
  TOUR_PLAN: "TourPlan",
  EXPENSE: "Expense",
} as const;

// before navigate("DoctorDetails");
// now  navigate(NotificationScreen.DOCTOR_DETAILS);