import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import { api } from '../api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const transactionSchema = z.object({
    accountId: z.number().min(1, 'Source Account ID is required'),
    transactionType: z.string().min(1, 'Transaction type is required'),
    amount: z.number().min(0.01, 'Amount must be positive'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const NewTransaction: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            transactionType: 'DEPOSIT',
            amount: 0.01,
        },
    });

    const onSubmit = async (data: TransactionFormData) => {
        try {
            await api.transactionsPost({
                transaction: data
            });
            navigate(`/accounts/${data.accountId}`);
        } catch (err: any) {
            alert('Failed to execute transaction: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="content-box">
            <h2>New Financial Transaction</h2>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Operation</Form.Label>
                            <Form.Select {...register('transactionType')}>
                                <option value="DEPOSIT">Deposit</option>
                                <option value="WITHDRAWAL">Withdrawal</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Source Account ID</Form.Label>
                            <Form.Control 
                                type="number" 
                                {...register('accountId', { valueAsNumber: true })} 
                                isInvalid={!!errors.accountId}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.accountId?.message}
                            </Form.Control.Feedback>
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
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Executing...' : 'Execute Transaction'}
                        </Button>
                        <Button variant="link" onClick={() => navigate('/')}>Cancel</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default NewTransaction;
