// ExerciseDB API via RapidAPI
import { ExerciseDBExercise } from '../types/exercise';

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '0ac918be3bmsha94716c7ce02f08p1580fajsnf432928042c5';
const RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com';

export async function searchExercisesByName(name: string): Promise<ExerciseDBExercise[]> {
  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/exercises/name/${encodeURIComponent(name)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`);
    }

    const exercises = await response.json();
    return exercises || [];
  } catch (error) {
    console.error('Erro ao buscar exercícios por nome:', error);
    return [];
  }
}

export async function searchExercisesByTarget(target: string): Promise<ExerciseDBExercise[]> {
  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/exercises/target/${encodeURIComponent(target)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`);
    }

    const exercises = await response.json();
    return exercises || [];
  } catch (error) {
    console.error('Erro ao buscar exercícios por target:', error);
    return [];
  }
}

export async function searchExercisesByBodyPart(bodyPart: string): Promise<ExerciseDBExercise[]> {
  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/exercises/bodyPart/${encodeURIComponent(bodyPart)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`);
    }

    const exercises = await response.json();
    return exercises || [];
  } catch (error) {
    console.error('Erro ao buscar exercícios por parte do corpo:', error);
    return [];
  }
}

export async function getExerciseById(id: string): Promise<ExerciseDBExercise | null> {
  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/exercises/exercise/${id}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`);
    }

    const exercise = await response.json();
    return exercise || null;
  } catch (error) {
    console.error('Erro ao obter exercício por ID:', error);
    return null;
  }
}

export async function getAllExercises(limit: number = 10): Promise<ExerciseDBExercise[]> {
  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/exercises?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status}`);
    }

    const exercises = await response.json();
    return exercises || [];
  } catch (error) {
    console.error('Erro ao obter todos os exercícios:', error);
    return [];
  }
}

// Mapear exercícios para contexto de futebol
export function mapExerciseToFootball(exercise: ExerciseDBExercise): {
  name: string;
  target: string;
  equipment: string;
  gifUrl: string;
  instructions: string[];
} {
  const footballContext: Record<string, string> = {
    'quads': 'quadríceps (essencial para chutes e sprints)',
    'glutes': 'glúteos (potência em saltos e mudanças de direção)',
    'hamstrings': 'posteriores de coxa (velocidade e prevenção de lesões)',
    'calves': 'panturrilhas (explosão e equilíbrio)',
    'abs': 'abdômen (estabilidade e força de chute)',
    'lower back': 'lombar (postura e prevenção de lesões)',
    'chest': 'peitoral (força em disputas)',
    'shoulders': 'ombros (proteção e equilíbrio)',
    'triceps': 'tríceps (força em lançamentos laterais)',
    'biceps': 'bíceps (força geral)',
  };

  return {
    name: exercise.name,
    target: footballContext[exercise.target] || exercise.target,
    equipment: exercise.equipment,
    gifUrl: exercise.gifUrl,
    instructions: exercise.instructions || [],
  };
}
