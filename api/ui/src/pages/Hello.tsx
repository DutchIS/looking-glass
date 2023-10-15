
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import GetConfig from "../config";
import ActionPanel from "../components/ActionPanel";

export default function () {
    return (
        <Container className="pt-4">
            <Row className="d-flex justify-content-between align-items-center">
                <h1 style={{ width: 'fit-content' }}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} /> Looking Glass
                </h1>

                <img src={GetConfig().branding.logoUrl} alt="Logo" style={{ height: '3rem', width: 'auto' }}/>
            </Row>

            <Row className="mt-4">
                <Col>
                    <ActionPanel/>
                </Col>
            </Row>
        </Container>
    )
}