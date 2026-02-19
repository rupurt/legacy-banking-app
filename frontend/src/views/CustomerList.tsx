import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { Customer } from '../api/generated';

const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await api.customersGet();
                setCustomers(response.data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch customers');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading customers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger">
                {error}
            </Alert>
        );
    }

    return (
        <div className="content-box">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Customer Directory</h2>
                <Button onClick={() => navigate('/customers/new')} variant="primary">Register New Customer</Button>
            </div>
            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>CIF Number</th>
                                <th>Email</th>
                                <th>Accounts</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.customerId}>
                                    <td>{customer.lastName}, {customer.firstName}</td>
                                    <td>{customer.cifNumber}</td>
                                    <td>{customer.email}</td>
                                    <td><Badge bg="info">{customer.accountCount}</Badge></td>
                                    <td>
                                        <Button onClick={() => navigate(`/customers/${customer.customerId}`)} variant="outline-secondary" size="sm">
                                            View Profile
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CustomerList;
