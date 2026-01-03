// Serviço integrado para buscar exercícios com fallback automático
import { Exercise } from '../types/exercise';
import { searchExerciseVideo } from './youtube';
import { searchExercisesByName, searchExercisesByTarget, mapExerciseToFootball } from './exercisedb';
import { searchWGERExercises, getWGERExerciseImages, adaptWGERExerciseToFootball } from './wger';

export async function getExerciseWithVideo(
  exerciseName: string,
  objective: string,
  musclesWorked: string[],
  category: Exercise['category'],
  difficulty: Exercise['difficulty']
): Promise<Exercise> {
  const baseExercise: Exercise = {
    id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: exerciseName,
    description: '',
    objective,
    musclesWorked,
    sets: 3,
    reps: '10-12',
    rest: '60s',
    tips: [],
    commonMistakes: [],
    category,
    difficulty,
  };

  // TENTATIVA 1: YouTube Data API (fonte principal)
  console.log(`🎥 Buscando vídeo no YouTube para: ${exerciseName}`);
  const youtubeVideo = await searchExerciseVideo(exerciseName, objective);
  
  if (youtubeVideo) {
    console.log(`✅ Vídeo encontrado no YouTube: ${youtubeVideo.title}`);
    return {
      ...baseExercise,
      videoUrl: youtubeVideo.videoId,
      videoSource: 'youtube',
      description: youtubeVideo.description || generateDefaultDescription(exerciseName, objective),
      tips: generateDefaultTips(category),
      commonMistakes: generateDefaultMistakes(category),
    };
  }

  console.log(`⚠️ Nenhum vídeo encontrado no YouTube, tentando ExerciseDB...`);

  // TENTATIVA 2: ExerciseDB API (fallback secundário)
  const exerciseDBResults = await searchExercisesByName(exerciseName);
  
  if (exerciseDBResults.length > 0) {
    const exercise = exerciseDBResults[0];
    const mappedExercise = mapExerciseToFootball(exercise);
    
    console.log(`✅ Exercício encontrado no ExerciseDB: ${mappedExercise.name}`);
    
    return {
      ...baseExercise,
      name: mappedExercise.name,
      imageUrl: mappedExercise.gifUrl,
      videoSource: 'exercisedb',
      description: mappedExercise.instructions.join(' ') || generateDefaultDescription(exerciseName, objective),
      musclesWorked: [mappedExercise.target],
      tips: generateDefaultTips(category),
      commonMistakes: generateDefaultMistakes(category),
    };
  }

  console.log(`⚠️ Nenhum exercício encontrado no ExerciseDB, tentando WGER...`);

  // TENTATIVA 3: WGER API (fallback terciário)
  const wgerResults = await searchWGERExercises(exerciseName);
  
  if (wgerResults.length > 0) {
    const exercise = wgerResults[0];
    const adaptedExercise = adaptWGERExerciseToFootball(exercise);
    const images = await getWGERExerciseImages(exercise.id);
    
    console.log(`✅ Exercício encontrado no WGER: ${adaptedExercise.name}`);
    
    return {
      ...baseExercise,
      name: adaptedExercise.name,
      imageUrl: images[0]?.image || undefined,
      videoSource: 'wger',
      description: `${adaptedExercise.description}\n\n${adaptedExercise.footballContext}`,
      tips: generateDefaultTips(category),
      commonMistakes: generateDefaultMistakes(category),
    };
  }

  console.log(`⚠️ Nenhuma fonte externa disponível, usando dados padrão`);

  // FALLBACK FINAL: Dados padrão gerados
  return {
    ...baseExercise,
    description: generateDefaultDescription(exerciseName, objective),
    tips: generateDefaultTips(category),
    commonMistakes: generateDefaultMistakes(category),
  };
}

// Funções auxiliares para gerar conteúdo padrão
function generateDefaultDescription(exerciseName: string, objective: string): string {
  return `${exerciseName} é um exercício focado em ${objective}. Este movimento é essencial para o desenvolvimento físico de atletas de futebol, contribuindo para melhor performance em campo.`;
}

