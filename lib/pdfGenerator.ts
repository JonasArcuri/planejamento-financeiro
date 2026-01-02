// Função utilitária para gerar relatório PDF mensal
import jsPDF from 'jspdf'
import autoTable, { UserOptions } from 'jspdf-autotable'
import { Transaction } from '@/types'
import { formatCurrency, calculateTotalIncome, calculateTotalExpenses } from './utils'

interface GeneratePDFOptions {
  transactions: Transaction[]
  month: number // 1-12
  year: number
  userName: string
}

/**
 * Gerar relatório PDF mensal de transações financeiras
 */
export function generateMonthlyPDF({
  transactions,
  month,
  year,
  userName,
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

  // Título
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Relatório Financeiro', 105, 20, { align: 'center' })

  // Subtítulo com mês/ano
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(`${monthName}/${year}`, 105, 28, { align: 'center' })

  // Nome do usuário
  doc.setFontSize(12)
  doc.text(`Usuário: ${userName}`, 20, 38)

  // Data de geração
  const now = new Date()
  const generatedDate = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text(`Gerado em: ${generatedDate}`, 20, 45)

  // Preparar dados da tabela
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

    const amount = formatCurrency(transaction.amount)

    return [formattedDate, type, category, amount]
  })

  // Se não houver transações, mostrar mensagem
  if (tableData.length === 0) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Nenhuma transação registrada neste período.', 20, 60)
    
    // Salvar PDF
    const fileName = `relatorio-financeiro-${monthName.toLowerCase()}-${year}.pdf`
    doc.save(fileName)
    return
  }

  // Criar tabela
  const tableOptions: UserOptions = {
    startY: 55,
    head: [['Data', 'Tipo', 'Categoria', 'Valor']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246], // Azul
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 11,
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      0: { cellWidth: 30 }, // Data
      1: { cellWidth: 30 }, // Tipo
      2: { cellWidth: 80 }, // Categoria
      3: { cellWidth: 50, halign: 'right' }, // Valor (alinhado à direita)
    },
    margin: { top: 55, left: 20, right: 20 },
  }
  
  autoTable(doc, tableOptions)

  // Calcular totais
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpenses = calculateTotalExpenses(transactions)
  const balance = totalIncome - totalExpenses

  // Posição Y após a tabela
  const finalY = (doc as any).lastAutoTable?.finalY || 100

  // Adicionar totais
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  
  // Total de Receitas
  doc.setFillColor(34, 197, 94) // Verde
  doc.rect(20, finalY + 10, 80, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text('Total de Receitas:', 25, finalY + 15)
  doc.text(formatCurrency(totalIncome), 100, finalY + 15, { align: 'right' })

  // Total de Despesas
  doc.setFillColor(239, 68, 68) // Vermelho
  doc.rect(20, finalY + 20, 80, 8, 'F')
  doc.text('Total de Despesas:', 25, finalY + 25)
  doc.text(formatCurrency(totalExpenses), 100, finalY + 25, { align: 'right' })

  // Saldo Final
  if (balance >= 0) {
    doc.setFillColor(34, 197, 94) // Verde
  } else {
    doc.setFillColor(239, 68, 68) // Vermelho
  }
  doc.rect(20, finalY + 30, 80, 8, 'F')
  doc.text('Saldo Final:', 25, finalY + 35)
  doc.text(formatCurrency(balance), 100, finalY + 35, { align: 'right' })

  // Resetar cor do texto
  doc.setTextColor(0, 0, 0)

  // Salvar PDF
  const fileName = `relatorio-financeiro-${monthName.toLowerCase()}-${year}.pdf`
  doc.save(fileName)
}

