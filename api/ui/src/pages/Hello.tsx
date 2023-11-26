import { useState } from "react";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ComposableMap, Geographies, Geography, Line, Marker, Point, ZoomableGroup } from "react-simple-maps";

import config from "../config";
import ActionPanel from "../components/ActionPanel";
import { MTRTaskResponse, TaskResponse } from "../api/types";

export default function () {
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<TaskResponse|MTRTaskResponse|null>(null);

    return (
        <Container className="pt-4">
            <Row className="d-flex justify-content-between align-items-center">
                <h1 style={{ width: 'fit-content' }}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} /> Looking Glass <Badge bg="warning" className="my-auto" style={{ fontSize: '1.25rem' }}>Beta</Badge>
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

            {(response && !loading && 'hops' in response) &&
                <Row className="mt-4">
                    <Col>
                        <Card>
                            <Card.Header>Map</Card.Header>

                            <Card.Body>
                                <ComposableMap>
                                    <ZoomableGroup center={[0, 0]} zoom={1}>
                                        <Geographies geography={"https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"}>
                                            {({ geographies }) =>
                                                geographies.map((geo) => (
                                                    <Geography 
                                                        key={geo.rsmKey} 
                                                        geography={geo}
                                                        style={{
                                                            default: {
                                                                fill: "#CCC",
                                                            },
                                                            hover: {
                                                                fill: "#CCC",
                                                            },
                                                        }}
                                                    />
                                                ))
                                            }
                                        </Geographies>

                                        {response.hops.map((_, index) => {
                                            const startCoords: Point = [response.hops[index].longitude, response.hops[index].latitude];
                                            const endCoords: Point = [response.hops[index + 1]?.longitude ?? 0, response.hops[index + 1]?.latitude ?? 0];

                                            return (
                                                <>
                                                    {(response.hops[index - 1] != null) ?
                                                        <Marker coordinates={startCoords}>
                                                            <circle r={3} fill="#0a18aa" />
                                                        </Marker>
                                                    :
                                                        <Marker coordinates={startCoords}>
                                                            <circle r={3} fill="#33ff33" />
                                                        </Marker>
                                                    }
                                                    
                                                    {(response.hops[index + 1] == null) ?
                                                        <Marker coordinates={startCoords}>
                                                            <circle r={3} fill="#ff3333" />
                                                        </Marker>
                                                    :
                                                        <Line
                                                            from={startCoords}
                                                            to={endCoords}
                                                            stroke="#0d6efd"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                        />
                                                    }

                                                    {(endCoords[0] == 0 && endCoords[1] == 0) &&
                                                        <Marker coordinates={endCoords}>
                                                            <text textAnchor="middle" fill="#000" fontSize={5}>
                                                                Anycast
                                                            </text>
                                                        </Marker>
                                                    }
                                                </>
                                            )
                                        })}
                                    </ZoomableGroup>
                                </ComposableMap>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            }
        </Container>
    )
}