import * as Yup from 'yup';
import { Formik, FormikHelpers } from "formik";
import { Row, Col, Card, Button, Form } from "react-bootstrap";

import config from "../../config.json";
import { Task } from '../api/types';

export default function () {
    const initialValues = {
        location: '',
        command: '',
        target: '',
    }

    const validationSchema = {
        location: Yup.string().required('Required'),
        command: Yup.string().required('Required'),
        target: Yup.string().required('Required'),
    }

    const submit = (data: Task, { setSubmitting }: FormikHelpers<Task>) => {
        console.log(data);
        setSubmitting(false);
    }

    return (
        <Card>
            <Card.Header>Actions</Card.Header>

            <Card.Body>
                <Formik
                    initialValues={initialValues}
                    onSubmit={submit}
                    validationSchema={validationSchema}
                >
                    {(form) => (
                        <Form noValidate onSubmit={form.handleSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="location">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Select 
                                            name="location"
                                            aria-label="Select a location"
                                        >
                                            <option disabled>Select a location</option>
                                            {config.locations.map((location, index) => (
                                                <option key={index} value={location.url}>{location.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId="command">
                                        <Form.Label>Command</Form.Label>
                                        <Form.Select 
                                            name="command"
                                            aria-label="Select a command"
                                        >
                                            <option disabled>Select a command</option>
                                            <option value='ping'>Ping IPv4</option>
                                            <option value='ping'>Ping IPv6</option>
                                            <option value='ping'>MTR IPv4</option>
                                            <option value='ping'>MTR IPv6</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId="target">
                                        <Form.Label>Target</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="target"
                                            placeholder="Enter a IP address"
                                            aria-label="Enter a IP address"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>

                <Button variant="primary" type='submit' className="mt-3">Start!</Button>
            </Card.Body>
        </Card>
    );
}