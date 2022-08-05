import {Navigate, Outlet, useLocation} from 'react-router-dom'
import {useAppSelector} from '../store/hooks'

const PrivateRoute = () => {
  const {user} = useAppSelector((state) => state.account)
  const location = useLocation()

  return user ? <Outlet /> : <Navigate to='../login' replace state={{from: location}} />
}

export default PrivateRoute
