import React from "react";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import AddBook from "../book-realted/AddBook";
import EditBook from "../dialog-boxes/EditBook";
import jwt_decode from 'jwt-decode';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import api from '../../API/api';
import { Save } from "@mui/icons-material";
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
    {
        id: 'uniqueBookId',
        numeric: false,
        label: 'Id',
    },
    {
        id: 'title',
        numeric: false,
        label: 'Title',
    },
    {
        id: 'author',
        numeric: false,
        label: 'Author',
    },
    {
        id: 'category',
        numeric: false,
        label: 'Category',
    },
    {
        id: 'picture',
        numeric: false,
        label: 'Picture',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
    },
];

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'Status';
const DEFAULT_ROWS_PER_PAGE = 5;

function EnhancedTableHead(props) {
    const { order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (newOrderBy) => (event) => {
        onRequestSort(event, newOrderBy);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">

                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'left'}
                        padding={'none'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    //onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, openModal, handleDelete } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            <Tooltip title="Add">
                <button className="btn btn-danger" onClick={() => openModal()}>
                    <i className="bi bi-plus-circle-fill"></i>
                </button>
            </Tooltip>
            {
                numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        All Books
                    </Typography>
                )
            }

            {
                numSelected > 0 && (
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete()}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )
            }
        </Toolbar >
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const BooksTable = ({ rows, onUpdateRows, key, onDeleteRows, onSave, libraryId }) => {
    const [order, setOrder] = React.useState(DEFAULT_ORDER);
    const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [visibleRows, setVisibleRows] = React.useState(null);
    const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
    const [paddingHeight, setPaddingHeight] = React.useState(0);

    const { instance, inProgress, accounts } = useMsal();
    const [decodedTokenId, setDecodedTokenId] = useState("");
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
        const acquireAccessToken = async () => {
            const accessTokenRequest = {
                scopes: ["api://41fef766-32af-4ef8-9e15-13f2ca714ea8/UserImpersonation"],
                account: accounts[0],
            };

            if (inProgress === InteractionStatus.None) {
                try {
                    const accessTokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
                    const token = accessTokenResponse.accessToken;
                    setAccessToken(token);

                    if (decodedTokenId === "") {
                        const id = jwt_decode(token).oid;
                        setDecodedTokenId(id);
                    }
                } catch (error) {
                    if (error instanceof InteractionRequiredAuthError) {
                        instance.acquireTokenRedirect(accessTokenRequest);
                    }
                    console.log(error);
                }
            }
        };

        acquireAccessToken();
    }, [instance, inProgress, accounts, decodedTokenId]);

    React.useEffect(() => {
        let rowsOnMount = stableSort(
            rows,
            getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
        );

        rowsOnMount = rowsOnMount.slice(
            0 * DEFAULT_ROWS_PER_PAGE,
            0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
        );

        setVisibleRows(rowsOnMount);
    }, []);

    const handleRequestSort = React.useCallback(
        (event, newOrderBy) => {
            const isAsc = orderBy === newOrderBy && order === 'asc';
            const toggledOrder = isAsc ? 'desc' : 'asc';
            setOrder(toggledOrder);
            setOrderBy(newOrderBy);

            const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy));
            const updatedRows = sortedRows.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            );

            setVisibleRows(updatedRows);
        },
        [order, orderBy, page, rowsPerPage],
    );

    const handleClick = (event, name) => {
        console.log(name);
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = React.useCallback(
        (event, newPage) => {
            setPage(newPage);

            const sortedRows = stableSort(rows, getComparator(order, orderBy));
            const updatedRows = sortedRows.slice(
                newPage * rowsPerPage,
                newPage * rowsPerPage + rowsPerPage,
            );

            setVisibleRows(updatedRows);
        },
        [order, orderBy, rowsPerPage],
    );

    const handleChangeRowsPerPage = React.useCallback(
        (event) => {
            const updatedRowsPerPage = parseInt(event.target.value, 10);
            setRowsPerPage(updatedRowsPerPage);

            setPage(0);

            const sortedRows = stableSort(rows, getComparator(order, orderBy));
            const updatedRows = sortedRows.slice(
                0 * updatedRowsPerPage,
                0 * updatedRowsPerPage + updatedRowsPerPage,
            );

            setVisibleRows(updatedRows);

            // There is no layout jump to handle on the first page.
            setPaddingHeight(0);
        },
        [order, orderBy],
    );

    const isSelected = (name) => selected.indexOf(name) !== -1;
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessages, setAlertMessages] = React.useState([]);
    const [successOpen, setSuccessOpen] = React.useState(false);
    const [successMessages, setSuccessMessages] = React.useState([]);
    const handleAlertClose = (index) => {
        setAlertMessages((messages) => messages.filter((_, i) => i !== index));
        setSuccessMessages((messages) => messages.filter((_, i) => i !== index));
    };
    const [editId, setEditId] = useState(null);
    const handleEdit = (id, event) => {
        setEditId(id);
        setIsEditBookOpen(true);
        event.stopPropagation();
    }
    const handleDelete = () => {
        if (selected.length > 0)
            DeleteBooks(selected);
    };

    const DeleteBooks = async (ids) => {
        try {
            await Promise.all(ids.map(id => api.delete(`/book/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } })));
            let updatedRows = rows.filter(row => !ids.includes(row.uniqueBookId));
            console.log(updatedRows);
            onDeleteRows(updatedRows);
            setSelected([]);
            setSuccessMessages(`${ids.length} row(s) deleted`);
            setSuccessOpen(true);
        } catch (error) {
            setAlertMessages((messages) => [...messages, error.response.data]);
            setAlertOpen(true);
            console.log(`Error: ${error.message}`);
        }
    }

    const [isAddBookOpen, setIsAddBookOpen] = useState(false);

    const openModal = () => {
        setIsAddBookOpen(true);
        console.log(isAddBookOpen);
    };


    const [isEditBookOpen, setIsEditBookOpen] = useState(false);

    const openEditModal = () => {
        setIsEditBookOpen(true);
        console.log(isAddBookOpen);
    };

    const closeEditModal = () => {
        setIsEditBookOpen(false);
        setEditId(null);
    };
    const updateBook = (result) => {
        onUpdateRows(JSON.stringify(result));
        setEditId(null);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length}
                    openModal={openModal}
                    handleDelete={handleDelete}
                />
                {alertMessages.map((message, index) => (
                    <Snackbar
                        key={index}
                        open={alertOpen}
                        autoHideDuration={3000}
                        onClose={() => handleAlertClose(index)}
                    >
                        <Alert onClose={() => handleAlertClose(index)} severity="error">
                            {message}
                        </Alert>
                    </Snackbar>
                ))}
                {successMessages &&
                    <Snackbar
                        open={successOpen}
                        autoHideDuration={3000}
                        onClose={() => setSuccessMessages(false)}
                    >
                        <Alert onClose={() => setSuccessMessages(false)} severity="success">
                            {successMessages}
                        </Alert>
                    </Snackbar>
                }
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />

                        <TableBody>
                            {visibleRows
                                ? visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.uniqueBookId);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.uniqueBookId)}
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.uniqueBookId}
                                            selected={isItemSelected}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell >
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            >
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="right">{row.title}</TableCell>
                                            <TableCell align="right">{row.authro}</TableCell>
                                            <TableCell align="right">{row.category}</TableCell>
                                            <TableCell align="right">
                                                <img src={row.picture} alt="Image" width="50" height="50" />
                                            </TableCell>
                                            <TableCell align="right">{row.status=== 0? "Available": "Borrowed"}</TableCell>
                                            <TableCell align="right">
                                                <button className="btn btn-danger" onClick={(event) => handleEdit(row.uniqueBookId, event)}>
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                                : null}
                            {paddingHeight > 0 && (
                                <TableRow
                                    style={{
                                        height: paddingHeight,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {isAddBookOpen && (
                <AddBook onSave={onSave} onClose={() => setIsAddBookOpen(false)} libraryId={libraryId} />
            )}
            {isEditBookOpen && editId && (
                <EditBook wasSaved={updateBook} id={editId} onClose={() => closeEditModal()} />
            )}

        </Box>
    );

}

export default BooksTable;