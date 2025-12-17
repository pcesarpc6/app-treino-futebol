"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/custom/logo';
import Link from 'next/link';

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se já está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    });

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/onboarding');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen futpower-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen futpower-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <h1 className="text-3xl font-bold text-white mt-6 mb-2">
            Comece sua jornada!
          </h1>
          <p className="text-[#A8D5BA]">
            Crie sua conta e evolua no futebol
          </p>
        </div>

        <div className="futpower-card rounded-2xl p-8 shadow-2xl">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4ADE80',
                    brandAccent: '#22C55E',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#4ADE80',
                    defaultButtonBackgroundHover: '#22C55E',
                    inputBackground: 'white',
                    inputBorder: '#E5E7EB',
                    inputBorderHover: '#4ADE80',
                    inputBorderFocus: '#4ADE80',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '2px',
                  },
                  radii: {
                    borderRadiusButton: '0.75rem',
                    buttonBorderRadius: '0.75rem',
                    inputBorderRadius: '0.75rem',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            localization={{
              variables: {
                sign_up: {
                  email_label: 'E-mail',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: 'Crie uma senha forte',
                  button_label: 'Criar conta',
                  loading_button_label: 'Criando conta...',
                  social_provider_text: 'Cadastrar com {{provider}}',
                  link_text: 'Não tem uma conta? Cadastre-se',
                  confirmation_text: 'Verifique seu e-mail para confirmar o cadastro',
                },
                sign_in: {
                  email_label: 'E-mail',
                  password_label: 'Senha',
                  email_input_placeholder: 'seu@email.com',
                  password_input_placeholder: 'Sua senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
              },
            }}
            providers={[]}
            view="sign_up"
          />

          <div className="mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="text-sm text-[#4ADE80] hover:text-[#22C55E] font-semibold"
            >
              Já tem uma conta? Entre
            </Link>
          </div>
        </div>

        <p className="text-center text-white/70 text-sm mt-6">
          Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade
        </p>
      </div>
    </div>
  );
}
