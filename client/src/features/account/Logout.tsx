import {useEffect} from 'react'
import {useAppDispatch} from '../../app/store/hooks'
import {clearBasket} from '../basket/basketSlice'
import {setLogout} from './accountSlice'

const Logout = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setLogout())
    dispatch(clearBasket())
  }, [dispatch])

  return <div>Logout</div>
}

export default Logout
