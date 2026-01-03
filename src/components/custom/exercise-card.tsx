"use client";

import { useState } from 'react';
import { Exercise } from '@/lib/types/exercise';
import { Play, Info, Target, Dumbbell, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const difficultyColors = {
    'iniciante': 'bg-green-100 text-green-800 border-green-300',
    'intermediário': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'avançado': 'bg-red-100 text-red-800 border-red-300',
  };

  const categoryColors = {
    'força': 'bg-blue-100 text-blue-800',
    'agilidade': 'bg-purple-100 text-purple-800',
    'potência': 'bg-orange-100 text-orange-800',
    'resistência': 'bg-teal-100 text-teal-800',
    'técnica': 'bg-pink-100 text-pink-800',
  };

  return (
    <div className="futpower-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
      {/* Vídeo ou Imagem */}
      {exercise.videoUrl && exercise.videoSource === 'youtube' ? (
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${exercise.videoUrl}`}
            title={exercise.name}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : exercise.imageUrl ? (
        <div className="relative w-full aspect-video bg-gray-100">
          <img 
            src={exercise.imageUrl} 
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
          {exercise.videoSource === 'exercisedb' && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
              <Play size={12} />
              GIF Animado
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-[#1A4D2E] to-[#4ADE80] flex items-center justify-center">
          <Dumbbell className="text-white" size={48} />
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#1A4D2E] mb-2">{exercise.name}</h3>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[exercise.difficulty]}`}>
                {exercise.difficulty}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[exercise.category]}`}>
                {exercise.category}
              </span>
            </div>
          </div>
        </div>

        {/* Objetivo */}
        <div className="mb-4 p-3 bg-[#A8D5BA]/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Target className="text-[#1A4D2E] flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-sm font-semibold text-[#1A4D2E] mb-1">Objetivo:</p>
              <p className="text-sm text-gray-700">{exercise.objective}</p>
            </div>
          </div>
        </div>

        {/* Informações Rápidas */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Séries</p>
            <p className="text-lg font-bold text-[#1A4D2E]">{exercise.sets}</p>
          </div>
          <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Repetições</p>
            <p className="text-lg font-bold text-[#1A4D2E]">{exercise.reps}</p>
          </div>
          <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Descanso</p>
            <p className="text-lg font-bold text-[#1A4D2E]">{exercise.rest}</p>
          </div>
        </div>

        {/* Músculos Trabalhados */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-[#1A4D2E] mb-2 flex items-center gap-2">
            <Dumbbell size={14} />
            Músculos Trabalhados:
          </p>
          <div className="flex flex-wrap gap-2">
            {exercise.musclesWorked.map((muscle, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-[#FFD700]/20 text-[#1A4D2E] rounded-md text-xs font-medium"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Botão Ver Detalhes */}
        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="outline"
          className="w-full border-[#1A4D2E] text-[#1A4D2E] hover:bg-[#1A4D2E] hover:text-white transition-colors"
        >
          <Info size={16} className="mr-2" />
          {showDetails ? 'Ocultar Detalhes' : 'Ver Detalhes Completos'}
        </Button>

        {/* Detalhes Expandidos */}
        {showDetails && (
          <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
            {/* Descrição */}
            <div>
              <p className="text-sm font-semibold text-[#1A4D2E] mb-2">Descrição:</p>
              <p className="text-sm text-gray-700 leading-relaxed">{exercise.description}</p>
            </div>

            {/* Dicas de Execução */}
            {exercise.tips.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[#1A4D2E] mb-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-600" />
                  Dicas de Execução Correta:
                </p>
                <ul className="space-y-1">
                  {exercise.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Erros Comuns */}
            {exercise.commonMistakes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[#1A4D2E] mb-2 flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-600" />
                  Erros Comuns a Evitar:
                </p>
                <ul className="space-y-1">
                  {exercise.commonMistakes.map((mistake, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">✗</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
