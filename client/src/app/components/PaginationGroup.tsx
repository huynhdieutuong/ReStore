import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import {Box} from '@mui/system'
import {MetaData} from '../models/pagination'

interface Props {
  metaData: MetaData
  size: number
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

const PaginationGroup = ({metaData, onPageChange, size, onSizeChange}: Props) => {
  const {currentPage, totalCount, totalPage, pageSize} = metaData
  const start = (currentPage - 1) * pageSize + 1
  const end = currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize

  const handleChangeSize = (event: SelectChangeEvent) => {
    onSizeChange(Number(event.target.value))
  }

  return (
    <Box
      sx={{display: 'flex', alignItems: 'center', my: 4, flexDirection: {xs: 'column', sm: 'row'}}}
    >
      <Typography
        sx={{flexGrow: 1, mb: {xs: 1, sm: 0}}}
      >{`Displaying ${start}-${end} of ${totalCount} items`}</Typography>

      <FormControl sx={{width: 65, mb: {xs: 1, sm: 0}}} size='small'>
        <InputLabel id='page-size'>Size</InputLabel>
        <Select
          labelId='page-size'
          id='page-size-select'
          defaultValue={size.toString()}
          label='Size'
          onChange={handleChangeSize}
        >
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={12}>12</MenuItem>
          <MenuItem value={24}>24</MenuItem>
        </Select>
      </FormControl>

      <Pagination
        color='secondary'
        page={currentPage}
        count={totalPage}
        onChange={(e, page) => onPageChange(page)}
      />
    </Box>
  )
}

export default PaginationGroup
