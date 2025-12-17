import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // Criar cliente Supabase para o middleware
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Pegar o token de autenticação dos cookies
  const token = request.cookies.get('sb-access-token')?.value;

  // Verificar se o usuário está autenticado
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Se não está autenticado e tenta acessar páginas protegidas
  if (!session && (isDashboardPage || isOnboardingPage)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Se está autenticado e tenta acessar páginas de auth
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/auth/:path*'],
};