function generateDefaultTips(category: Exercise['category']): string[] {
  const tipsByCategory: Record<Exercise['category'], string[]> = {
    'força': [
      'Mantenha a postura correta durante todo o movimento',
      'Controle a respiração: expire na fase de esforço',
      'Aqueça adequadamente antes de iniciar',
      'Progrida gradualmente na carga',
    ],
    'agilidade': [
      'Foque na velocidade de execução mantendo a técnica',
      'Mantenha o core ativado para estabilidade',
      'Use calçado adequado para evitar lesões',
      'Pratique os movimentos lentamente primeiro',
    ],
    'potência': [
      'Execute o movimento de forma explosiva',
      'Descanse adequadamente entre as séries',
      'Concentre-se na velocidade máxima',
      'Mantenha a técnica mesmo em alta intensidade',
    ],
    'resistência': [
      'Mantenha ritmo constante durante o exercício',
      'Controle a respiração de forma ritmada',
      'Hidrate-se adequadamente',
      'Aumente gradualmente a duração',
    ],
    'técnica': [
      'Priorize a qualidade do movimento sobre a quantidade',
      'Pratique com frequência para criar memória muscular',
      'Filme-se para analisar e corrigir a técnica',
      'Comece devagar e aumente a velocidade progressivamente',
    ],
  };

  return tipsByCategory[category];
}

function generateDefaultMistakes(category: Exercise['category']): string[] {
  const mistakesByCategory: Record<Exercise['category'], string[]> = {
    'força': [
      'Usar carga excessiva comprometendo a técnica',
      'Não realizar amplitude completa do movimento',
      'Prender a respiração durante o exercício',
      'Não aquecer adequadamente',
    ],
    'agilidade': [
      'Sacrificar a técnica pela velocidade',
      'Não manter o core estável',
      'Pousar com os joelhos rígidos',
      'Não respeitar os limites do corpo',
    ],
    'potência': [
      'Não descansar o suficiente entre séries',
      'Perder a explosão por fadiga excessiva',
      'Compensar com outros músculos',
      'Não aquecer adequadamente para exercícios explosivos',
    ],
    'resistência': [
      'Começar em ritmo muito acelerado',
      'Não controlar a respiração',
      'Desidratação durante o exercício',
      'Não respeitar sinais de fadiga extrema',
    ],
    'técnica': [
      'Priorizar velocidade sobre precisão',
      'Não corrigir erros de execução',
      'Pular etapas de progressão',
      'Não prestar atenção aos detalhes do movimento',
    ],
  };

  return mistakesByCategory[category];
}

// Gerar treino completo com múltiplos exercícios
export async function generateWorkout(
  focus: string,
  level: Exercise['difficulty'],
  duration: number = 45
): Promise<Exercise[]> {
  const workoutTemplates: Record<string, Array<{
    name: string;
    objective: string;
    muscles: string[];
    category: Exercise['category'];
  }>> = {
    'velocidade': [
      { name: 'Sprint com mudança de direção', objective: 'Desenvolver velocidade e agilidade', muscles: ['Quadríceps', 'Posteriores', 'Panturrilhas'], category: 'agilidade' },
      { name: 'Skipping alto', objective: 'Melhorar frequência de passada', muscles: ['Flexores do quadril', 'Panturrilhas'], category: 'potência' },
      { name: 'Aceleração progressiva', objective: 'Desenvolver explosão inicial', muscles: ['Glúteos', 'Quadríceps'], category: 'potência' },
    ],
    'força': [
      { name: 'Agachamento', objective: 'Desenvolver força de membros inferiores', muscles: ['Quadríceps', 'Glúteos', 'Posteriores'], category: 'força' },
      { name: 'Avanço', objective: 'Fortalecer pernas unilateralmente', muscles: ['Quadríceps', 'Glúteos'], category: 'força' },
      { name: 'Prancha', objective: 'Fortalecer core e estabilidade', muscles: ['Abdômen', 'Lombar'], category: 'força' },
    ],
    'resistência': [
      { name: 'Corrida intervalada', objetivo: 'Melhorar capacidade aeróbica', muscles: ['Sistema cardiovascular', 'Pernas'], category: 'resistência' },
      { name: 'Burpees', objective: 'Desenvolver resistência muscular', muscles: ['Corpo todo'], category: 'resistência' },
      { name: 'Mountain climbers', objective: 'Resistência e core', muscles: ['Abdômen', 'Ombros', 'Pernas'], category: 'resistência' },
    ],
  };

  const exercises = workoutTemplates[focus] || workoutTemplates['força'];
  const workoutExercises: Exercise[] = [];

  for (const template of exercises) {
    const exercise = await getExerciseWithVideo(
      template.name,
      template.objective,
      template.muscles,
      template.category,
      level
    );
    workoutExercises.push(exercise);
  }

  return workoutExercises;
}
