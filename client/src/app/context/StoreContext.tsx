import produce from 'immer'
import {createContext, PropsWithChildren, useContext, useState} from 'react'
import {Basket} from '../models/basket'

interface StoreContextValue {
  basket: Basket | null
  setBasket: (basket: Basket) => void
  removeItem: (productId: number, quantity: number) => void
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined)

export const StoreProvider = ({children}: PropsWithChildren<any>) => {
  const [basket, setBasket] = useState<Basket | null>(null)

  const removeItem = (productId: number, quantity: number) => {
    if (!basket) return
    const cloneBasket = produce(basket, (draft) => {
      const itemIndex = draft.items.findIndex(
        (item) => item.productId === productId
      )
      if (itemIndex === -1) return
      draft.items[itemIndex].quantity -= quantity
      if (draft.items[itemIndex].quantity <= 0) draft.items.splice(itemIndex, 1)
    })
    setBasket(cloneBasket)
  }

  return (
    <StoreContext.Provider
      value={{
        basket,
        setBasket,
        removeItem,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStoreContext = () => {
  const context = useContext(StoreContext)
  if (!context) throw Error('Oops - we do not seem to be inside the provider')
  return context
}
