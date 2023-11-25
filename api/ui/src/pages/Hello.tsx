import { useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import config from "../config";
import { TaskResponse } from "../api/types";
import ActionPanel from "../components/ActionPanel";

export default function () {
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<TaskResponse|null>(null);

    return (
        <Container className="pt-4">
            <Row className="d-flex justify-content-between align-items-center">
                <h1 style={{ width: 'fit-content' }}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} /> Looking Glass
                </h1>

                <img src={config.branding.logoUrl} alt="Logo" style={{ height: '3rem', width: 'auto' }}/>
            </Row>

            <Row className="mt-4">
                <Col>
                    <ActionPanel setResponse={setResponse} setLoading={setLoading}/>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header>Output</Card.Header>

                        <Card.Body>
                            {(response && !loading) && 
                                <pre style={{marginBottom: '0px'}}>{response.output}</pre>
                            }

                            {(loading) && 
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            }

                            {(!response && !loading) && 
                                <span>Start by selecting an action in the panel above.</span>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}