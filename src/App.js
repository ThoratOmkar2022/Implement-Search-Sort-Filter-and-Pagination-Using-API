import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";

function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(4);
  const [sortFilterValue, setSortFilterValue] = useState("");
  const [operation, setOperation] = useState("");

  useEffect(() => {
    userData(0, 4, 0);
  }, []);

  const userData = async (
    start,
    end,
    increase,
    oprType = null,
    filterOrSortValue
  ) => {
    switch (oprType) {
      case "search":
        setOperation(oprType);
        setSortValue("");
        return await axios
          .get(
            `https://jsonplaceholder.typicode.com/users?q=${value}&_start=${start}&_end=${end}`
          )
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
      case "sort":
        setOperation(oprType);
        setSortFilterValue(filterOrSortValue);
        return await axios
          .get(
            `https://jsonplaceholder.typicode.com/users?_sort=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`
          )
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
      default:
        return await axios
          .get(
            `https://jsonplaceholder.typicode.com/users?_start=${start}&_end=${end}`
          )
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
    }
  };
  console.log(data);

  const handleReset = () => {
    setOperation("");
    setValue("");
    setSortFilterValue("");
    setSortValue("");
    setCurrentPage(0);
    userData(0, 4, 0);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    userData(0, 4, 0, "search");
  };
  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    userData(0, 4, 0, "sort", value);
  };
  const renderPagination = () => {
    if (data.length < 4 && currentPage === 0) return null;
    if (currentPage === 0) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              onClick={() => userData(4, 8, 1, operation, sortFilterValue)}
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                userData(
                  (currentPage - 1) * 4,
                  currentPage * 4,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>

          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                userData(
                  (currentPage + 1) * 4,
                  (currentPage + 2) * 4,
                  1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                userData(
                  (currentPage - 1) * 4,
                  currentPage * 4,
                  -1,
                  operation,
                  sortFilterValue
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };
  return (
    <MDBContainer>
      <h1 className="text-center">React Project</h1>
      <h2 className="text-center">
        Search,Sort & Pagination Of Data Using API
      </h2>
      <form
        style={{
          margin: "auto",
          padding: "5px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        className="d-flex imput-group w-auto"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search Name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <MDBBtn type="submit" color="dark" margin="auto" className="mx12">
          Search
        </MDBBtn>
        <br />
        <MDBBtn className="mx2" color="" onClick={() => handleReset()}>
          Reset
        </MDBBtn>
      </form>
      <div style={{ margineTop: "100px" }}>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Email</th>
                  <th scope="col">Address</th>
                </tr>
              </MDBTableHead>

              {data.length === 0 ? (
                <>
                  <MDBTableBody className="align-center mb-0">
                    <tr>
                      <td colSpan={8} className="text-center mb-0">
                        No data found{" "}
                      </td>
                    </tr>
                  </MDBTableBody>
                </>
              ) : (
                data.map((item, index) => {
                  return (
                    <MDBTableBody key={index}>
                      <tr>
                        <th>{index + 1}</th>
                        <td>{item.name}</td>
                        <td>{item.phone}</td>
                        <td>{item.email}</td>
                        <td>{item.address.city}</td>
                      </tr>
                    </MDBTableBody>
                  );
                })
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
      </div>
      {data.length > 0 && (
        <MDBRow>
          <MDBCol size="8">
            <h5>Sort Person by:</h5>
            <select
              style={{ width: "50%", borderRadius: "2px", height: "35px" }}
              onChange={handleSort}
              value={sortValue}
            >
              <option>Select Value</option>

              <option value={data.name}>name </option>
              <option value={data.id}>id</option>
              <option value={data.phone}>phone</option>
              <option value={data.email}>email </option>
            </select>
          </MDBCol>
          <MDBCol>
            <div
              style={{
                margin: "auto",
                padding: "15px",
                maxWidth: "250px",
                alignContent: "center",
              }}
            >
              {renderPagination()}
            </div>
          </MDBCol>
        </MDBRow>
      )}
    </MDBContainer>
  );
}

export default App;
