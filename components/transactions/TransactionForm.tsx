'use client'

// Formulário de transação (criar/editar)
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema, type TransactionFormData } from '@/lib/validations'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types'
import { Transaction } from '@/types'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import CurrencyInput from '@/components/ui/CurrencyInput'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

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
  const { t } = useLanguage()
  const isEditing = !!transaction

  const {
    register,
    handleSubmit,
    control,
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
          amount: undefined,
          date: new Date().toISOString().split('T')[0],
        },
  })

  // Observar mudanças na categoria para exibir/ocultar campo customCategory
  const selectedCategory = watch('category')
  const selectedType = watch('type') || transaction?.type || 'expense'
  const showCustomCategory = selectedCategory === 'Outros' || selectedCategory === 'Assinaturas'

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

  // Resetar categoria quando o tipo mudar (para evitar categoria inválida)
  useEffect(() => {
    const currentType = watch('type')
    const currentCategory = watch('category')
    
    if (currentType && currentCategory) {
      const validCategories = currentType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
      if (!validCategories.includes(currentCategory as any)) {
        setValue('category', '', { shouldValidate: false })
        setValue('customCategory', '', { shouldValidate: false })
      }
    }
  }, [selectedType, watch, setValue])

  // Limpar customCategory quando categoria mudar de "Outros" ou "Assinaturas" para outra
  useEffect(() => {
    if (selectedCategory !== 'Outros' && selectedCategory !== 'Assinaturas') {
      setValue('customCategory', '', { shouldValidate: false })
    }
  }, [selectedCategory, setValue])

  const handleFormSubmit = async (data: TransactionFormData) => {
    await onSubmit(data)
    if (!isEditing) {
      reset({
        type: 'expense',
        category: '',
        customCategory: '',
        amount: undefined,
        date: new Date().toISOString().split('T')[0],
      })
    }
  }

  const typeOptions = [
    { value: 'income', label: t('transactions.income') },
    { value: 'expense', label: t('transactions.expense') },
  ]

  // Mostrar apenas categorias relevantes baseado no tipo
  const categoryOptions = (selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => ({
    value: cat,
    label: cat,
  }))

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-5">
      <Select
        label={t('transactions.type')}
        {...register('type')}
        options={typeOptions}
        error={errors.type?.message}
      />

      <Select
        label={t('transactions.category')}
        {...register('category')}
        options={categoryOptions}
        error={errors.category?.message}
      />

      {/* Campo customizado que aparece quando categoria é "Outros" ou "Assinaturas" */}
      {showCustomCategory && (
        <div className="transition-opacity duration-200 ease-in-out">
          <Input
            label={
              selectedType === 'income' 
                ? t('transactions.customCategoryIncome') || 'Especifique a receita'
                : selectedCategory === 'Assinaturas'
                  ? 'Especifique a assinatura'
                  : t('transactions.customCategory')
            }
            type="text"
            placeholder={
              selectedType === 'income'
                ? t('transactions.customCategoryIncomePlaceholder') || 'Ex: Venda de produto, Consultoria, etc.'
                : selectedCategory === 'Assinaturas'
                  ? 'Ex: Netflix, Spotify, Amazon Prime, etc.'
                  : t('transactions.customCategoryPlaceholder')
            }
            {...register('customCategory')}
            error={errors.customCategory?.message}
          />
        </div>
      )}

      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <CurrencyInput
            label={t('transactions.amount')}
            value={field.value}
            onChange={(value) => field.onChange(value)}
            error={errors.amount?.message}
          />
        )}
      />

      <Input
        label={t('transactions.date')}
        type="date"
        {...register('date')}
        error={errors.date?.message}
      />

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          isLoading={isLoading}
        >
          {isEditing ? t('common.save') : t('transactions.newTransaction')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  )
}

