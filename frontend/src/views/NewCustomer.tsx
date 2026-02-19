import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import { api } from '../api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const customerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD'),
    cifNumber: z.string().min(1, 'CIF number is required'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const NewCustomer: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
    });

    const onSubmit = async (data: CustomerFormData) => {
        try {
            await api.customersPost({
                customer: data
            });
            navigate('/customers');
        } catch (err: any) {
            alert('Failed to register customer: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="content-box">
            <h2>Register New Customer</h2>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                {...register('firstName')} 
                                isInvalid={!!errors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.firstName?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                {...register('lastName')} 
                                isInvalid={!!errors.lastName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.lastName?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control 
                                type="email" 
                                {...register('email')} 
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of Birth (YYYY-MM-DD)</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="1990-01-01"
                                {...register('dateOfBirth')} 
                                isInvalid={!!errors.dateOfBirth}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.dateOfBirth?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>CIF Number</Form.Label>
                            <Form.Control 
                                type="text" 
                                {...register('cifNumber')} 
                                isInvalid={!!errors.cifNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.cifNumber?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Registering...' : 'Submit Registration'}
                        </Button>
                        <Button variant="link" onClick={() => navigate('/customers')}>Cancel</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default NewCustomer;
