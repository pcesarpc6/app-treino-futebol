// Tipos do Futpower

export type UserProfile = 'athlete' | 'coach';

export type AthleteLevel = 'base' | 'amateur' | 'professional';

export type Position = 
  | 'goalkeeper' 
  | 'defender' 
  | 'fullback' 
  | 'midfielder' 
  | 'winger' 
  | 'striker';

export type TrainingType = 'technical' | 'physical' | 'both';

export type TrainingLocation = 'field' | 'sand' | 'court' | 'gym' | 'home';

export interface UserData {
  name: string;
  age: number;
  email: string;
  phone: string;
  profile: UserProfile;
  
  // Dados específicos de atleta
  level?: AthleteLevel;
  position?: Position;
  trainingDaysPerWeek?: number;
  timePerTraining?: number;
  trainingType?: TrainingType;
  trainingLocations?: Record<string, TrainingLocation>;
  favoriteTeam?: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  completed: boolean;
}
