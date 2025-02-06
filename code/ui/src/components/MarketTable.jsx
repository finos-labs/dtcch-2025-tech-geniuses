import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  TableSortLabel,
  TablePagination,
  Box,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";

function MarketTable({ data, title, id }) {
  const [headers, setHeaders] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (data.length !== 0) {
      setHeaders(Object.keys(data[0]));
      setApiData(data);
      
      sessionStorage.setItem("rows", JSON.stringify(selectedRows));
    }
  }, [data, selectedRows]);

  // Sorting logic
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedData = [...apiData].sort((a, b) => {
      if (a[property] < b[property]) return isAsc ? -1 : 1;
      if (a[property] > b[property]) return isAsc ? 1 : -1;
      return 0;
    });

    setApiData(sortedData);
  };

  // Filtered data logic
  const filteredData = apiData.filter((row) =>
    headers.some((header) =>
      String(row[header]).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Handle row selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredData.map((row) => row));
      sessionStorage.setItem(
        "rows",
        filteredData.map((row) => row)
      );
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, row) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, row]);
    } else {
      setSelectedRows((prevSelected) => prevSelected.filter((r) => r !== row));
    }
  };

  if (data.length === 0 || apiData.length === 0) return <p>Loading...</p>;

  return (
    <>
      <h3>{title}</h3>
      <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
        {/* Search Box */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <TextField
            label="Search Table..."
            variant="outlined"
            size="small"
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 250 }}
          />
        </Box>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table size="small" stickyHeader>
            {/* Table Head */}
            <TableHead>
              <TableRow>
                {/* Checkbox for Select All */}
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < filteredData.length
                    }
                    checked={selectedRows.length === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {headers.map((header) => (
                  <TableCell
                    key={header}
                    align="left"
                    sx={{
                      padding: "6px 12px",
                      fontWeight: "bold",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === header}
                      direction={orderBy === header ? order : "asc"}
                      onClick={() => handleSort(header)}
                    >
                      {header}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={id + index} hover>
                    {/* Checkbox for Row Selection */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.some((r) => r === row)}
                        onChange={(e) => handleSelectRow(e, row)}
                      />
                    </TableCell>
                    {headers.map((header) => (
                      <TableCell
                        sx={{ textOverflow: "ellipsis" }}
                        key={header}
                        align="left"
                      >
                        <Tooltip title={row[header]} arrow disableInteractive>
                          <span
                            style={{
                              display: "inline-block",
                              maxWidth: "120px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {row[header]}
                          </span>
                        </Tooltip>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </>
  );
}

export default MarketTable;
