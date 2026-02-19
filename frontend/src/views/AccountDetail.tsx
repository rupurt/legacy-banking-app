import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { api } from '../api';
import type { Account, Transaction } from '../api/generated';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const transactionSchema = z.object({
    transactionType: z.string().min(1, 'Transaction type is required'),
    amount: z.number().min(0.01, 'Amount must be positive'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const AccountDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [account, setAccount] = useState<Account | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            transactionType: 'DEPOSIT',
            amount: 0.01,
        },
    });

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [accountResponse, transactionsResponse] = await Promise.all([
                api.accountsIdGet({ id }),
                api.transactionsAccountIdGet({ accountId: id })
            ]);
            setAccount(accountResponse.data);
            setTransactions(transactionsResponse.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch account details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const onExecuteTransaction = async (data: TransactionFormData) => {
        if (!account) return;
        try {
            await api.transactionsPost({
                transaction: {
                    accountId: account.accountId,
                    transactionType: data.transactionType,
                    amount: data.amount,
                }
            });
            // Refresh data to show new transaction and balance update
            fetchData();
        } catch (err: any) {
            alert('Failed to execute transaction: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading account details...</p>
            </div>
        );
    }

    if (error || !account) {
        return (
            <Alert variant="danger">
                {error || 'Account not found'}
                <div className="mt-3">
                    <Button onClick={() => navigate('/customers')} variant="outline-danger">Back to Directory</Button>
                </div>
            </Alert>
        );
    }

    return (
        <div className="content-box">
            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header as="h5">Account Overview: {account.accountNumber}</Card.Header>
                        <Card.Body>
                            <p><strong>Product Code:</strong> {account.productCode}</p>
                            <p><strong>Status:</strong> {account.status}</p>
                            <p><strong>Current Balance:</strong> ${account.balance?.toFixed(2)}</p>
                            <p><strong>Owner ID:</strong> {account.customerId}</p>
                            {account.status === 'OPEN' && (
                                <Button variant="outline-danger" size="sm">Deactivate Account</Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header as="h5">Record New Transaction</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit(onExecuteTransaction)}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Operation</Form.Label>
                                    <Form.Select {...register('transactionType')}>
                                        <option value="DEPOSIT">Deposit</option>
                                        <option value="WITHDRAWAL">Withdrawal</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Transaction Amount</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        step="0.01" 
                                        {...register('amount', { valueAsNumber: true })} 
                                        isInvalid={!!errors.amount}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.amount?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button type="submit" variant="primary">Execute Transaction</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h3>Recent Activity</h3>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Transaction Type</th>
                        <th>Amount</th>
                        <th>Post Date</th>
                        <th>Balance After</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((t) => (
                            <tr key={t.transactionId}>
                                <td>{t.transactionType}</td>
                                <td>${t.amount?.toFixed(2)}</td>
                                <td>{new Date(t.transactionDate || '').toLocaleString()}</td>
                                <td>${t.balanceAfter?.toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center">No transactions recorded.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Button onClick={() => navigate(`/customers/${account.customerId}`)} variant="outline-secondary">Back to Profile</Button>
        </div>
    );
};

export default AccountDetail;
