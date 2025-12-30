'use client'

// Formulário de meta financeira
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Goal, GoalFormData } from '@/types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const goalSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  targetAmount: z
    .number()
    .min(0.01, 'Valor deve ser maior que zero')
    .positive('Valor deve ser positivo'),
  deadline: z.string().min(1, 'Data é obrigatória'),
  description: z.string().optional(),
})

interface GoalFormProps {
  goal?: Goal
  onSubmit: (data: GoalFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function GoalForm({
  goal,
  onSubmit,
  onCancel,
  isLoading = false,
}: GoalFormProps) {
  const isEditing = !!goal

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: goal
      ? {
          title: goal.title,
          targetAmount: goal.targetAmount,
          deadline: goal.deadline.split('T')[0],
          description: goal.description || '',
        }
      : {
          title: '',
          targetAmount: 0,
          deadline: '',
          description: '',
        },
  })

  useEffect(() => {
    if (goal) {
      reset({
        title: goal.title,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline.split('T')[0],
        description: goal.description || '',
      })
    }
  }, [goal, reset])

  const handleFormSubmit = async (data: GoalFormData) => {
    await onSubmit(data)
    if (!isEditing) {
      reset()
    }
  }

  // Data mínima: hoje
  const minDate = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Título da Meta"
        type="text"
        placeholder="Ex: Reserva de emergência"
        {...register('title')}
        error={errors.title?.message}
      />

      <Input
        label="Valor Alvo"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        {...register('targetAmount', { valueAsNumber: true })}
        error={errors.targetAmount?.message}
      />

      <Input
        label="Prazo"
        type="date"
        min={minDate}
        {...register('deadline')}
        error={errors.deadline?.message}
      />

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição (opcional)
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
          rows={3}
          placeholder="Descreva sua meta..."
          {...register('description')}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          isLoading={isLoading}
        >
          {isEditing ? 'Salvar Alterações' : 'Criar Meta'}
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

