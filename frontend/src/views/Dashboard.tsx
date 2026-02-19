import React from 'react';
import { Card, Table, ListGroup } from 'react-bootstrap';

const Dashboard: React.FC = () => {
    return (
        <div className="content-box">
            <h2>Welcome to the Employee Portal</h2>
            <p>You are logged into the Legacy Bank Core Banking System. Use the navigation sidebar to perform customer and account operations.</p>
            
            <Card className="mb-4">
                <Card.Header>Internal Announcements</Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item><strong>System Maintenance:</strong> The CIF database will be down for maintenance this Saturday at midnight.</ListGroup.Item>
                        <ListGroup.Item><strong>New 24H ATM:</strong> A new ATM has been successfully installed in the downtown branch.</ListGroup.Item>
                        <ListGroup.Item><strong>Q1 Performance:</strong> Savings interest rates have been adjusted to 5.0%.</ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Product Type</th>
                        <th>Standard Rate</th>
                        <th>Internal Target</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Savings</td>
                        <td>5.0%</td>
                        <td>12% Growth</td>
                    </tr>
                    <tr>
                        <td>CD</td>
                        <td>7.2%</td>
                        <td>5% Retention</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
};

export default Dashboard;
