import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link } from "react-router-dom";
import "@/assets/styles/CollapsibleTable.css";

function Row({ row, onDeleteClick }) {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.title}
                </TableCell>
                <TableCell>
                    <small
                        className={`${row.status === "to-do" ? "tw-bg-red-500" : row.status === "in-progress" ? "tw-bg-blue-500" : "tw-bg-green-500"} tw-text-white tw-px-2 tw-py-1 tw-rounded-full`}
                    >
                        {row.status}
                    </small>
                </TableCell>
                <TableCell>
                    <small
                        className={`${row.priority === "low" ? "tw-bg-yellow-500" : row.priority === "medium" ? "tw-bg-orange-500" : "tw-bg-red-500"} tw-text-white tw-px-2 tw-py-1 tw-rounded-full`}
                    >
                        {row.priority}
                    </small>
                </TableCell>
                <TableCell>
                    <span
                        className={
                            new Date(row.due_date) < new Date()
                                ? "tw-text-red-500"
                                : ""
                        }
                    >
                        {row.due_date}
                    </span>
                </TableCell>
                <TableCell>
                    <Link to={`/tasks/${row.id}`}>
                        <i className="fa-regular fa-pen-to-square tw-text-orange-400 tw-mr-2"></i>
                    </Link>
                    <button onClick={() => onDeleteClick(row.id)}>
                        <i className="fa-regular fa-trash-can tw-text-red-400"></i>
                    </button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    <TableRow>
                                        <TableCell
                                            className="tw-bg-indigo-100"
                                            style={{
                                                paddingTop: "10px",
                                                paddingBottom: "10px",
                                            }}
                                        >
                                            Description
                                        </TableCell>
                                        <TableCell className="tw-text-wrap">
                                            {row.description}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell
                                            className="tw-bg-indigo-100"
                                            style={{
                                                paddingTop: "10px",
                                                paddingBottom: "10px",
                                            }}
                                        >
                                            Created By
                                        </TableCell>
                                        <TableCell>{row.created_by}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell
                                            className="tw-bg-indigo-100"
                                            style={{
                                                paddingTop: "10px",
                                                paddingBottom: "10px",
                                            }}
                                        >
                                            Created At
                                        </TableCell>
                                        <TableCell>{row.created_at}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell
                                            className="tw-bg-indigo-100"
                                            style={{
                                                paddingTop: "10px",
                                                paddingBottom: "10px",
                                            }}
                                        >
                                            Updated By
                                        </TableCell>
                                        <TableCell>{row.updated_by}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell
                                            className="tw-bg-indigo-100"
                                            style={{
                                                paddingTop: "10px",
                                                paddingBottom: "10px",
                                            }}
                                        >
                                            Updated At
                                        </TableCell>
                                        <TableCell>{row.updated_at}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        status: PropTypes.string.isRequired,
        priority: PropTypes.string.isRequired,
        due_date: PropTypes.string,
        created_by: PropTypes.string,
        created_at: PropTypes.string,
        updated_by: PropTypes.string,
        updated_at: PropTypes.string,
    }).isRequired,
    onDeleteClick: PropTypes.func.isRequired,
};

export default function CollapsibleTable({
    tasks,
    onDeleteClick,
    loading,
    pagination,
    renderPageNumbers,
    getTasks,
}) {
    return (
        <TableContainer component={Paper} className="tw-mt-4">
            <Table aria-label="collapsible table">
                <TableHead className="tw-bg-indigo-400">
                    <TableRow>
                        <TableCell />
                        <TableCell>Title</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Due Date</TableCell>
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
                        {tasks.map((task) => (
                            <Row
                                key={task.id}
                                row={task}
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
                        onClick={() => getTasks(pagination.current_page - 1)}
                        className="tw-px-3 tw-py-1 tw-border tw-rounded disabled:tw-opacity-50"
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>

                    {renderPageNumbers()}

                    <button
                        disabled={
                            pagination.current_page === pagination.last_page
                        }
                        onClick={() => getTasks(pagination.current_page + 1)}
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
    tasks: PropTypes.array,
    onDeleteClick: PropTypes.func,
    loading: PropTypes.bool,
    pagination: PropTypes.object,
    renderPageNumbers: PropTypes.func,
    getTasks: PropTypes.func,
};
