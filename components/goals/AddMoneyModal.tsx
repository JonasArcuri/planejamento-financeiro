'use client'

// Modal para adicionar dinheiro à meta
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Goal } from '@/types'
import { formatCurrency } from '@/lib/utils'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

const addMoneySchema = z.object({
  amount: z
    .number()
    .min(0.01, 'Valor deve ser maior que zero')
    .positive('Valor deve ser positivo'),
  fromBalance: z.boolean(),
})

interface AddMoneyModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (amount: number, fromBalance: boolean) => Promise<void>
  goal: Goal | null
  isLoading?: boolean
}

export default function AddMoneyModal({
  isOpen,
  onClose,
  onConfirm,
  goal,
  isLoading = false,
}: AddMoneyModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<{ amount: number; fromBalance: boolean }>({
    resolver: zodResolver(addMoneySchema),
    defaultValues: {
      amount: 0,
      fromBalance: false,
    },
  })

  const fromBalance = watch('fromBalance')

  const handleFormSubmit = async (data: { amount: number; fromBalance: boolean }) => {
    await onConfirm(data.amount, data.fromBalance)
    reset()
  }

  if (!goal) return null

  const maxAmount = Math.max(0, goal.targetAmount - goal.currentAmount)
  const isCompleted = goal.currentAmount >= goal.targetAmount

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Dinheiro à Meta">
      <div className="space-y-4">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-semibold">Meta:</span> {goal.title}
          </p>
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-semibold">Valor atual:</span>{' '}
            {formatCurrency(goal.currentAmount)}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Faltam:</span>{' '}
            {formatCurrency(maxAmount)}
          </p>
        </div>

        {isCompleted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-700 font-semibold">
              🎉 Meta concluída! Parabéns!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
              label="Valor a Adicionar"
              type="number"
              step="0.01"
              min="0.01"
              max={maxAmount > 0 ? maxAmount : undefined}
              placeholder="0.00"
              {...register('amount', { 
                valueAsNumber: true,
                validate: (value) => {
                  if (value <= 0) return 'Valor deve ser maior que zero'
                  if (value > maxAmount) return `Valor não pode exceder ${formatCurrency(maxAmount)}`
                  return true
                }
              })}
              error={errors.amount?.message}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Origem do dinheiro
              </label>
              <div className="space-y-2">
                <label 
                  className={`flex items-center space-x-3 cursor-pointer p-3 border rounded-lg transition-colors ${
                    fromBalance 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    checked={fromBalance === true}
                    onChange={() => setValue('fromBalance', true)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      Saldo do mês
                    </span>
                    <p className="text-xs text-gray-500">
                      O valor será descontado do seu saldo mensal
                    </p>
                  </div>
                </label>
                <label 
                  className={`flex items-center space-x-3 cursor-pointer p-3 border rounded-lg transition-colors ${
                    fromBalance === false 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    checked={fromBalance === false}
                    onChange={() => setValue('fromBalance', false)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      Outro lugar
                    </span>
                    <p className="text-xs text-gray-500">
                      Dinheiro de outra fonte (não afeta o saldo)
                    </p>
                  </div>
                </label>
              </div>
              {errors.fromBalance && (
                <p className="text-sm text-red-600">{errors.fromBalance.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={isLoading}
              >
                Adicionar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose()
                  reset()
                }}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}

