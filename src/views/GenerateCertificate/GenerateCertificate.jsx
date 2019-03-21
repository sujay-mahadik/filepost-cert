import React from "react";
import { Row, Col, Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import FormInputs from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { Form } from "react-bootstrap";


class CertificateGeneration extends React.Component {
    state = {
        ipfsHash: 'hash will be available here after successful file upload',
        ipfsURL: '',
        ipfsURLDisplay: false,
        buffer: '',
        ethAddress: '',
        blockNumber: '',
        transactionHash: '',
        gasUsed: '',
        txReceipt: '',
        percentUploaded: 0,
        fileSize: '',
        fileName: 'Select Certificate',
        fileType: '',
        fileExt: ''
    }

    captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()

        //size of file
        this.setState({ fileSize: event.target.files[0].size })
        this.setState({ fileName: event.target.files[0].name })
        this.setState({ fileType: event.target.files[0].type })
        this.setState({ fileExt: event.target.files[0].name.split('.').pop() })
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)


    };

    convertToBuffer = async (reader) => {
        //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
        //set this buffer -using es6 syntax
        this.setState({ buffer });
    };

    onSubmit = async (event) => {
        event.preventDefault();


    };


    render() {
        return (
            <div className="content">
                <Row>
                    <Col xs={12}>
                        <Card>
                            <CardHeader><CardTitle>Generate</CardTitle></CardHeader>
                            <CardBody>

                                <Form onSubmit={this.onSubmit}>
                                    {/* add all the code inside onSubmit */}
                                    <div>
                                        <label htmlFor="file-input" className="btn btn-info btn-md">
                                            <div style={{ textTransform: 'none' }}>
                                                {this.state.fileName}
                                            </div>

                                        </label>
                                        <input id="file-input" type="file" style={{ display: 'none' }} onChange={this.captureFile} />
                                    </div>
                                    <br />
                                    <FormInputs
                                        ncols={["col-md-6 pr-1", "col-md-6 pl-1"]}
                                        proprieties={[
                                            {
                                                label: "Receivers Address",
                                                inputProps: {
                                                    type: "textarea",
                                                    defaultValue:
                                                        "",
                                                    placeholder: "Enter Receivers Address"
                                                }
                                            },
                                            {
                                                label: "Issuers Private Key",
                                                inputProps: {
                                                    type: "textarea",
                                                    defaultValue:
                                                        "",
                                                    placeholder: "Enter Issuers Private Key"
                                                }
                                            }
                                        ]}
                                    />

                                    <Row>
                                        <div className="update ml-auto mr-auto">
                                            <Button type="submit" color="primary" round>Generate Certificate</Button>
                                        </div>
                                    </Row>
                                </Form>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div >
        );
    }
}

export default CertificateGeneration;
