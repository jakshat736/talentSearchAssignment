import { Close } from '@mui/icons-material';
import { CardHeader, Dialog, IconButton, Pagination, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import * as React from 'react';
import { SessionContext } from './SessionContext';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Title' },
    { id: 'price', numeric: true, disablePadding: false, label: 'Price' },
    { id: 'popularity', numeric: true, disablePadding: false, label: 'Popularity' },
];

function CustomTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead >
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="left"
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}

                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            <Typography variant='h6'>
                                {headCell.label}
                            </Typography>
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

CustomTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

export default function ProductTable() {
    const { products } = React.useContext(SessionContext);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('price');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [priceFilter, setPriceFilter] = React.useState('');
    const [popularityFilter, setPopularityFilter] = React.useState('');
    const [open, setOpen] = React.useState(false)
    const [data, setData] = React.useState(null)

    const productsArray = Object.entries(products || {})?.map(([id, values]) => ({
        id: parseInt(id),
        ...values,
        price: Number(values?.price),
        popularity: Number(values?.popularity),
    }));

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChange = (event, newPage) => {
        setPage(newPage - 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handlePriceFilterChange = (event) => {
        setPriceFilter(event.target.value);
    };

    const handlePopularityFilterChange = (event) => {
        setPopularityFilter(event.target.value);
    };

    const filteredProducts = productsArray?.filter((product) => {
        const matchesTitle = product?.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice =
            priceFilter === '' ||
            (priceFilter === '0-5000' && product?.price <= 5000) ||
            (priceFilter === '5000-10000' && product?.price > 5000 && product.price <= 10000) ||
            (priceFilter === '10000-20000' && product?.price > 10000 && product.price <= 20000) ||
            (priceFilter === '20000+' && product?.price > 20000);
        const matchesPopularity =
            popularityFilter === '' ||
            (popularityFilter === '0-10000' && product?.popularity <= 10000) ||
            (popularityFilter === '10000-30000' && product?.popularity > 10000 && product?.popularity <= 30000) ||
            (popularityFilter === '30000-50000' && product?.popularity > 30000 && product?.popularity <= 50000) ||
            (popularityFilter === '50000+' && product?.popularity > 50000);
        return matchesTitle && matchesPrice && matchesPopularity;
    });


    const visibleRows = React.useMemo(
        () =>
            stableSort(filteredProducts, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage, filteredProducts]
    );

    return (
        <Box sx={{ width: '80%' }}>
            <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        label="Search by Title"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        label="Filter by Price"
                        value={priceFilter}
                        onChange={handlePriceFilterChange}
                        fullWidth
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="0-5000">0-5000</MenuItem>
                        <MenuItem value="5000-10000">5000-10000</MenuItem>
                        <MenuItem value="10000-20000">10000-20000</MenuItem>
                        <MenuItem value="20000+">20000+</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Filter by Popularity"
                        value={popularityFilter}
                        onChange={handlePopularityFilterChange}
                        fullWidth
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="0-10000">0-10000</MenuItem>
                        <MenuItem value="10000-30000">10000-30000</MenuItem>
                        <MenuItem value="30000-50000">30000-50000</MenuItem>
                        <MenuItem value="50000+">50000+</MenuItem>
                    </TextField>
                </Box>
                <TableContainer sx={{ maxHeight: 640 }}>
                    <Table stickyHeader sx={{ minWidth: 750 }}>
                        <CustomTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {visibleRows.map((row) => (
                                <TableRow
                                    hover
                                    key={row.id}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell align="left" onClick={() => {
                                        setOpen(true)
                                        setData(row)
                                    }} sx={{ width: 400 }}>{row.title}</TableCell>
                                    <TableCell align="left">{row.price}</TableCell>
                                    <TableCell align="left">{row.popularity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack direction='row' justifyContent='space-between' mt={1}>
                    <Pagination count={Math.ceil(filteredProducts.length / rowsPerPage)} page={page + 1} onChange={handleChange} size="large" />

                    <TablePagination
                        rowsPerPageOptions={[20]}
                        component="div"
                        count={filteredProducts?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Stack>
            </Paper>
            {open && <DetailsModal open={open} close={() => setOpen(false)} row={data} />}
        </Box>
    );
}

DetailsModal.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    row: PropTypes.object
}

function DetailsModal({ open, close, row }) {

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            onClose={close}>
            <CardHeader
                title="Product Details"
                action={
                    <IconButton onClick={close}>
                        <Close />
                    </IconButton>
                }
                sx={{ p: 3 }} />
            <Stack sx={{ p: 3 }}>
                <Typography variant='h5'>Title - {row?.title}</Typography>
                <Typography variant='h5'>Price - {row?.price}</Typography>
                <Typography variant='h5'>Popularity - {row?.popularity}</Typography>
                <Typography variant='h5'>Description - Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley</Typography>
            </Stack>
        </Dialog>
    )
}