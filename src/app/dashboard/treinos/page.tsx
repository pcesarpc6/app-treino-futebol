"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play,
  Clock,
  MapPin,
  Target,
  CheckCircle2,
  Calendar,
  Filter,
  Plus
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Workout = {
  id: string;
  name: string;
  type: string;
  duration: number;
  location: string;
  difficulty: string;
  description: string;
  completed: boolean;
};

const locationLabels: Record<string, string> = {
  field: "Campo",
  sand: "Areia",
  court: "Quadra",
  gym: "Academia",
  home: "Casa"
};

const typeLabels: Record<string, string> = {
  technical: "Técnico",
  physical: "Físico",
  both: "Completo"
};

const difficultyLabels: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado"
};

export default function TreinosPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar treinos:', error);
      toast.error('Erro ao carregar treinos');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWorkout = async (workoutId: string) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .update({ 
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', workoutId);

      if (error) throw error;

      toast.success('Treino concluído! 🎉');
      loadWorkouts();
    } catch (error: any) {
      console.error('Erro ao completar treino:', error);
      toast.error('Erro ao completar treino');
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    if (filter === "all") return true;
    if (filter === "technical") return workout.type === "technical";
    if (filter === "physical") return workout.type === "physical";
    if (filter === "available") return !workout.completed;
    if (filter === "completed") return workout.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4ADE80] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="futpower-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A4D2E] mb-2">Meus Treinos</h1>
            <p className="text-gray-600">Treinos personalizados para sua evolução</p>
          </div>
          <Button className="futpower-button-primary">
            <Plus className="mr-2" size={20} />
            Gerar Novo Treino
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="futpower-card p-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            size="sm" 
            className={filter === "all" ? "futpower-button-primary" : "border-[#4ADE80]/30"}
            onClick={() => setFilter("all")}
          >
            <Filter className="mr-2" size={16} />
            Todos
          </Button>
          <Button 
            variant={filter === "technical" ? "default" : "outline"}
            size="sm" 
            className={filter === "technical" ? "futpower-button-primary" : "border-[#4ADE80]/30"}
            onClick={() => setFilter("technical")}
          >
            Técnico
          </Button>
          <Button 
            variant={filter === "physical" ? "default" : "outline"}
            size="sm" 
            className={filter === "physical" ? "futpower-button-primary" : "border-[#4ADE80]/30"}
            onClick={() => setFilter("physical")}
          >
            Físico
          </Button>
          <Button 
            variant={filter === "available" ? "default" : "outline"}
            size="sm" 
            className={filter === "available" ? "futpower-button-primary" : "border-[#4ADE80]/30"}
            onClick={() => setFilter("available")}
          >
            Disponíveis
          </Button>
          <Button 
            variant={filter === "completed" ? "default" : "outline"}
            size="sm" 
            className={filter === "completed" ? "futpower-button-primary" : "border-[#4ADE80]/30"}
            onClick={() => setFilter("completed")}
          >
            Concluídos
          </Button>
        </div>
      </Card>

      {/* Treinos Grid */}
      {filteredWorkouts.length === 0 ? (
        <Card className="futpower-card p-12 text-center">
          <Target className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum treino encontrado</h3>
          <p className="text-gray-500">
            {filter === "all" 
              ? "Comece gerando seu primeiro treino personalizado!"
              : "Tente ajustar os filtros para ver mais treinos"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWorkouts.map((treino) => (
            <Card key={treino.id} className="futpower-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-[#1A4D2E]">{treino.name}</h3>
                    {treino.completed && (
                      <CheckCircle2 className="text-[#4ADE80]" size={20} />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{treino.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-[#4ADE80]/20 text-[#1A4D2E] hover:bg-[#4ADE80]/30">
                  {typeLabels[treino.type] || treino.type}
                </Badge>
                <Badge variant="outline" className="border-[#4ADE80]/30">
                  {difficultyLabels[treino.difficulty] || treino.difficulty}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-[#4ADE80]" />
                  <span>{treino.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-[#4ADE80]" />
                  <span>{locationLabels[treino.location] || treino.location}</span>
                </div>
              </div>

              <Button 
                className={`w-full ${
                  treino.completed 
                    ? "bg-gray-300 text-gray-600 hover:bg-gray-400" 
                    : "futpower-button-primary"
                }`}
                disabled={treino.completed}
                onClick={() => !treino.completed && handleCompleteWorkout(treino.id)}
              >
                {treino.completed ? (
                  <>
                    <CheckCircle2 className="mr-2" size={18} />
                    Concluído
                  </>
                ) : (
                  <>
                    <Play className="mr-2" size={18} />
                    Iniciar Treino
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
