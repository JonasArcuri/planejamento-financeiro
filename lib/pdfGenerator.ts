// Função utilitária para gerar relatório PDF mensal
// Design: Minimalista, Clean e Profissional
import jsPDF from 'jspdf'
import autoTable, { UserOptions } from 'jspdf-autotable'
import { Transaction, Currency } from '@/types'
import { calculateTotalIncome, calculateTotalExpenses } from './utils'
import { formatCurrency } from './currency'

interface GeneratePDFOptions {
  transactions: Transaction[]
  month: number // 1-12
  year: number
  userName: string
  currency?: Currency // Moeda para formatação
}

/**
 * Gerar relatório PDF mensal de transações financeiras
 * Layout minimalista e profissional
 */
export function generateMonthlyPDF({
  transactions,
  month,
  year,
  userName,
  currency = 'BRL',
}: GeneratePDFOptions): void {
  // Criar instância do PDF (A4)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Nomes dos meses em português
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const monthName = monthNames[month - 1]

  // ============================================
  // CABEÇALHO
  // ============================================
  let currentY = 20

  // Título principal
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 30) // Cinza escuro
  doc.text('Relatório Financeiro', 20, currentY)

  currentY += 8

  // Subtítulo (Mês/Ano)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100) // Cinza médio
  doc.text(`${monthName}/${year}`, 20, currentY)

  currentY += 5

  // Nome do usuário (opcional, discreto)
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150) // Cinza claro
  doc.text(userName, 20, currentY)

  currentY += 8

  // Linha divisória sutil
  doc.setDrawColor(220, 220, 220) // Cinza muito claro
  doc.setLineWidth(0.5)
  doc.line(20, currentY, 190, currentY)

  currentY += 10

  // ============================================
  // RESUMO FINANCEIRO (Cards Simples)
  // ============================================
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpenses = calculateTotalExpenses(transactions)
  const balance = totalIncome - totalExpenses

  // Card 1: Receita Total
  const cardWidth = 50
  const cardHeight = 20
  const cardSpacing = 5
  let cardX = 20

  // Receita
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100) // Cinza médio
  doc.text('Receita Total', cardX, currentY)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(34, 197, 94) // Verde discreto
  doc.text(formatCurrency(totalIncome, currency), cardX, currentY + 6)

  cardX += cardWidth + cardSpacing

  // Despesa
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Despesa Total', cardX, currentY)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(239, 68, 68) // Vermelho discreto
  doc.text(formatCurrency(totalExpenses, currency), cardX, currentY + 6)

  cardX += cardWidth + cardSpacing

  // Saldo Final
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Saldo Final', cardX, currentY)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  if (balance >= 0) {
    doc.setTextColor(34, 197, 94) // Verde
  } else {
    doc.setTextColor(239, 68, 68) // Vermelho
  }
  doc.text(formatCurrency(balance, currency), cardX, currentY + 6)

  currentY += 15

  // Linha divisória sutil antes da tabela
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.5)
  doc.line(20, currentY, 190, currentY)

  currentY += 8

  // ============================================
  // TABELA DE TRANSAÇÕES
  // ============================================
  
  // Se não houver transações, mostrar mensagem
  if (transactions.length === 0) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text('Nenhuma transação registrada neste período.', 20, currentY)
    
    // Rodapé
    addFooter(doc, monthName, year)
    
    const fileName = `relatorio-financeiro-${monthName.toLowerCase()}-${year}.pdf`
    doc.save(fileName)
    return
  }

  // Preparar dados da tabela com cores aplicadas
  const tableData = transactions.map((transaction) => {
    const date = new Date(transaction.date)
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    const type = transaction.type === 'income' ? 'Receita' : 'Despesa'
    
    // Formatar categoria com customCategory se existir
    let category = transaction.category
    if (transaction.category === 'Outros' && transaction.customCategory) {
      category = `Outros - ${transaction.customCategory}`
    }

    const amount = formatCurrency(transaction.amount, currency)

    return [formattedDate, type, category, amount]
  })

  // Configuração da tabela - estilo minimalista
  const tableOptions: UserOptions = {
    startY: currentY,
    head: [['Data', 'Tipo', 'Categoria', 'Valor']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [240, 240, 240], // Cinza muito claro
      textColor: [50, 50, 50], // Cinza escuro
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 30, 30], // Cinza escuro
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250], // Cinza quase branco (zebra muito leve)
    },
    columnStyles: {
      0: { cellWidth: 30, halign: 'left' }, // Data
      1: { cellWidth: 25, halign: 'left' }, // Tipo
      2: { cellWidth: 85, halign: 'left' }, // Categoria
      3: { cellWidth: 40, halign: 'right' }, // Valor (alinhado à direita)
    },
    margin: { top: currentY, left: 20, right: 20 },
    styles: {
      cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
      lineColor: [220, 220, 220], // Linhas em cinza claro
      lineWidth: 0.3,
    },
    // Colorir tipo de transação e valores
    didParseCell: (data: any) => {
      if (data.section === 'body') {
        // Coluna "Tipo" (índice 1)
        if (data.column.index === 1) {
          if (data.cell.text[0] === 'Receita') {
            data.cell.styles.textColor = [34, 197, 94] // Verde discreto
          } else {
            data.cell.styles.textColor = [239, 68, 68] // Vermelho discreto
          }
        }
        // Coluna "Valor" (índice 3)
        if (data.column.index === 3) {
          const row = data.row.raw
          const typeIndex = 1 // Índice da coluna "Tipo"
          if (row[typeIndex] === 'Receita') {
            data.cell.styles.textColor = [34, 197, 94] // Verde discreto
          } else {
            data.cell.styles.textColor = [239, 68, 68] // Vermelho discreto
          }
        }
      }
    },
  }
  
  autoTable(doc, tableOptions)

  // ============================================
  // RODAPÉ
  // ============================================
  addFooter(doc, monthName, year)

  // Salvar PDF
  const fileName = `relatorio-financeiro-${monthName.toLowerCase()}-${year}.pdf`
  doc.save(fileName)
}

/**
 * Adicionar rodapé discreto ao PDF
 */
function addFooter(doc: jsPDF, monthName: string, year: number): void {
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width
  const footerY = pageHeight - 15

  // Linha divisória sutil acima do rodapé
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.5)
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5)

  // Data de geração
  const now = new Date()
  const generatedDate = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  // Texto do rodapé
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 150, 150) // Cinza claro
  doc.text(
    `Gerado em ${generatedDate} pelo Planejamento Financeiro`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  )
}
