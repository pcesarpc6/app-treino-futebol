// WGER Workout Manager API
import { WGERExercise, WGERImage } from '../types/exercise';

const WGER_BASE_URL = 'https://wger.de/api/v2';

interface WGERResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function searchWGERExercises(searchTerm?: string): Promise<WGERExercise[]> {
  try {
    const url = searchTerm 
      ? `${WGER_BASE_URL}/exercise/?search=${encodeURIComponent(searchTerm)}&language=2` // 2 = English
      : `${WGER_BASE_URL}/exercise/?language=2`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WGER API error: ${response.status}`);
    }

    const data: WGERResponse<WGERExercise> = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Erro ao buscar exercícios no WGER:', error);
    return [];
  }
}

export async function getWGERExerciseById(id: number): Promise<WGERExercise | null> {
  try {
    const response = await fetch(`${WGER_BASE_URL}/exercise/${id}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WGER API error: ${response.status}`);
    }

    const exercise: WGERExercise = await response.json();
    return exercise;
  } catch (error) {
    console.error('Erro ao obter exercício do WGER:', error);
    return null;
  }
}

export async function getWGERExerciseImages(exerciseId: number): Promise<WGERImage[]> {
  try {
    const response = await fetch(
      `${WGER_BASE_URL}/exerciseimage/?exercise=${exerciseId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`WGER API error: ${response.status}`);
    }

    const data: WGERResponse<WGERImage> = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Erro ao obter imagens do exercício:', error);
    return [];
  }
}

export async function getMusclesList(): Promise<Array<{ id: number; name: string }>> {
  try {
    const response = await fetch(`${WGER_BASE_URL}/muscle/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WGER API error: ${response.status}`);
    }

    const data: WGERResponse<{ id: number; name: string }> = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Erro ao obter lista de músculos:', error);
    return [];
  }
}

export async function getEquipmentList(): Promise<Array<{ id: number; name: string }>> {
  try {
    const response = await fetch(`${WGER_BASE_URL}/equipment/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WGER API error: ${response.status}`);
    }

    const data: WGERResponse<{ id: number; name: string }> = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Erro ao obter lista de equipamentos:', error);
    return [];
  }
}

// Adaptar exercícios WGER para contexto de futebol
export function adaptWGERExerciseToFootball(exercise: WGERExercise): {
  name: string;
  description: string;
  footballContext: string;
} {
  const footballAdaptations: Record<string, string> = {
    'legs': 'Fundamental para potência de chute, velocidade e mudanças de direção no futebol',
    'arms': 'Importante para equilíbrio, proteção de bola e força em disputas',
    'abs': 'Essencial para estabilidade, força de chute e prevenção de lesões',
    'chest': 'Desenvolve força para disputas físicas e proteção de bola',
    'back': 'Crucial para postura, prevenção de lesões e força geral',
    'shoulders': 'Importante para equilíbrio, proteção e força em lançamentos laterais',
  };

  // Remover tags HTML da descrição
  const cleanDescription = exercise.description
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

  return {
    name: exercise.name,
    description: cleanDescription,
    footballContext: footballAdaptations[exercise.category?.toString()] || 
      'Exercício complementar para desenvolvimento físico geral do atleta',
  };
}
