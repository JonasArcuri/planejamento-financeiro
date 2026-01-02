'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function TermsPage() {
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
            Termos de Uso
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
            {/* Aceitação dos Termos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Ao acessar e utilizar nossa aplicação de Planejamento Financeiro Pessoal, você concorda em cumprir 
                e estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, 
                não deve utilizar nossos serviços.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Estes termos constituem um acordo legal entre você e nossa plataforma. 
                Ao criar uma conta ou utilizar nossos serviços, você confirma que leu, compreendeu e aceita 
                todos os termos e condições aqui descritos.
              </p>
            </section>

            {/* Descrição do Serviço */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. Descrição do Serviço
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Nossa aplicação é uma ferramenta de organização e planejamento financeiro pessoal que permite:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Registrar receitas e despesas manualmente</li>
                <li>Organizar transações por categorias</li>
                <li>Definir e acompanhar metas financeiras</li>
                <li>Gerar relatórios e análises financeiras</li>
                <li>Visualizar gráficos e estatísticas sobre suas finanças</li>
                <li>Exportar relatórios em formato PDF</li>
              </ul>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mt-6">
                <p className="text-gray-800 dark:text-gray-200 font-semibold mb-2">
                  ⚠️ Importante: Limitações do Serviço
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Nossa aplicação é uma <strong>ferramenta de organização</strong> e não oferece consultoria financeira</li>
                  <li>Não substitui o aconselhamento de um contador, planejador financeiro ou outro profissional qualificado</li>
                  <li>Não fornecemos recomendações de investimentos, análises de mercado ou orientações sobre produtos financeiros</li>
                  <li>Não realizamos integração com contas bancárias ou instituições financeiras</li>
                  <li>Não processamos ou armazenamos dados de cartão de crédito (pagamentos são processados por terceiros seguros)</li>
                </ul>
              </div>
            </section>

            {/* Cadastro e Conta do Usuário */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. Cadastro e Conta do Usuário
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                3.1. Requisitos para Cadastro
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Para utilizar nossos serviços, você precisa:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Ter pelo menos 18 anos de idade ou ter autorização de um responsável legal</li>
                <li>Fornecer informações precisas, completas e atualizadas durante o cadastro</li>
                <li>Manter a segurança de suas credenciais de acesso (e-mail e senha)</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                3.2. Conta Pessoal e Intransferível
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Sua conta é pessoal e intransferível. Você é responsável por:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Todas as atividades que ocorrem sob sua conta</li>
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Garantir que ninguém mais tenha acesso à sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer violação de segurança</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                3.3. Veracidade das Informações
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Você declara e garante que todas as informações fornecidas durante o cadastro e durante o uso 
                da aplicação são verdadeiras, precisas e atualizadas. Fornecer informações falsas ou enganosas 
                pode resultar na suspensão ou exclusão de sua conta.
              </p>
            </section>

            {/* Uso Adequado do Serviço */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Uso Adequado do Serviço
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Você concorda em utilizar nossos serviços apenas para fins legais e de acordo com estes Termos de Uso. 
                É proibido:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Utilizar a aplicação para qualquer finalidade ilegal ou não autorizada</li>
                <li>Tentar acessar contas de outros usuários ou áreas restritas do sistema</li>
                <li>Interferir ou interromper o funcionamento da aplicação ou dos servidores</li>
                <li>Realizar engenharia reversa, descompilar ou desmontar qualquer parte da aplicação</li>
                <li>Utilizar bots, scripts automatizados ou outros meios para acessar a aplicação de forma não autorizada</li>
                <li>Reproduzir, duplicar, copiar, vender ou explorar comercialmente qualquer parte da aplicação sem autorização</li>
                <li>Transmitir vírus, malware ou qualquer código malicioso</li>
                <li>Violar direitos de propriedade intelectual ou outros direitos de terceiros</li>
                <li>Utilizar a aplicação de forma que possa danificar, desabilitar ou sobrecarregar nossos sistemas</li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                A violação de qualquer uma dessas proibições pode resultar na suspensão imediata ou exclusão 
                permanente de sua conta, sem direito a reembolso.
              </p>
            </section>

            {/* Responsabilidades do Usuário */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Responsabilidades do Usuário
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                5.1. Dados Financeiros
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Você é o único responsável por:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Inserir dados financeiros precisos e atualizados</li>
                <li>Verificar a exatidão das informações registradas</li>
                <li>Manter backups de suas informações importantes (quando necessário)</li>
                <li>Tomar decisões financeiras baseadas em suas próprias análises e, quando apropriado, 
                    consultar profissionais qualificados</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                5.2. Segurança da Conta
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Você é responsável por:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Utilizar senhas fortes e únicas</li>
                <li>Não compartilhar suas credenciais com terceiros</li>
                <li>Fazer logout ao utilizar a aplicação em dispositivos compartilhados</li>
                <li>Notificar-nos imediatamente sobre qualquer suspeita de acesso não autorizado</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                5.3. Uso Legal
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Você concorda em utilizar a aplicação em conformidade com todas as leis e regulamentos aplicáveis, 
                incluindo, mas não limitado a, leis de proteção de dados, leis fiscais e regulamentações financeiras.
              </p>
            </section>

            {/* Limitações de Responsabilidade */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Limitações de Responsabilidade
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                6.1. Serviço Fornecido &quot;Como Está&quot;
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                A aplicação é fornecida &quot;como está&quot; e &quot;conforme disponível&quot;, sem garantias de qualquer tipo, 
                expressas ou implícitas. Não garantimos que:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>A aplicação atenderá a todos os seus requisitos</li>
                <li>A aplicação será ininterrupta, segura ou livre de erros</li>
                <li>Os resultados obtidos através da aplicação serão precisos ou confiáveis</li>
                <li>Os defeitos serão corrigidos</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                6.2. Decisões Financeiras
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>Não nos responsabilizamos por:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Decisões financeiras tomadas com base nas informações da aplicação</li>
                <li>Perdas financeiras resultantes do uso ou incapacidade de usar a aplicação</li>
                <li>Erros ou omissões nos dados inseridos pelo usuário</li>
                <li>Interpretações incorretas de relatórios ou análises geradas pela aplicação</li>
                <li>Consequências de decisões de investimento, gastos ou outras decisões financeiras</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                6.3. Limitação de Danos
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Em nenhuma circunstância seremos responsáveis por danos diretos, indiretos, incidentais, 
                especiais, consequenciais ou punitivos, incluindo, mas não limitado a, perda de lucros, 
                perda de dados, perda de oportunidades de negócios ou outras perdas intangíveis, 
                resultantes do uso ou incapacidade de usar a aplicação.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                6.4. Terceiros
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Não nos responsabilizamos por serviços, produtos ou conteúdo de terceiros, incluindo 
                provedores de pagamento (como Stripe), serviços de autenticação (como Firebase) ou 
                outros serviços integrados à nossa aplicação.
              </p>
            </section>

            {/* Disponibilidade do Serviço */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Disponibilidade do Serviço
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Embora nos esforcemos para manter a aplicação disponível e funcionando corretamente, 
                não garantimos disponibilidade contínua ou ininterrupta. O serviço pode estar indisponível devido a:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Manutenção programada ou de emergência</li>
                <li>Falhas técnicas ou problemas de infraestrutura</li>
                <li>Atos de terceiros ou eventos fora de nosso controle</li>
                <li>Atualizações de software ou melhorias</li>
                <li>Problemas de conectividade de internet</li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Não seremos responsáveis por qualquer perda ou dano resultante da indisponibilidade 
                temporária ou permanente do serviço.
              </p>
            </section>

            {/* Cancelamento e Exclusão de Conta */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Cancelamento e Exclusão de Conta
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                8.1. Exclusão pela Iniciativa do Usuário
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Você pode solicitar a exclusão de sua conta a qualquer momento através de:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>E-mail para: <strong>contato@seudominio.com</strong></li>
                <li>Funcionalidade de exclusão disponível nas configurações da aplicação (quando disponível)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Após a exclusão, todos os dados associados à sua conta serão removidos permanentemente, 
                incluindo transações financeiras, metas e configurações. Esta ação é irreversível.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                8.2. Cancelamento de Assinatura Premium
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Se você possui uma assinatura Premium:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Você pode cancelar sua assinatura a qualquer momento</li>
                <li>O cancelamento entrará em vigor no final do período de cobrança atual</li>
                <li>Você continuará tendo acesso aos recursos Premium até o final do período pago</li>
                <li>Não há reembolso para períodos já pagos</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                8.3. Exclusão pela Nossa Iniciativa
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Reservamo-nos o direito de suspender ou excluir contas que violem estes Termos de Uso, 
                utilizem o serviço de forma inadequada ou que representem risco para outros usuários ou para a aplicação. 
                Em tais casos, não haverá reembolso de valores pagos.
              </p>
            </section>

            {/* Propriedade Intelectual */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Propriedade Intelectual
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Todos os direitos de propriedade intelectual relacionados à aplicação, incluindo, mas não limitado a:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Código-fonte, software e algoritmos</li>
                <li>Design, layout, interface e elementos visuais</li>
                <li>Marca, logotipo e identidade visual</li>
                <li>Documentação, textos e conteúdo</li>
                <li>Funcionalidades e recursos exclusivos</li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4 mb-4">
                São de nossa propriedade exclusiva ou de nossos licenciadores e estão protegidos por leis de 
                propriedade intelectual, incluindo direitos autorais, marcas registradas e outras leis aplicáveis.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                9.1. Licença de Uso
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Concedemos a você uma licença limitada, não exclusiva, não transferível e revogável para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Acessar e utilizar a aplicação para fins pessoais e não comerciais</li>
                <li>Armazenar e gerenciar seus próprios dados financeiros</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                9.2. Restrições
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Você <strong>não pode</strong>:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Copiar, modificar, distribuir, vender ou alugar qualquer parte da aplicação</li>
                <li>Realizar engenharia reversa ou tentar extrair o código-fonte</li>
                <li>Remover ou alterar avisos de direitos autorais ou marcas registradas</li>
                <li>Utilizar a aplicação para criar produtos ou serviços concorrentes</li>
                <li>Sublicenciar, revender ou transferir seus direitos de uso</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                9.3. Dados do Usuário
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Você mantém todos os direitos sobre os dados financeiros e informações pessoais que insere na aplicação. 
                Conforme descrito em nossa Política de Privacidade, utilizamos seus dados apenas para fornecer e melhorar 
                nossos serviços, sempre respeitando sua privacidade e os direitos previstos na LGPD.
              </p>
            </section>

            {/* Alterações nos Termos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. Alterações nos Termos
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento, 
                a nosso exclusivo critério. Quando houver alterações significativas, notificaremos você através de:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>E-mail enviado ao endereço cadastrado</li>
                <li>Notificação na aplicação</li>
                <li>Atualização da data de &quot;Última atualização&quot; no topo desta página</li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4 mb-4">
                O uso continuado da aplicação após a publicação das alterações constitui sua aceitação 
                dos novos termos. Se você não concordar com as alterações, deve interromper o uso da aplicação 
                e solicitar a exclusão de sua conta.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Recomendamos que revise estes termos periodicamente para se manter informado sobre 
                suas responsabilidades e direitos como usuário.
              </p>
            </section>

            {/* Contato */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                11. Contato
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Se você tiver dúvidas, preocupações ou solicitações relacionadas a estes Termos de Uso, 
                entre em contato conosco:
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
                  Responderemos sua solicitação o mais breve possível.
                </p>
              </div>
            </section>

            {/* Disposições Gerais */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                12. Disposições Gerais
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                12.1. Lei Aplicável
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
                Qualquer disputa relacionada a estes termos será resolvida nos tribunais competentes do Brasil.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                12.2. Divisibilidade
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Se qualquer disposição destes termos for considerada inválida ou inexequível, 
                as demais disposições permanecerão em pleno vigor e efeito.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                12.3. Renúncia
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                A falha em exercer qualquer direito ou disposição destes termos não constitui 
                uma renúncia a tal direito ou disposição.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                12.4. Acordo Integral
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Estes Termos de Uso, juntamente com nossa Política de Privacidade, constituem 
                o acordo integral entre você e nossa plataforma em relação ao uso da aplicação.
              </p>
            </section>

            {/* Encerramento */}
            <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Ao utilizar nossa aplicação, você confirma que leu, compreendeu e concorda com estes Termos de Uso. 
                Se tiver dúvidas, entre em contato conosco antes de utilizar os serviços.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

