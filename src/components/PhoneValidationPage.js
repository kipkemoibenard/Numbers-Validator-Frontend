import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PhoneValidationPage = () => {
    const [phones, setPhones] = useState([]);
    const [filteredPhones, setFilteredPhones] = useState([]);
    const [paginatedPhones, setPaginatedPhones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [phonesPerPage,setPhonesPerPage] = useState(5);
    const [filter, setFilter] = useState({ country: '', state: '' });
    const [pageNumbers, setPageNumbers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:9100/api/v1/phones')
            .then(res => setPhones(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        setFilteredPhones(phones.filter(phone =>
            (filter.country === '' || phone.country === filter.country) &&
            (filter.state === '' || phone.state === filter.state)
        ));
    }, [phones, filter]);

    useEffect(() => {
        setPaginatedPhones(filteredPhones.slice((currentPage - 1) * phonesPerPage, currentPage * phonesPerPage));
    }, [filteredPhones, currentPage, phonesPerPage]);
    useEffect(() => {
        setPageNumbers(Array.from({ length: Math.ceil(filteredPhones.length / phonesPerPage) }, (_, i) => i + 1));
    }, [filteredPhones, phonesPerPage]);
    const handleFilterChange = e => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const handlePageChange = page => {
        setCurrentPage(page);
    };
    const paginate = page => {
        setCurrentPage(page);
    };
    const handlePhonesPerPageChange = e => {
        setPhonesPerPage(Number(e.target.value));
    };

    return (
        <div className='container'>
            <div className="filter-container">
                <div></div>
                <label>Filter By:&nbsp;&nbsp;</label>
                <select name="country" value={filter.country} onChange={handleFilterChange}>
                    <option value="">All Countries</option>
                    {Array.from(new Set(phones.map(phone => phone.country))).map(country =>
                        <option key={country} value={country}>{country}</option>
                    )}
                </select>
                <label>&nbsp;&nbsp;</label>
                <select name="state" value={filter.state} onChange={handleFilterChange}>
                    <option value="">All States</option>
                    <option value="valid">Valid</option>
                    <option value="not valid">Not Valid</option>
                </select>
            </div>
            <table className='table table-sm table-responsive'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Country</th>
                        <th>Country Code</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedPhones.map(phone =>
                        <tr key={phone.phone}>
                            <td>{phone.name}</td>
                            <td>{phone.phone}</td>
                            <td>{phone.country}</td>
                            <td>{phone.countryCode}</td>
                            <td>{phone.state}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <div>
                <label>Items Per Page: &nbsp;</label>
            <select name="phonesPerPage" value={phonesPerPage} onChange={handlePhonesPerPageChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    </select>
                {pageNumbers.map((number) => (
                    <span
                        key={number}
                        style={{ cursor: "pointer", padding: "10px" }}
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default PhoneValidationPage;
