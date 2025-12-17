"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { UserData, UserProfile, AthleteLevel, Position, TrainingType, TrainingLocation } from "@/lib/types";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const DAYS_OF_WEEK = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<Partial<UserData>>({
    trainingLocations: {}
  });

  useEffect(() => {
    // Verificar se usuário está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth/login');
      } else {
        setUserId(session.user.id);
        setUserData(prev => ({ ...prev, email: session.user.email || '' }));
      }
    });
  }, [router]);

  const totalSteps = userData.profile === 'athlete' ? 7 : 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    if (!userId) {
      toast.error("Erro ao identificar usuário");
      return;
    }

    setLoading(true);

    try {
      // Salvar dados do usuário no Supabase
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: userData.email!,
          name: userData.name!,
          age: userData.age!,
          phone: userData.phone || '',
          profile: userData.profile!,
          level: userData.level,
          position: userData.position,
          training_days_per_week: userData.trainingDaysPerWeek,
          time_per_training: userData.timePerTraining,
          training_type: userData.trainingType,
          favorite_team: userData.favoriteTeam,
        });

      if (userError) throw userError;

      // Salvar locais de treino
      if (userData.trainingLocations && Object.keys(userData.trainingLocations).length > 0) {
        const locationsData = Object.entries(userData.trainingLocations).map(([day, location]) => ({
          user_id: userId,
          day_of_week: day,
          location: location as TrainingLocation,
        }));

        const { error: locationsError } = await supabase
          .from('training_locations')
          .insert(locationsData);

        if (locationsError) throw locationsError;
      }

      // Criar treinos iniciais para o usuário
      if (userData.profile === 'athlete') {
        const initialWorkouts = [
          {
            user_id: userId,
            name: "Treino Técnico - Dribles",
            type: "technical" as const,
            duration: 45,
            location: "field" as const,
            difficulty: "intermediate" as const,
            description: "Aperfeiçoe seus dribles com exercícios progressivos",
            completed: false,
          },
          {
            user_id: userId,
            name: "Treino Físico - Resistência",
            type: "physical" as const,
            duration: 60,
            location: "field" as const,
            difficulty: "advanced" as const,
            description: "Melhore sua resistência cardiovascular",
            completed: false,
          },
          {
            user_id: userId,
            name: "Treino de Finalizações",
            type: "technical" as const,
            duration: 45,
            location: "field" as const,
            difficulty: "intermediate" as const,
            description: "Pratique diferentes tipos de finalizações",
            completed: false,
          },
        ];

        const { error: workoutsError } = await supabase
          .from('workouts')
          .insert(initialWorkouts);

        if (workoutsError) throw workoutsError;

        // Criar desafios iniciais
        const initialChallenges = [
          {
            user_id: userId,
            name: "Desafio dos 100 Dribles",
            description: "Complete 100 dribles bem-sucedidos",
            progress: 0,
            total: 100,
            completed: false,
          },
          {
            user_id: userId,
            name: "Maratona de Resistência",
            description: "Complete 7 treinos de resistência",
            progress: 0,
            total: 7,
            completed: false,
          },
        ];

        const { error: challengesError } = await supabase
          .from('challenges')
          .insert(initialChallenges);

        if (challengesError) throw challengesError;
      }

      toast.success("Perfil criado com sucesso!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erro ao salvar dados:", error);
      toast.error(error.message || "Erro ao criar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen futpower-gradient py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Logo size="md" />
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-6 mb-2">
            Vamos criar seu perfil
          </h1>
          <p className="text-[#A8D5BA]">
            Passo {step} de {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-[#4ADE80]/30">
            <div 
              className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFC700] transition-all duration-300 energy-glow"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <Card className="futpower-card p-6 md:p-8 rounded-2xl shadow-2xl">
          {/* Step 1: Dados Básicos */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6">Dados Básicos</h2>
              
              <div>
                <Label htmlFor="name" className="text-[#1A4D2E] font-semibold">Nome Completo</Label>
                <Input 
                  id="name"
                  placeholder="Seu nome"
                  value={userData.name || ""}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className="mt-2 border-[#4ADE80]/30 focus:border-[#4ADE80]"
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-[#1A4D2E] font-semibold">Idade</Label>
                <Input 
                  id="age"
                  type="number"
                  placeholder="Sua idade"
                  value={userData.age || ""}
                  onChange={(e) => setUserData({...userData, age: parseInt(e.target.value)})}
                  className="mt-2 border-[#4ADE80]/30 focus:border-[#4ADE80]"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-[#1A4D2E] font-semibold">E-mail</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={userData.email || ""}
                  disabled
                  className="mt-2 border-[#4ADE80]/30 bg-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-[#1A4D2E] font-semibold">Telefone</Label>
                <Input 
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={userData.phone || ""}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  className="mt-2 border-[#4ADE80]/30 focus:border-[#4ADE80]"
                />
              </div>
            </div>
          )}

          {/* Step 2: Perfil */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6">Qual é o seu perfil?</h2>
              
              <RadioGroup 
                value={userData.profile} 
                onValueChange={(value: UserProfile) => setUserData({...userData, profile: value})}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 border-2 border-[#4ADE80]/30 rounded-xl hover:bg-[#4ADE80]/5 hover:border-[#4ADE80] cursor-pointer transition-all">
                  <RadioGroupItem value="athlete" id="athlete" className="border-[#4ADE80]" />
                  <Label htmlFor="athlete" className="cursor-pointer flex-1">
                    <div className="font-semibold text-lg text-[#1A4D2E]">Atleta</div>
                    <div className="text-sm text-gray-600">Quero treinar e evoluir minha performance</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border-2 border-[#4ADE80]/30 rounded-xl hover:bg-[#4ADE80]/5 hover:border-[#4ADE80] cursor-pointer transition-all">
                  <RadioGroupItem value="coach" id="coach" className="border-[#4ADE80]" />
                  <Label htmlFor="coach" className="cursor-pointer flex-1">
                    <div className="font-semibold text-lg text-[#1A4D2E]">Professor/Treinador</div>
                    <div className="text-sm text-gray-600">Quero criar treinos para meus atletas</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Nível (apenas atletas) */}
          {step === 3 && userData.profile === 'athlete' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6">Qual é o seu nível?</h2>
              
              <RadioGroup 
                value={userData.level} 
                onValueChange={(value: AthleteLevel) => setUserData({...userData, level: value})}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 border-2 border-[#4ADE80]/30 rounded-xl hover:bg-[#4ADE80]/5 hover:border-[#4ADE80] cursor-pointer transition-all">
                  <RadioGroupItem value="base" id="base" className="border-[#4ADE80]" />
                  <Label htmlFor="base" className="cursor-pointer flex-1">
                    <div className="font-semibold text-lg text-[#1A4D2E]">Atleta de Base</div>
                    <div className="text-sm text-gray-600">Categorias sub-15, sub-17, sub-20</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border-2 border-[#4ADE80]/30 rounded-xl hover:bg-[#4ADE80]/5 hover:border-[#4ADE80] cursor-pointer transition-all">
                  <RadioGroupItem value="amateur" id="amateur" className="border-[#4ADE80]" />
                  <Label htmlFor="amateur" className="cursor-pointer flex-1">
                    <div className="font-semibold text-lg text-[#1A4D2E]">Atleta Amador</div>
                    <div className="text-sm text-gray-600">Jogo por hobby ou em times amadores</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border-2 border-[#4ADE80]/30 rounded-xl hover:bg-[#4ADE80]/5 hover:border-[#4ADE80] cursor-pointer transition-all">
                  <RadioGroupItem value="professional" id="professional" className="border-[#4ADE80]" />
                  <Label htmlFor="professional" className="cursor-pointer flex-1">
                    <div className="font-semibold text-lg text-[#1A4D2E]">Atleta Profissional</div>
                    <div className="text-sm text-gray-600">Jogo profissionalmente em clubes</div>
                  </Label>
                </div>
              </RadioGroup>

              {userData.age && userData.age < 16 && (
                <div className="bg-yellow-50 border-2 border-[#FFD700] rounded-xl p-4 flex gap-3">
                  <AlertCircle className="text-[#FFD700] flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-[#1A4D2E] mb-1">Atenção!</p>
                    <p className="text-sm text-gray-700">
                      Atletas menores de 16 anos devem treinar sob supervisão de um profissional qualificado. 
                      Ao continuar, você declara estar ciente dessa recomendação.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Posição (apenas atletas) */}
          {step === 4 && userData.profile === 'athlete' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6">Qual é a sua posição?</h2>
              
              <Select 
                value={userData.position} 
                onValueChange={(value: Position) => setUserData({...userData, position: value})}
              >
                <SelectTrigger className="w-full border-[#4ADE80]/30 focus:border-[#4ADE80]">
                  <SelectValue placeholder="Selecione sua posição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="goalkeeper">Goleiro</SelectItem>
                  <SelectItem value="defender">Zagueiro</SelectItem>
                  <SelectItem value="fullback">Lateral</SelectItem>
                  <SelectItem value="midfielder">Volante/Meia</SelectItem>
                  <SelectItem value="winger">Ponta</SelectItem>
                  <SelectItem value="striker">Atacante</SelectItem>
                </SelectContent>
              </Select>

              <div className="bg-[#4ADE80]/10 border-2 border-[#4ADE80]/30 rounded-xl p-4">
                <p className="text-sm text-[#1A4D2E]">
                  💡 Seus treinos serão personalizados de acordo com as demandas da sua posição em campo.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Frequência de Treino (apenas atletas) */}
          {step === 5 && userData.profile === 'athlete' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6">Frequência de Treino</h2>
              
              <div>
                <Label htmlFor="trainingDays" className="text-[#1A4D2E] font-semibold">Quantos dias por semana você pode treinar?</Label>
                <Select 
                  value={userData.trainingDaysPerWeek?.toString()} 
                  onValueChange={(value) => setUserData({...userData, trainingDaysPerWeek: parseInt(value)})}
                >
                  <SelectTrigger className="w-full mt-2 border-[#4ADE80]/30 focus:border-[#4ADE80]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        {day} {day === 1 ? 'dia' : 'dias'} por semana
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timePerTraining" className="text-[#1A4D2E] font-semibold">Quanto tempo por treino? (minutos)</Label>
                <Select 
                  value={userData.timePerTraining?.toString()} 
                  onValueChange={(value) => setUserData({...userData, timePerTraining: parseInt(value)})}
                >
                  <SelectTrigger className="w-full mt-2 border-[#4ADE80]/30 focus:border-[#4ADE80]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                    <SelectItem value="90">90 minutos</SelectItem>
                    <SelectItem value="120">120 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#1A4D2E] font-semibold">Tipo de treino desejado</Label>
                <RadioGroup 
                  value={userData.trainingType} 
                  onValueChange={(value: TrainingType) => setUserData({...userData, trainingType: value})}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="technical" id="technical" className="border-[#4ADE80]" />
                    <Label htmlFor="technical" className="cursor-pointer text-gray-700">Técnico (fundamentos, dribles, passes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="physical" id="physical" className="border-[#4ADE80]" />
                    <Label htmlFor="physical" className="cursor-pointer text-gray-700">Físico (força, resistência, velocidade)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" className="border-[#4ADE80]" />
                    <Label htmlFor="both" className="cursor-pointer text-gray-700">Ambos (técnico + físico)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 6: Local de Treino (apenas atletas) */}
          {step === 6 && userData.profile === 'athlete' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6">Onde você treina?</h2>
              <p className="text-gray-600 mb-4">Selecione o local para cada dia da semana que você treina</p>
              
              <div className="space-y-4">
                {DAYS_OF_WEEK.slice(0, userData.trainingDaysPerWeek || 3).map((day) => (
                  <div key={day}>
                    <Label className="text-[#1A4D2E] font-semibold">{day}</Label>
                    <Select 
                      value={userData.trainingLocations?.[day]} 
                      onValueChange={(value: TrainingLocation) => 
                        setUserData({
                          ...userData, 
                          trainingLocations: {...userData.trainingLocations, [day]: value}
                        })
                      }
                    >
                      <SelectTrigger className="w-full mt-2 border-[#4ADE80]/30 focus:border-[#4ADE80]">
                        <SelectValue placeholder="Selecione o local" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="field">Campo de Futebol</SelectItem>
                        <SelectItem value="sand">Areia/Praia</SelectItem>
                        <SelectItem value="court">Quadra</SelectItem>
                        <SelectItem value="gym">Academia</SelectItem>
                        <SelectItem value="home">Casa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Time do Coração (apenas atletas) */}
          {step === 7 && userData.profile === 'athlete' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6">Qual é o seu time do coração? ⚽</h2>
              
              <div>
                <Label htmlFor="favoriteTeam" className="text-[#1A4D2E] font-semibold">Time</Label>
                <Input 
                  id="favoriteTeam"
                  placeholder="Ex: Flamengo, Barcelona, Real Madrid..."
                  value={userData.favoriteTeam || ""}
                  onChange={(e) => setUserData({...userData, favoriteTeam: e.target.value})}
                  className="mt-2 border-[#4ADE80]/30 focus:border-[#4ADE80]"
                />
              </div>

              <div className="bg-[#4ADE80]/10 border-2 border-[#4ADE80]/30 rounded-xl p-4 flex gap-3">
                <CheckCircle2 className="text-[#4ADE80] flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-[#1A4D2E] mb-1">Quase lá!</p>
                  <p className="text-sm text-gray-700">
                    Você está prestes a começar sua jornada de evolução no futebol. 
                    Vamos criar treinos personalizados para você! 🚀
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 para Coach: Mensagem Final */}
          {step === 3 && userData.profile === 'coach' && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4ADE80] to-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4 energy-glow">
                <CheckCircle2 className="text-white" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-[#1A4D2E]">Perfil de Treinador Criado!</h2>
              <p className="text-gray-700">
                Você terá acesso a ferramentas para criar treinos personalizados para seus atletas.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={loading}
                className="flex-1 border-[#4ADE80]/30 text-[#1A4D2E] hover:bg-[#4ADE80]/5"
              >
                <ArrowLeft className="mr-2" size={18} />
                Voltar
              </Button>
            )}
            
            {step < totalSteps ? (
              <Button 
                onClick={handleNext}
                className="flex-1 futpower-button-primary"
                disabled={
                  (step === 1 && (!userData.name || !userData.age || !userData.email)) ||
                  (step === 2 && !userData.profile)
                }
              >
                Próximo
                <ArrowRight className="ml-2" size={18} />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 futpower-button-accent"
              >
                {loading ? "Salvando..." : "Finalizar"}
                <CheckCircle2 className="ml-2" size={18} />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
