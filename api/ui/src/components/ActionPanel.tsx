import * as Yup from 'yup';
import { Formik, FormikHelpers } from "formik";
import { Row, Col, Card, Button, Form } from "react-bootstrap";

import config from '../config';
import ValidatedInput from './ValidatedInput';
import ValidatedSelect from './ValidatedSelect';
import { Task, TaskResponse } from '../api/types';
import { useStartTaskMutation } from '../api/tasks';

interface Props {
    setResponse: (response: TaskResponse) => void;
    setLoading: (response: boolean) => void;
}

export default function (props: Props) {
    const [ startTask ] = useStartTaskMutation();

    const firstLocation = Object.keys(config.locations)[0];

    const initialValues = {
        location: firstLocation ?? '',
        command: 'ping4',
        target: '',
    }

    const validationSchema = Yup.object({
        location: Yup.string().required('Required'),
        command: Yup.string().required('Required'),
        target: Yup.string().required('Required'),
    });

    const submit = (data: Task, { setSubmitting }: FormikHelpers<Task>) => {
        console.log(data)
        props.setLoading(true);
        startTask(data)
            .unwrap()
            .then((response) => {
                setSubmitting(false);
                props.setLoading(false);
                props.setResponse(response);
                console.log(response);
            })
            .catch(error => {
                props.setLoading(false);
                props.setResponse({
                    output: 'Failed to start task.'
                });
                setSubmitting(false);
                console.log(error);
            })
    }

    return (
        <Card>
            <Card.Header>Actions</Card.Header>

            <Card.Body>
                <Formik
                    onSubmit={submit}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                >
                    {form => (
                        <Form onSubmit={form.handleSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="location">
                                        <Form.Label>Location</Form.Label>
                                        <ValidatedSelect
                                            name="location"
                                            aria-label="Select a location"
                                        >
                                            <option disabled>Select a location</option>
                                            {Object.entries(config.locations).map((entry, index) => {
                                                const [ key, location ] = entry;

                                                return (
                                                    <option key={index} value={key}>{location.label}</option>
                                                );
                                            })}
                                        </ValidatedSelect>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId="command">
                                        <Form.Label>Command</Form.Label>
                                        <ValidatedSelect
                                            name="command"
                                            aria-label="Select a command"
                                        >
                                            <option disabled>Select a command</option>
                                            <option value='ping4'>Ping IPv4</option>
                                            <option value='ping6'>Ping IPv6</option>
                                            <option value='mtr4'>MTR IPv4</option>
                                            <option value='mtr6'>MTR IPv6</option>
                                        </ValidatedSelect>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId="target">
                                        <Form.Label>Target</Form.Label>
                                        <ValidatedInput
                                            type="text"
                                            name="target"
                                            placeholder="Enter a IP address"
                                            aria-label="Enter a IP address"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="primary" type='submit' className="mt-3">Start!</Button>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    );
}