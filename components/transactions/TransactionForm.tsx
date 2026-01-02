'use client'

// Formulário de transação (criar/editar)
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema, type TransactionFormData } from '@/lib/validations'
import { DEFAULT_CATEGORIES } from '@/types'
import { Transaction } from '@/types'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface TransactionFormProps {
  transaction?: Transaction
  onSubmit: (data: TransactionFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function TransactionForm({
  transaction,
  onSubmit,
  onCancel,
  isLoading = false,
}: TransactionFormProps) {
  const isEditing = !!transaction

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          category: transaction.category,
          customCategory: transaction.customCategory || '',
          amount: transaction.amount,
          date: transaction.date.split('T')[0], // Formato YYYY-MM-DD
        }
      : {
          type: 'expense',
          category: '',
          customCategory: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
        },
  })

  // Observar mudanças na categoria para exibir/ocultar campo customCategory
  const selectedCategory = watch('category')
  const showCustomCategory = selectedCategory === 'Outros'

  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        category: transaction.category,
        customCategory: transaction.customCategory || '',
        amount: transaction.amount,
        date: transaction.date.split('T')[0],
      })
    }
  }, [transaction, reset])

  // Limpar customCategory quando categoria mudar de "Outros" para outra
  useEffect(() => {
    if (selectedCategory !== 'Outros') {
      setValue('customCategory', '', { shouldValidate: false })
    }
  }, [selectedCategory, setValue])

  const handleFormSubmit = async (data: TransactionFormData) => {
    await onSubmit(data)
    if (!isEditing) {
      reset()
    }
  }

  const typeOptions = [
    { value: 'income', label: 'Receita' },
    { value: 'expense', label: 'Despesa' },
  ]

  const categoryOptions = DEFAULT_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }))

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Select
        label="Tipo"
        {...register('type')}
        options={typeOptions}
        error={errors.type?.message}
      />

      <Select
        label="Categoria"
        {...register('category')}
        options={categoryOptions}
        error={errors.category?.message}
      />

      {/* Campo customizado que aparece apenas quando categoria é "Outros" */}
      {showCustomCategory && (
        <div className="transition-opacity duration-200 ease-in-out">
          <Input
            label="Especifique o gasto/receita"
            type="text"
            placeholder="Ex: Manutenção do carro, Presente, etc."
            {...register('customCategory')}
            error={errors.customCategory?.message}
          />
        </div>
      )}

      <Input
        label="Valor"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        {...register('amount', { valueAsNumber: true })}
        error={errors.amount?.message}
      />

      <Input
        label="Data"
        type="date"
        {...register('date')}
        error={errors.date?.message}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          isLoading={isLoading}
        >
          {isEditing ? 'Salvar Alterações' : 'Criar Transação'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

