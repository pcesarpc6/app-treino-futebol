"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  TrendingUp, 
  Trophy, 
  Calendar,
  Clock,
  Target,
  Zap,
  ArrowRight,
  CheckCircle2,
  Flame,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type UserData = {
  name: string;
  profile: string;
  level?: string;
  position?: string;
};

type Workout = {
  id: string;
  name: string;
  type: string;
  duration: number;
  completed: boolean;
  created_at: string;
};

type Challenge = {
  id: string;
  name: string;
  progress: number;
  total: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Carregar dados do usuário
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError) throw userError;
      setUserData(user);

      // Carregar treinos recentes
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (workoutsError) throw workoutsError;
      setWorkouts(workoutsData || []);

      // Carregar desafios ativos
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('completed', false)
        .limit(2);

      if (challengesError) throw challengesError;
      setChallenges(challengesData || []);

    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4ADE80] border-t-transparent"></div>
      </div>
    );
  }

  const userName = userData?.name || "Atleta";
  const currentStreak = 7;
  const weeklyGoal = 4;
  const completedThisWeek = workouts.filter(w => w.completed).length;
  const nextTraining = "Hoje, 18:00";

  const recentWorkouts = workouts.map(w => ({
    id: w.id,
    name: w.name,
    date: new Date(w.created_at).toLocaleDateString('pt-BR'),
    duration: `${w.duration} min`,
    completed: w.completed
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="futpower-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A4D2E] mb-2">
              Bem-vindo de volta, {userName}! 👋
            </h1>
            <p className="text-gray-600">
              Continue sua jornada de evolução no futebol
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFC700] px-4 py-2 rounded-xl energy-glow">
              <Flame className="text-[#1A4D2E]" size={24} />
              <div>
                <p className="text-xs text-[#1A4D2E]/70 font-semibold">Sequência</p>
                <p className="text-2xl font-bold text-[#1A4D2E]">{currentStreak} dias</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="futpower-card p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4ADE80] to-[#22C55E] rounded-xl flex items-center justify-center">
              <Dumbbell className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-[#1A4D2E]">{completedThisWeek}/{weeklyGoal}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-600">Treinos esta semana</h3>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#4ADE80] to-[#22C55E] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedThisWeek / weeklyGoal) * 100}%` }}
            />
          </div>
        </Card>

        <Card className="futpower-card p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFC700] rounded-xl flex items-center justify-center energy-glow">
              <TrendingUp className="text-[#1A4D2E]" size={24} />
            </div>
            <span className="text-2xl font-bold text-[#1A4D2E]">+12%</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-600">Evolução no mês</h3>
          <p className="text-xs text-[#4ADE80] mt-1">↑ Melhor que o mês passado</p>
        </Card>

        <Card className="futpower-card p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4ADE80] to-[#22C55E] rounded-xl flex items-center justify-center">
              <Trophy className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-[#1A4D2E]">{challenges.length}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-600">Desafios ativos</h3>
          <p className="text-xs text-gray-500 mt-1">Continue progredindo</p>
        </Card>

        <Card className="futpower-card p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFC700] rounded-xl flex items-center justify-center energy-glow">
              <Clock className="text-[#1A4D2E]" size={24} />
            </div>
            <span className="text-sm font-bold text-[#1A4D2E]">{nextTraining}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-600">Próximo treino</h3>
          <p className="text-xs text-gray-500 mt-1">Treino Técnico - Campo</p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="futpower-card p-6 lg:col-span-2">
          <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard/treinos">
              <Button className="w-full h-24 futpower-button-primary flex-col gap-2 hover:scale-105 transition-all">
                <Dumbbell size={28} />
                <span className="text-base">Iniciar Treino</span>
              </Button>
            </Link>
            <Link href="/dashboard/treinos">
              <Button className="w-full h-24 bg-white border-2 border-[#4ADE80] text-[#1A4D2E] hover:bg-[#4ADE80]/10 flex-col gap-2 hover:scale-105 transition-all">
                <Target size={28} />
                <span className="text-base">Ver Treinos</span>
              </Button>
            </Link>
            <Link href="/dashboard/progresso">
              <Button className="w-full h-24 bg-white border-2 border-[#4ADE80] text-[#1A4D2E] hover:bg-[#4ADE80]/10 flex-col gap-2 hover:scale-105 transition-all">
                <TrendingUp size={28} />
                <span className="text-base">Meu Progresso</span>
              </Button>
            </Link>
            <Link href="/dashboard/desafios">
              <Button className="w-full h-24 futpower-button-accent flex-col gap-2 hover:scale-105 transition-all">
                <Trophy size={28} />
                <span className="text-base">Desafios</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Today's Focus */}
        <Card className="futpower-card p-6">
          <h2 className="text-xl font-bold text-[#1A4D2E] mb-4">Foco de Hoje</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#4ADE80]/10 to-[#22C55E]/10 border-2 border-[#4ADE80]/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-[#FFD700]" size={20} />
                <h3 className="font-bold text-[#1A4D2E]">Treino Recomendado</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Treino Técnico - Controle de Bola
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock size={14} />
                <span>45 minutos</span>
                <span>•</span>
                <Calendar size={14} />
                <span>Campo</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[#1A4D2E] text-sm">Metas do Dia</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="text-[#4ADE80]" size={16} />
                  <span className="text-gray-700">Completar treino técnico</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-500">Registrar progresso</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  <span className="text-gray-500">Manter sequência ativa</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity & Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <Card className="futpower-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1A4D2E]">Treinos Recentes</h2>
            <Link href="/dashboard/treinos">
              <Button variant="ghost" size="sm" className="text-[#4ADE80] hover:text-[#22C55E]">
                Ver todos
                <ArrowRight className="ml-1" size={16} />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map((workout) => (
                <div 
                  key={workout.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-[#4ADE80]/5 to-transparent border border-[#4ADE80]/20 hover:border-[#4ADE80]/40 transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#4ADE80] to-[#22C55E] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-white" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1A4D2E] text-sm truncate">{workout.name}</h3>
                    <p className="text-xs text-gray-500">{workout.date} • {workout.duration}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">Nenhum treino realizado ainda</p>
            )}
          </div>
        </Card>

        {/* Active Challenges */}
        <Card className="futpower-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1A4D2E]">Desafios Ativos</h2>
            <Link href="/dashboard/desafios">
              <Button variant="ghost" size="sm" className="text-[#4ADE80] hover:text-[#22C55E]">
                Ver todos
                <ArrowRight className="ml-1" size={16} />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {challenges.length > 0 ? (
              challenges.map((challenge) => (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#1A4D2E] text-sm">{challenge.name}</h3>
                    <span className="text-xs font-bold text-[#4ADE80]">
                      {challenge.progress}/{challenge.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#FFD700] to-[#FFC700] h-2 rounded-full transition-all duration-300 energy-glow"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">Nenhum desafio ativo</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
