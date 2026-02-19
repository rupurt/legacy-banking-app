import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { api } from '../api';
import type { Customer, Account } from '../api/generated';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const accountSchema = z.object({
    productCode: z.string().min(1, 'Product type is required'),
    balance: z.number().min(0, 'Opening deposit must be at least 0'),
});

type AccountFormData = z.infer<typeof accountSchema>;

const CustomerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            productCode: 'CHK-STD',
            balance: 0,
        },
    });

    const fetchCustomer = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await api.customersIdGet({ id });
            setCustomer(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch customer details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const onCreateAccount = async (data: AccountFormData) => {
        if (!customer) return;
        try {
            await api.accountsPost({
                account: {
                    customerId: customer.customerId,
                    productCode: data.productCode,
                    balance: data.balance,
                }
            });
            // Refresh customer data to show new account
            fetchCustomer();
        } catch (err: any) {
            alert('Failed to create account: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading customer profile...</p>
            </div>
        );
    }

    if (error || !customer) {
        return (
            <Alert variant="danger">
                {error || 'Customer not found'}
                <div className="mt-3">
                    <Button onClick={() => navigate('/customers')} variant="outline-danger">Back to List</Button>
                </div>
            </Alert>
        );
    }

    return (
        <div className="content-box">
            <Card className="mb-4">
                <Card.Header as="h5">Customer Record: {customer.firstName} {customer.lastName}</Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Customer ID:</strong> {customer.customerId}</p>
                            <p><strong>CIF Number:</strong> {customer.cifNumber}</p>
                            <p><strong>Email:</strong> {customer.email}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Date of Birth:</strong> {customer.dateOfBirth}</p>
                            <p><strong>KYC Status:</strong> {customer.kycStatus}</p>
                            <p><strong>Risk Rating:</strong> {customer.riskRating}</p>
                        </Col>
                    </Row>
                    <hr />
                    <h4>Accounts</h4>
                    {customer.accounts && customer.accounts.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Account Number</th>
                                    <th>Product</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customer.accounts.map((account: Account) => (
                                    <tr key={account.accountId}>
                                        <td>{account.accountNumber}</td>
                                        <td>{account.productCode}</td>
                                        <td>${account.balance?.toFixed(2)}</td>
                                        <td>{account.status}</td>
                                        <td>
                                            <Button onClick={() => navigate(`/accounts/${account.accountId}`)} variant="outline-info" size="sm">
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No accounts found for this customer.</p>
                    )}
                    <hr />
                    <h4>Open New Account</h4>
                    <Form onSubmit={handleSubmit(onCreateAccount)}>
                        <Row>
                            <Col md={5}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Type</Form.Label>
                                    <Form.Select {...register('productCode')}>
                                        <option value="CHK-STD">Standard Checking</option>
                                        <option value="SAV-HYS">High Yield Savings</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Opening Deposit</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        step="0.01" 
                                        {...register('balance', { valueAsNumber: true })} 
                                        isInvalid={!!errors.balance}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.balance?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3} className="d-flex align-items-end mb-3">
                                <Button type="submit" variant="success" className="w-100">Initialize Account</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <Button variant="outline-secondary" onClick={() => navigate('/customers')}>Back to Directory</Button>
        </div>
    );
};

export default CustomerDetail;
