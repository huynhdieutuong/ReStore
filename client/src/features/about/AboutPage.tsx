import {Button, ButtonGroup, Typography} from '@mui/material'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import {
  decrement,
  increment,
  incrementByAmount,
  selectCount,
} from './counterSlice'

const AboutPage = () => {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()

  return (
    <>
      <Typography variant='h2'>AboutPage</Typography>
      <Typography variant='h6'>Counter: {count}</Typography>
      <ButtonGroup variant='contained'>
        <Button onClick={() => dispatch(increment())}>Increment</Button>
        <Button onClick={() => dispatch(decrement())}>Decrement</Button>
        <Button onClick={() => dispatch(incrementByAmount(5))}>
          Increment by 5
        </Button>
      </ButtonGroup>
    </>
  )
}

export default AboutPage
