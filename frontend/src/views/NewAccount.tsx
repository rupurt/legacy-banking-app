import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import { api } from '../api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const accountSchema = z.object({
    customerId: z.number().min(1, 'Customer ID is required'),
    productCode: z.string().min(1, 'Product type is required'),
    balance: z.number().min(0, 'Opening deposit must be at least 0'),
});

type AccountFormData = z.infer<typeof accountSchema>;

const NewAccount: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            productCode: 'CHK-STD',
            balance: 0,
        },
    });

    const onSubmit = async (data: AccountFormData) => {
        try {
            await api.accountsPost({
                account: data
            });
            navigate(`/customers/${data.customerId}`);
        } catch (err: any) {
            alert('Failed to initialize account: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="content-box">
            <h2>Open New Account</h2>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Customer ID</Form.Label>
                            <Form.Control 
                                type="number" 
                                {...register('customerId', { valueAsNumber: true })} 
                                isInvalid={!!errors.customerId}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.customerId?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Type</Form.Label>
                            <Form.Select {...register('productCode')}>
                                <option value="CHK-STD">Standard Checking</option>
                                <option value="SAV-HYS">High Yield Savings</option>
                            </Form.Select>
                        </Form.Group>
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
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Initializing...' : 'Initialize Account'}
                        </Button>
                        <Button variant="link" onClick={() => navigate('/')}>Cancel</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default NewAccount;
