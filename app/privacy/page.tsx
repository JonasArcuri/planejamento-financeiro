'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Voltar
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Política de Privacidade
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 prose prose-lg dark:prose-invert max-w-none">
          <div className="space-y-8">
            {/* Introdução */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Introdução
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos 
                suas informações pessoais quando você utiliza nossa aplicação de Planejamento Financeiro Pessoal. 
                Estamos comprometidos em proteger sua privacidade e garantir a segurança dos seus dados, 
                em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política. 
                Recomendamos que leia este documento com atenção para entender como tratamos suas informações.
              </p>
            </section>

            {/* Dados que coletamos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. Dados que Coletamos
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Coletamos apenas os dados necessários para fornecer e melhorar nossos serviços. 
                Os dados são coletados diretamente de você, quando você os fornece voluntariamente:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                2.1. Dados de Cadastro e Autenticação
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Nome:</strong> utilizado para personalizar sua experiência na aplicação</li>
                <li><strong>E-mail:</strong> utilizado para autenticação, comunicação e recuperação de conta</li>
                <li><strong>ID do usuário:</strong> identificador único gerado automaticamente pelo sistema</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                2.2. Dados Financeiros
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Você insere manualmente os seguintes dados financeiros:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Receitas (tipo, categoria, valor, data)</li>
                <li>Despesas (tipo, categoria, valor, data)</li>
                <li>Metas financeiras (título, valor alvo, prazo, descrição)</li>
                <li>Progresso das metas (valores adicionados)</li>
                <li>Preferências de categorias personalizadas</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                2.3. Dados Técnicos
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Endereço IP (coletado automaticamente para segurança)</li>
                <li>Informações do dispositivo e navegador (para otimização técnica)</li>
                <li>Logs de acesso e uso da aplicação (para segurança e diagnóstico)</li>
                <li>Preferências de interface (tema claro/escuro, idioma)</li>
              </ul>
            </section>

            {/* Dados que NÃO coletamos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. Dados que NÃO Coletamos
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                É importante deixar claro que <strong>NÃO coletamos</strong> os seguintes dados:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Dados bancários:</strong> não acessamos, coletamos ou armazenamos informações de contas bancárias</li>
                <li><strong>Cartão de crédito:</strong> não coletamos dados de cartão de crédito (pagamentos são processados por terceiros seguros via Stripe)</li>
                <li><strong>CPF ou documentos pessoais:</strong> não solicitamos ou armazenamos documentos de identificação</li>
                <li><strong>Dados biométricos:</strong> não coletamos impressões digitais, reconhecimento facial ou outros dados biométricos</li>
                <li><strong>Localização geográfica precisa:</strong> não rastreamos sua localização em tempo real</li>
                <li><strong>Dados de terceiros:</strong> não coletamos dados de suas redes sociais ou outras plataformas</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>Importante:</strong> Todas as informações financeiras são inseridas manualmente por você. 
                Não há integração com instituições financeiras ou bancos.
              </p>
            </section>

            {/* Como utilizamos os dados */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Como Utilizamos os Dados
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Utilizamos seus dados exclusivamente para as seguintes finalidades:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                4.1. Prestação de Serviços
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Autenticação e gerenciamento de sua conta</li>
                <li>Armazenamento e processamento de suas transações financeiras</li>
                <li>Geração de relatórios e análises financeiras personalizadas</li>
                <li>Funcionalidades de metas financeiras e acompanhamento de progresso</li>
                <li>Personalização da interface (tema, idioma, preferências)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                4.2. Segurança e Melhoria
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Detecção e prevenção de fraudes e atividades suspeitas</li>
                <li>Análise de uso da aplicação para melhorias técnicas</li>
                <li>Correção de erros e otimização de performance</li>
                <li>Manutenção da segurança dos sistemas</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                4.3. Comunicação
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Envio de notificações importantes sobre sua conta</li>
                <li>Comunicação sobre atualizações de serviços (quando relevante)</li>
                <li>Suporte técnico e resposta a solicitações</li>
              </ul>
            </section>

            {/* Compartilhamento de dados */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Compartilhamento de Dados
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.</strong>
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                5.1. Provedores de Serviços Essenciais
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Compartilhamos dados apenas com provedores de serviços essenciais que nos ajudam a operar a aplicação:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Google Firebase:</strong> para autenticação, armazenamento de dados e hospedagem (conforme Política de Privacidade do Google)</li>
                <li><strong>Stripe:</strong> para processamento de pagamentos (quando você assina o plano Premium - dados de cartão não são armazenados por nós)</li>
                <li><strong>Vercel:</strong> para hospedagem e infraestrutura da aplicação</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Esses provedores são obrigados a manter a confidencialidade e segurança dos dados, 
                conforme seus próprios termos de privacidade e políticas de segurança.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                5.2. Requisitos Legais
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Podemos divulgar seus dados apenas se exigido por lei, ordem judicial ou autoridade competente, 
                ou para proteger nossos direitos legais e a segurança dos usuários.
              </p>
            </section>

            {/* Armazenamento e segurança */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Armazenamento e Segurança
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Implementamos medidas técnicas e organizacionais para proteger seus dados:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                6.1. Medidas de Segurança
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Criptografia:</strong> dados são criptografados em trânsito (HTTPS) e em repouso</li>
                <li><strong>Autenticação segura:</strong> utilizamos Firebase Authentication com senhas criptografadas</li>
                <li><strong>Controle de acesso:</strong> cada usuário acessa apenas seus próprios dados (regras de segurança do Firestore)</li>
                <li><strong>Backup seguro:</strong> dados são armazenados com redundância e backups regulares</li>
                <li><strong>Monitoramento:</strong> sistemas são monitorados continuamente para detectar atividades suspeitas</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                6.2. Localização dos Dados
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Seus dados são armazenados em servidores seguros do Google Firebase, localizados em datacenters 
                que atendem aos mais altos padrões de segurança e conformidade. 
                Os dados permanecem no Brasil ou em países com legislação de proteção de dados equivalente.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                6.3. Retenção de Dados
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Mantemos seus dados enquanto sua conta estiver ativa e você utilizar nossos serviços. 
                Após a exclusão da conta, os dados são removidos permanentemente em até 30 dias, 
                exceto quando a retenção for exigida por lei.
              </p>
            </section>

            {/* Direitos do usuário */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Seus Direitos (LGPD)
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Conforme a Lei Geral de Proteção de Dados (LGPD), você possui os seguintes direitos:
              </p>
              
              <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Confirmação e acesso:</strong> você pode solicitar confirmação sobre o tratamento 
                  de seus dados e obter uma cópia dos dados que mantemos sobre você
                </li>
                <li>
                  <strong>Correção:</strong> você pode solicitar a correção de dados incompletos, inexatos ou desatualizados
                </li>
                <li>
                  <strong>Anonimização, bloqueio ou eliminação:</strong> você pode solicitar a anonimização, 
                  bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD
                </li>
                <li>
                  <strong>Portabilidade:</strong> você pode solicitar a portabilidade dos dados para outro fornecedor de serviço
                </li>
                <li>
                  <strong>Eliminação:</strong> você pode solicitar a eliminação dos dados pessoais tratados com seu consentimento
                </li>
                <li>
                  <strong>Revogação de consentimento:</strong> você pode revogar seu consentimento a qualquer momento
                </li>
                <li>
                  <strong>Informação sobre compartilhamento:</strong> você pode obter informações sobre entidades públicas 
                  e privadas com as quais compartilhamos dados
                </li>
                <li>
                  <strong>Oposição:</strong> você pode se opor ao tratamento de dados quando houver descumprimento da LGPD
                </li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Para exercer seus direitos, entre em contato conosco através do e-mail: 
                <strong className="text-primary-600 dark:text-primary-400"> contato@seudominio.com</strong>
              </p>
            </section>

            {/* Exclusão de conta */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Exclusão de Conta e Dados
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Você pode solicitar a exclusão de sua conta e todos os dados associados a qualquer momento:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                8.1. Como Solicitar Exclusão
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Entre em contato através do e-mail: <strong>contato@seudominio.com</strong></li>
                <li>Ou utilize a funcionalidade de exclusão de conta disponível nas configurações da aplicação (quando disponível)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                8.2. O que é Excluído
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Após a confirmação da exclusão, serão removidos permanentemente:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Dados de cadastro (nome, e-mail)</li>
                <li>Todas as transações financeiras (receitas e despesas)</li>
                <li>Metas financeiras e progresso</li>
                <li>Preferências e configurações</li>
                <li>Histórico de uso da aplicação</li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                <strong>Importante:</strong> A exclusão é permanente e irreversível. 
                Certifique-se de exportar ou fazer backup de qualquer informação importante antes de solicitar a exclusão.
              </p>
            </section>

            {/* Cookies e armazenamento local */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Cookies e Armazenamento Local
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Utilizamos tecnologias de armazenamento local para melhorar sua experiência:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                9.1. Cookies e Tecnologias Similares
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Cookies de autenticação:</strong> necessários para manter sua sessão ativa e segura</li>
                <li><strong>LocalStorage:</strong> armazena suas preferências (tema claro/escuro, idioma selecionado)</li>
                <li><strong>SessionStorage:</strong> armazena dados temporários da sessão atual</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                9.2. Cookies de Terceiros
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Utilizamos serviços de terceiros (Google Firebase, Stripe) que podem utilizar cookies próprios. 
                Consulte as políticas de privacidade desses serviços para mais informações.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                9.3. Gerenciamento de Cookies
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Você pode gerenciar ou desabilitar cookies através das configurações do seu navegador. 
                No entanto, isso pode afetar o funcionamento de algumas funcionalidades da aplicação.
              </p>
            </section>

            {/* Alterações na política */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. Alterações nesta Política
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas 
                ou por motivos legais, operacionais ou regulatórios.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Quando houver alterações significativas, notificaremos você através de:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>E-mail enviado ao endereço cadastrado</li>
                <li>Notificação na aplicação</li>
                <li>Atualização da data de &quot;Última atualização&quot; no topo desta página</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Recomendamos que revise esta política periodicamente para se manter informado sobre como protegemos seus dados.
              </p>
            </section>

            {/* Contato */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                11. Contato
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade 
                ou ao tratamento de seus dados pessoais, entre em contato conosco:
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mt-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>E-mail:</strong>{' '}
                  <a 
                    href="mailto:contato@seudominio.com" 
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    contato@seudominio.com
                  </a>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  Responderemos sua solicitação o mais breve possível, dentro dos prazos estabelecidos pela LGPD.
                </p>
              </div>
            </section>

            {/* Encerramento */}
            <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Esta Política de Privacidade é regida pela legislação brasileira, especialmente pela 
                Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

