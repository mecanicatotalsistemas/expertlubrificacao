import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  Users, 
  Zap, 
  Shield, 
  BookOpen, 
  Brain,
  Calculator,
  Award,
  Clock,
  ArrowRight,
  Star,
  Target
} from 'lucide-react';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(59 * 60); // 59 minutes in seconds
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitPopupClosed, setExitPopupClosed] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<string | null>(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationPosition, setNotificationPosition] = useState<'top-left' | 'top-right'>('top-left');

  // Lista de estudantes com nomes e cidades
  const students = [
    "Renata S. – Salvador/BA",
    "André L. – Curitiba/PR", 
    "Paulo R. – Fortaleza/CE",
    "Abner D. – Manaus/AM",
    "Matheus L. – Goiânia/GO",
    "Rafael T. – Belo Horizonte/MG",
    "Nilson G. – Campinas/SP",
    "Carlos H. – Vitória/ES",
    "Michel B. – Ribeirão Preto/SP",
    "Robson M. – Londrina/PR",
    "Mariana F. – Florianópolis/SC",
    "Marcos R. – Recife/PE",
    "Darley R. – Teresina/PI",
    "Newton J. – Belém/PA",
    "Patrik N. – Maceió/AL",
    "Adrian J. – Uberlândia/MG",
    "Alexandre M. – Porto Alegre/RS",
    "Nayara A. – São Luís/MA",
    "Rafael G. – Aracaju/SE",
    "Augusto P. – Campo Grande/MS",
    "Anderson D. – João Pessoa/PB",
    "Moisés R. – Palmas/TO",
    "Danilson A. – São José dos Campos/SP",
    "Michel C. – Blumenau/SC",
    "Paulo S. – Natal/RN",
    "Danilo B. – Sorocaba/SP",
    "Allan C. – Santos/SP",
    "Marcus V. – Maringá/PR",
    "Clarindo B. – Juiz de Fora/MG",
    "Ricardo V. – Joinville/SC",
    "Mateus A. – Feira de Santana/BA",
    "Alequissandro J. – Cuiabá/MT",
    "Darlles P. – Macapá/AP",
    "Michael E. – Anápolis/GO",
    "Agvan V. – São Bernardo do Campo/SP",
    "Reginaldo J. – Niterói/RJ",
    "Antônio I. – Petrópolis/RJ",
    "Raphael L. – Franca/SP",
    "Maurício P. – Vitória da Conquista/BA",
    "Carlos G. – Bauru/SP",
    "Raimundo A. – Boa Vista/RR",
    "Roberto S. – Itajaí/SC",
    "Raimundo O. – Cascavel/PR",
    "Paulo V. – Caruaru/PE",
    "Maurício J. – Chapecó/SC",
    "Rafael R. – Piracicaba/SP"
  ];

  // Estado para controlar a ordem aleatória das notificações
  const [shuffledStudents, setShuffledStudents] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para embaralhar array
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Inicializar lista embaralhada quando o componente monta
  useEffect(() => {
    setShuffledStudents(shuffleArray(students));
  }, []);

  // Sistema de notificações sutis
  useEffect(() => {
    if (shuffledStudents.length === 0) return;

    const showNotification = () => {
      const student = shuffledStudents[currentIndex];
      
      // Definir posição aleatória
      const positions: ('top-left' | 'top-right')[] = ['top-left', 'top-right'];
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      setNotificationPosition(randomPosition);
      
      setCurrentNotification(`✅ ${student} acabou de se matricular!`);
      setNotificationVisible(true);

      // Esconder notificação após 5 segundos
      setTimeout(() => {
        setNotificationVisible(false);
        setTimeout(() => {
          setCurrentNotification(null);
        }, 300); // Aguarda a animação de fade-out
      }, 5000);

      // Avançar para próximo estudante
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= shuffledStudents.length) {
          // Reiniciar com nova ordem aleatória
          setShuffledStudents(shuffleArray(students));
          return 0;
        }
        return nextIndex;
      });
    };

    // Mostrar primeira notificação após 8 segundos
    const initialTimeout = setTimeout(showNotification, 8000);

    // Depois mostrar a cada 12 segundos
    const interval = setInterval(showNotification, 12000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [shuffledStudents, currentIndex]);

  // Exit Intent Detection
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      // Detecta quando o mouse sai pela parte superior da página
      if (e.clientY <= 0 && !exitPopupClosed && !showExitPopup) {
        // Pequeno delay para evitar triggers acidentais
        timeoutId = setTimeout(() => {
          setShowExitPopup(true);
        }, 100);
      }
    };

    const handleMouseEnter = () => {
      // Cancela o timeout se o mouse voltar rapidamente
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [exitPopupClosed, showExitPopup]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const courseFeatures = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      text: "Curso Completo de Lubrificação Industrial com linguagem prática, exemplos reais e foco na aplicação técnica."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      text: "Acesso Vitalício: estude no seu ritmo, sem pressa."
    },
    {
      icon: <Award className="w-6 h-6" />,
      text: "Certificado Reconhecido com validade em todo o território nacional."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      text: "IA LubrIA: sua assistente inteligente, pronta para tirar dúvidas, gerar planos e te ajudar 24h."
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      text: "Planilha Automática de Cálculo de Quantidade de Graxa."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      text: "Conteúdo sempre atualizado com novas aulas e recursos."
    },
    {
      icon: <Target className="w-6 h-6" />,
      text: "Didática clara, direto ao ponto, voltado para técnicos e engenheiros."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      text: "Suporte técnico direto para dúvidas com especialistas."
    }
  ];

  const targetAudience = [
    "Técnicos de manutenção",
    "Engenheiros mecânicos, de produção ou industriais", 
    "Profissionais que atuam com rolamentos, redutores, motores e bombas",
    "Estudantes e estagiários que querem se destacar",
    "Supervisores e encarregados de PCM e confiabilidade"
  ];

  const testimonials = [
    {
      text: "A IA LubrIA já me ajudou a evitar falhas em equipamentos críticos! O curso é muito prático e aplicável no dia a dia.",
      name: "Carlos Eduardo Silva",
      position: "Técnico de Manutenção Industrial"
    },
    {
      text: "O curso é direto, sem enrolação. Muito melhor que faculdade! Aprendi mais em algumas semanas do que em anos de teoria.",
      name: "Ana Paula Santos",
      position: "Engenheira Mecânica"
    },
    {
      text: "A planilha economizou horas da minha equipe! Agora conseguimos calcular a quantidade de graxa com precisão e rapidez.",
      name: "Roberto Oliveira",
      position: "Supervisor de PCM"
    }
  ];

  const handleCTAClick = () => {
    // Track Facebook Pixel event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout');
    }
    
    // Open the Hotmart checkout page
    window.open('https://pay.hotmart.com/W94555852I?checkoutMode=10&bid=1750519719612', '_blank');
  };

  const handleExitPopupCTA = () => {
    // Copiar cupom para área de transferência
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText('ALUNO10');
        setCouponCopied(true);
        
        // Track Facebook Pixel event for exit popup conversion
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'InitiateCheckout', {
            content_name: 'Exit Popup Coupon',
            value: 117,
            currency: 'BRL'
          });
        }
        
        // Aguardar um momento para mostrar a mensagem
        setTimeout(() => {
          // Close popup and redirect with coupon parameter
          setShowExitPopup(false);
          setExitPopupClosed(true);
          window.open('https://pay.hotmart.com/W94555852I?checkoutMode=10&bid=1750519719612&coupon=ALUNO10', '_blank');
        }, 1000);
        
      } catch (err) {
        // Fallback para navegadores que não suportam clipboard API
        console.log('Clipboard API não suportada, usando fallback');
        
        // Criar elemento temporário para copiar
        const textArea = document.createElement('textarea');
        textArea.value = 'ALUNO10';
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCouponCopied(true);
        } catch (err) {
          console.error('Erro ao copiar cupom:', err);
        }
        
        document.body.removeChild(textArea);
        
        // Track Facebook Pixel event
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'InitiateCheckout', {
            content_name: 'Exit Popup Coupon',
            value: 117,
            currency: 'BRL'
          });
        }
        
        setTimeout(() => {
          setShowExitPopup(false);
          setExitPopupClosed(true);
          window.open('https://pay.hotmart.com/W94555852I?checkoutMode=10&bid=1750519719612&coupon=ALUNO10', '_blank');
        }, 1000);
      }
    };
    
    copyToClipboard();
  };

  const closeExitPopup = () => {
    setShowExitPopup(false);
    setExitPopupClosed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Header with Logo */}
      <header className="relative z-20 p-4">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <img 
              src="/LOGO SEM FUNDO.png" 
              alt="Mecânica Total" 
              className="h-12 w-auto"
            />
            <div className="text-white">
              <h3 className="font-bold text-lg">Mecânica Total</h3>
              <p className="text-sm text-gray-300">CNPJ: 29.705.491/0001-58</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20"></div>
        
        <div className={`relative z-10 max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              Curso + IA + Planilha
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Torne-se um <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Especialista</span> em Lubrificação Industrial
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Curso completo + Inteligência Artificial exclusiva + Planilha automática de cálculo de graxa.<br/>
            <span className="text-blue-300 font-semibold">Tudo o que você precisa para dominar a lubrificação com segurança e precisão.</span>
          </p>

          {/* Course Preview Images */}
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-12">
            <div className="relative group">
              <img 
                src="./CAPA - CURSO.jpg" 
                alt="Capa do Curso Expert Lubrificação" 
                className="w-64 h-auto rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105 border-2 border-blue-500/30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                CURSO COMPLETO
              </div>
            </div>
            <div className="text-white text-3xl font-bold">+</div>
            <div className="relative group">
              <img 
                src="./CAPA PLANILHA.jpg" 
                alt="Capa da Planilha de Cálculo de Graxa" 
                className="w-64 h-auto rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105 border-2 border-green-500/30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                PLANILHA AUTOMÁTICA
              </div>
            </div>
          </div>

          {/* Bonus Image */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img 
                src="./CAPA - IA.jpg" 
                alt="IA LubrIA - Inteligência Artificial para Lubrificação" 
                className="w-64 h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-yellow-500/50"
              />
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                BÔNUS EXCLUSIVO
              </div>
            </div>
          </div>

          <p className="text-gray-400 mt-4 text-sm">
            🔥 Bônus por tempo limitado incluído
          </p>
        </div>
      </section>

      {/* Course Features Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🧠 O que você vai encontrar no <span className="text-blue-400">Expert Lubrificação</span>
            </h2>
            
            {/* Visual representation of the course content */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <img 
                  src="./CAPA - CURSO.jpg" 
                  alt="Curso Expert Lubrificação" 
                  className="w-80 h-auto rounded-2xl shadow-2xl border-2 border-blue-500/50"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Acesso Vitalício
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {courseFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-blue-400">
                      {feature.icon}
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button in Course Features Section */}
          <div className="text-center mt-12">
            <button
              onClick={handleCTAClick}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer animate-pulse"
            >
              Realizar inscrição
            </button>
            <p className="text-gray-400 mt-4 text-sm">
              ⚡ Acesso imediato após a compra
            </p>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              📈 Para quem é esse curso?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {targetAudience.map((audience, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-600 hover:border-green-500/50 transition-all duration-300"
              >
                <Users className="w-8 h-8 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-lg">{audience}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials and Guarantee Section */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🎓 Depoimentos e Garantia
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-slate-900/50 rounded-2xl border border-slate-700 text-center hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 italic text-lg leading-relaxed mb-6">"{testimonial.text}"</p>
                <div className="border-t border-slate-600 pt-4">
                  <p className="text-white font-semibold text-lg">{testimonial.name}</p>
                  <p className="text-blue-400 text-sm font-medium">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-4 p-8 bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-2xl border-2 border-green-500/50">
              <Shield className="w-12 h-12 text-green-400" />
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Garantia de 7 dias</h3>
                <p className="text-gray-300 text-lg">Você testa, e se não gostar, recebe o dinheiro de volta. Simples assim!</p>
              </div>
            </div>
          </div>

          {/* CTA Button in Testimonials Section */}
          <div className="text-center mt-12">
            <button
              onClick={handleCTAClick}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer animate-pulse"
            >
              Realizar inscrição
            </button>
            <p className="text-gray-300 mt-4 text-sm">
              🔥 Junte-se aos nossos alunos de sucesso
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border-2 border-white/20 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              💰 Investimento Especial
            </h2>
            
            <div className="mb-8">
              <p className="text-gray-300 text-lg mb-4">À vista por apenas:</p>
              <div className="text-4xl md:text-5xl font-bold text-white mb-6">
                R$ 117,00
              </div>
            </div>

            <div className="border-t border-white/20 pt-8">
              <p className="text-gray-300 text-lg mb-4">Ou prefere parcelar?</p>
              <div className="text-5xl md:text-6xl font-bold text-green-400 mb-2 animate-pulse">
                12x de R$ 12,82*
              </div>
              <p className="text-blue-200 text-lg">no cartão</p>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-2xl border border-blue-400/30">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-white font-semibold text-lg">Acesso Imediato</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Curso Completo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>IA LubrIA</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Planilha Automática</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-green-900">
        <div className="max-w-4xl mx-auto text-center">
          {/* Show both course and spreadsheet images */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
            <div className="relative">
              <img 
                src="./CAPA - CURSO.jpg" 
                alt="Expert Lubrificação - Curso Completo" 
                className="w-48 h-auto rounded-xl shadow-xl border border-white/20"
              />
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                CURSO
              </div>
            </div>
            <div className="text-white text-2xl font-bold">+</div>
            <div className="relative">
              <img 
                src="./CAPA PLANILHA.jpg" 
                alt="Planilha Automática de Cálculo de Graxa" 
                className="w-48 h-auto rounded-xl shadow-xl border border-white/20"
              />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                PLANILHA
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            👉 Garanta agora seu acesso vitalício ao Expert Lubrificação
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            🔥 Bônus por tempo limitado: atualizações vitalícias + acesso à IA LubrIA
          </p>

          <button
            onClick={handleCTAClick}
            className="relative overflow-hidden bg-white text-blue-900 px-12 py-6 rounded-full text-xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-white/50 group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-green-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute inset-0 bg-blue-500/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
            <span className="relative flex items-center gap-3">
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
              Realizar inscrição - Acesso Imediato
            </span>
          </button>
        </div>
      </section>

      {/* Footer with Company Info */}
      <footer className="py-12 px-4 bg-slate-900 border-t border-slate-700">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="./LOGO SEM FUNDO.png" 
              alt="Mecânica Total" 
              className="h-10 w-auto"
            />
            <div className="text-white">
              <h3 className="font-bold text-lg">Mecânica Total</h3>
              <p className="text-sm text-gray-400">CNPJ: 29.705.491/0001-58</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Mecânica Total. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Expert Lubrificação - Curso de Lubrificação Industrial
          </p>
        </div>
      </footer>

      {/* Sticky Bottom CTA with Countdown */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-green-600 p-4 shadow-2xl z-50 border-t border-blue-400/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-white">
            <p className="font-bold text-lg">Expert Lubrificação</p>
            <p className="text-blue-100 text-sm">Acesso vitalício + IA LubrIA + Planilha</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-red-300" />
              <span className="text-red-300 font-bold text-sm">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <button
            onClick={handleCTAClick}
            className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer animate-pulse"
          >
            <ArrowRight className="w-5 h-5" />
            Realizar inscrição
          </button>
        </div>
      </div>

      {/* Bottom padding to account for sticky CTA */}
      <div className="h-20"></div>

      {/* Sistema de Notificações Sutis */}
      {currentNotification && (
        <div className={`fixed z-40 transition-all duration-300 ${
          notificationPosition === 'top-left' ? 'top-4 left-4' : 'top-4 right-4'
        } ${
          notificationVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <div className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg border border-gray-200 max-w-xs">
            <p className="text-sm font-medium leading-relaxed">
              {currentNotification}
            </p>
          </div>
        </div>
      )}

      {/* Exit Intent Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={closeExitPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Espere! Antes de sair...
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Você ganhou um cupom exclusivo de <span className="font-semibold text-green-600">10% de desconto</span> para garantir sua matrícula agora.
                </p>
              </div>

              {/* Coupon Code */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-dashed border-green-300 rounded-xl p-6 mb-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Seu cupom exclusivo:</p>
                <div className="text-3xl font-bold text-green-600 tracking-wider mb-2">
                  ALUNO10
                </div>
                <p className="text-xs text-gray-500">Copie e cole no checkout</p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleExitPopupCTA}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
              >
                Usar meu cupom agora
              </button>

              {/* Mensagem de cupom copiado */}
              {couponCopied && (
                <div className="text-center mb-4 animate-in fade-in duration-300">
                  <p className="text-green-600 text-sm font-medium">
                    ✅ Cupom copiado! Aplicaremos automaticamente no checkout.
                  </p>
                </div>
              )}

              {/* Footer Text */}
              <p className="text-center text-xs text-gray-500">
                Oferta válida apenas por tempo limitado.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;