import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from './services/api'

interface Transaction {
  id: number
  title: string
  amount: number
  type: string
  category: string
  createdAt: Date
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionsProviderProps {
  children: ReactNode
}

interface TransactionsContextData {
  transactions: Transaction[]
  createTransaction: (transaction: TransactionInput) => Promise<void>
}

export const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData,
)

export function TransactionsProvider(props: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    api.get('/transactions').then((response) => {
      console.log(response)
      setTransactions(response.data.transactions)
    })
  }, [])

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date(),
    })

    setTransactions([...transactions, response.data.transactions])
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {props.children}
    </TransactionsContext.Provider>
  )
}
