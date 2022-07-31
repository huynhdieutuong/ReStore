import {useEffect} from 'react'
import {useAppDispatch} from '../../app/store/hooks'
import {setLogout} from './accountSlice'

const Logout = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setLogout())
  }, [dispatch])

  return <div>Logout</div>
}

export default Logout
