// Tipos para o sistema de exercícios

export interface Exercise {
  id: string;
  name: string;
  description: string;
  objective: string;
  musclesWorked: string[];
  sets: number;
  reps: string;
  rest: string;
  tips: string[];
  commonMistakes: string[];
  videoUrl?: string;
  videoSource?: 'youtube' | 'exercisedb' | 'wger';
  imageUrl?: string;
  category: 'força' | 'agilidade' | 'potência' | 'resistência' | 'técnica';
  difficulty: 'iniciante' | 'intermediário' | 'avançado';
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  channelTitle: string;
}

export interface ExerciseDBExercise {
  id: string;
  name: string;
  target: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  instructions: string[];
}

export interface WGERExercise {
  id: number;
  name: string;
  description: string;
  category: number;
  muscles: number[];
  equipment: number[];
  images: WGERImage[];
}

export interface WGERImage {
  id: number;
  image: string;
  is_main: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  exercises: Exercise[];
  targetLevel: 'amador' | 'base' | 'profissional';
  focus: string[];
}
