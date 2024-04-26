import * as Yup from 'yup';
import { Formik, FormikHelpers } from "formik";
import { Row, Col, Card, Button, Form, Alert } from "react-bootstrap";

import config from '../config';
import ValidatedInput from './ValidatedInput';
import ValidatedSelect from './ValidatedSelect';
import { useStartTaskMutation } from '../api/tasks';
import { TracerouteTaskResponse, Task, TaskResponse } from '../api/types';

interface Props {
    setResponse: (response: TaskResponse|null) => void;
    setLoading: (response: boolean) => void;
}

export default function (props: Props) {
    const [startTask, { error }] = useStartTaskMutation();

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
        props.setLoading(true);
        startTask(data)
            .unwrap()
            .then((response) => {
                setSubmitting(false);
                props.setLoading(false);

                if ('hops' in response) {
                    props.setResponse(response as TracerouteTaskResponse);
                    return;
                }

                props.setResponse(response);
            })
            .catch(() => {
                props.setLoading(false);
                props.setResponse(null);
                setSubmitting(false);
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
                                <Col sm={12} md={6} lg={4}>
                                    <Form.Group controlId="location">
                                        <Form.Label>Location</Form.Label>
                                        <ValidatedSelect
                                            name="location"
                                            aria-label="Select a location"
                                        >
                                            <option disabled>Select a location</option>
                                            {Object.entries(config.locations).map((entry, index) => {
                                                const [key, location] = entry;

                                                return (
                                                    <option key={index} value={key}>{location.label}</option>
                                                );
                                            })}
                                        </ValidatedSelect>
                                    </Form.Group>
                                </Col>

                                <Col sm={12} md={6} lg={4}>
                                    <Form.Group controlId="command">
                                        <Form.Label>Command</Form.Label>
                                        <ValidatedSelect
                                            name="command"
                                            aria-label="Select a command"
                                        >
                                            <option disabled>Select a command</option>
                                            <option value='ping4'>Ping IPv4</option>
                                            <option value='ping6'>Ping IPv6</option>
                                            <option value='traceroute4'>Traceroute IPv4</option>
                                            <option value='traceroute6'>Traceroute IPv6</option>
                                        </ValidatedSelect>
                                    </Form.Group>
                                </Col>

                                <Col sm={12} md={6} lg={4}>
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

                            {(error && ('data' in error) && ('error' in (error.data as object))) &&
                                <Row className='mt-3'>
                                    <Col>
                                        <Alert variant='danger' dismissible>
                                            Error: {(error.data as { [key: string]: string }).error}
                                        </Alert>
                                    </Col>
                                </Row>
                            }

                            <Button variant="primary" type='submit' className="mt-3">Start!</Button>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    );
}