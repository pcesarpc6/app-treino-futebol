"use client";

import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Users, Zap, Star, Quote, Play, Dumbbell, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ExerciseCard } from "@/components/custom/exercise-card";
import { generateWorkout } from "@/lib/api/exercise-service";
import { Exercise } from "@/lib/types/exercise";

export default function Home() {
  const [selectedFocus, setSelectedFocus] = useState<string>('velocidade');
  const [selectedLevel, setSelectedLevel] = useState<Exercise['difficulty']>('intermediário');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  const testimonials = [
    {
      name: "Lucas Mendes",
      role: "Atleta Profissional - Série B",
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
      rating: 5,
      text: "O Futpower revolucionou minha preparação física. Os treinos personalizados me ajudaram a melhorar meu condicionamento em 40% na última temporada."
    },
    {
      name: "Mariana Silva",
      role: "Atleta de Base - Sub-17",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      rating: 5,
      text: "Consegui evoluir muito tecnicamente com os treinos específicos. Fui convocada para a seleção estadual graças ao acompanhamento detalhado!"
    },
    {
      name: "Rafael Costa",
      role: "Atleta Amador - Futebol Society",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      rating: 5,
      text: "Mesmo jogando só nos finais de semana, o app me ajudou a manter a forma e melhorar minha técnica. Virei referência no meu time!"
    },
    {
      name: "Gabriel Oliveira",
      role: "Atleta de Base - Sub-20",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      rating: 5,
      text: "A análise de desempenho é incrível. Consigo ver exatamente onde preciso melhorar e os treinos são sempre desafiadores."
    },
    {
      name: "Ana Paula Santos",
      role: "Atleta Profissional - Série A1 Feminino",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      rating: 5,
      text: "Uso o Futpower como complemento aos treinos do clube. A personalização por IA é surpreendente e os resultados aparecem rápido!"
    },
    {
      name: "Pedro Henrique",
      role: "Atleta Amador - Várzea",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      rating: 5,
      text: "Nunca imaginei que poderia treinar com tanta qualidade sem precisar de um preparador físico. O app é sensacional!"
    }
  ];

  const handleGenerateWorkout = async () => {
    setLoading(true);
    try {
      const workout = await generateWorkout(selectedFocus, selectedLevel);
      setExercises(workout);
    } catch (error) {
      console.error('Erro ao gerar treino:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen futpower-gradient">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Logo size="md" />
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-[#4ADE80]/30">
            <span className="text-white font-semibold text-sm md:text-base">
              ⚽ O futuro do treino de futebol está aqui
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Treine como joga.
            <br />
            <span className="futpower-text-gradient">Evolua com inteligência.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#A8D5BA] mb-8 max-w-2xl mx-auto">
            Treinos personalizados por IA para atletas de base, amadores e profissionais. 
            Evolua sua performance com acompanhamento inteligente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding">
              <Button 
                size="lg" 
                className="futpower-button-primary text-lg px-8 py-6 rounded-xl hover:scale-105 transition-all duration-300"
              >
                Começar Agora
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-6 rounded-xl"
              onClick={() => document.getElementById('treinos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Treinos
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-[#FFD700]/30">
            <span className="text-white font-semibold text-sm">
              ⭐ Avaliado com 5 estrelas
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Quem treina com a gente,
            <br />
            <span className="futpower-text-gradient">aprova e evolui!</span>
          </h2>
          <p className="text-lg text-[#A8D5BA] max-w-2xl mx-auto">
            Veja o que atletas de todos os níveis estão dizendo sobre o Futpower
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="futpower-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 relative"
            >
              <Quote className="absolute top-4 right-4 text-[#FFD700]/20" size={32} />
              
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#4ADE80]"
                />
                <div>
                  <h4 className="font-bold text-[#1A4D2E] text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="fill-[#FFD700] text-[#FFD700]" size={16} />
                ))}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { number: "10k+", label: "Atletas Ativos" },
            { number: "50k+", label: "Treinos Realizados" },
            { number: "4.9", label: "Avaliação Média" },
            { number: "95%", label: "Satisfação" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
            >
              <div className="text-3xl md:text-4xl font-bold text-[#FFD700] mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-white/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workout Generator Section - NOVA SEÇÃO */}
      <section id="treinos" className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-[#4ADE80]/30">
            <span className="text-white font-semibold text-sm">
              🎯 Treinos Personalizados com IA
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Experimente um treino
            <br />
            <span className="futpower-text-gradient">personalizado agora!</span>
          </h2>
          <p className="text-lg text-[#A8D5BA] max-w-2xl mx-auto">
            Selecione seu foco e nível para gerar um treino completo com vídeos demonstrativos
          </p>
        </div>

        {/* Workout Configuration */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="futpower-card rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Foco do Treino */}
              <div>
                <label className="block text-sm font-semibold text-[#1A4D2E] mb-3">
                  <Target className="inline mr-2" size={16} />
                  Foco do Treino:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {['velocidade', 'força', 'resistência'].map((focus) => (
                    <button
                      key={focus}
                      onClick={() => setSelectedFocus(focus)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedFocus === focus
                          ? 'border-[#4ADE80] bg-[#4ADE80]/10 text-[#1A4D2E] font-bold'
                          : 'border-gray-300 hover:border-[#4ADE80]/50'
                      }`}
                    >
                      {focus.charAt(0).toUpperCase() + focus.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nível */}
              <div>
                <label className="block text-sm font-semibold text-[#1A4D2E] mb-3">
                  <Dumbbell className="inline mr-2" size={16} />
                  Seu Nível:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {(['iniciante', 'intermediário', 'avançado'] as Exercise['difficulty'][]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedLevel === level
                          ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#1A4D2E] font-bold'
                          : 'border-gray-300 hover:border-[#FFD700]/50'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerateWorkout}
              disabled={loading}
              className="w-full futpower-button-primary text-lg py-6 rounded-xl hover:scale-105 transition-all duration-300"
            >
              {loading ? (
                <>
                  <Clock className="mr-2 animate-spin" size={20} />
                  Gerando seu treino...
                </>
              ) : (
                <>
                  <Play className="mr-2" size={20} />
                  Gerar Treino Personalizado
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Exercise Cards */}
        {exercises.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Seu Treino de {selectedFocus.charAt(0).toUpperCase() + selectedFocus.slice(1)}
              </h3>
              <p className="text-[#A8D5BA]">
                {exercises.length} exercícios • Nível {selectedLevel} • ~45 minutos
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              title: "IA Personalizada",
              description: "Treinos gerados automaticamente baseados no seu perfil e objetivos"
            },
            {
              icon: Target,
              title: "Foco em Resultados",
              description: "Evolução técnica e física com acompanhamento detalhado"
            },
            {
              icon: TrendingUp,
              title: "Estatísticas Claras",
              description: "Visualize seu progresso com gráficos e relatórios simples"
            },
            {
              icon: Users,
              title: "Comunidade Ativa",
              description: "Desafios, rankings e conexão com outros atletas"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="futpower-card rounded-2xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFC700] rounded-xl flex items-center justify-center mb-4 energy-glow">
                <feature.icon className="text-[#1A4D2E]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1A4D2E] mb-2">{feature.title}</h3>
              <p className="text-gray-700 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="futpower-card rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A4D2E] mb-4">
            Pronto para evoluir?
          </h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de atletas que já estão treinando de forma inteligente
          </p>
          <Link href="/onboarding">
            <Button 
              size="lg" 
              className="futpower-button-accent text-lg px-8 py-6 rounded-xl hover:scale-105 transition-all duration-300"
            >
              Criar Meu Perfil Grátis
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-white/60 text-sm">
          © 2024 Futpower. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
