import * as React from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "@/assets/styles/CollapsibleTable.css";

function Row({ row, onDeleteClick }) {
    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell component="th" scope="row">
                    {row.id}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>

                <TableCell>
                    <Link to={`/users/${row.id}`}>
                        <i className="fa-regular fa-pen-to-square tw-text-orange-400 tw-mr-2"></i>
                    </Link>
                    <button onClick={() => onDeleteClick(row.id)}>
                        <i className="fa-regular fa-trash-can tw-text-red-400"></i>
                    </button>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string,
        created_by: PropTypes.string,
        created_at: PropTypes.string,
        updated_by: PropTypes.string,
        updated_at: PropTypes.string,
    }).isRequired,
    onDeleteClick: PropTypes.func.isRequired,
};

export default function CollapsibleTable({
    users,
    onDeleteClick,
    loading,
    pagination,
    renderPageNumbers,
    getUsers,
}) {
    return (
        <TableContainer component={Paper} className="tw-mt-4">
            <Table aria-label="collapsible table">
                <TableHead className="tw-bg-indigo-400">
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                {loading && (
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <img
                                    src="/src/assets/images/loading.gif"
                                    alt=""
                                    className="tw-inline-block tw-w-7"
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                )}
                {!loading && (
                    <TableBody>
                        {users.map((user) => (
                            <Row
                                key={user.id}
                                row={user}
                                onDeleteClick={onDeleteClick}
                            />
                        ))}
                    </TableBody>
                )}
            </Table>
            {!loading && (
                <div className="tw-flex tw-justify-end tw-items-center tw-gap-1 tw-my-4 tw-mr-4">
                    <button
                        disabled={pagination.current_page === 1}
                        onClick={() => getUsers(pagination.current_page - 1)}
                        className="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50"
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>

                    {renderPageNumbers()}

                    <button
                        disabled={
                            pagination.current_page === pagination.last_page
                        }
                        onClick={() => getUsers(pagination.current_page + 1)}
                        className="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50"
                    >
                        <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            )}
        </TableContainer>
    );
}

CollapsibleTable.propTypes = {
    users: PropTypes.array,
    onDeleteClick: PropTypes.func,
    loading: PropTypes.bool,
    pagination: PropTypes.object,
    renderPageNumbers: PropTypes.func,
    getUsers: PropTypes.func,
};
