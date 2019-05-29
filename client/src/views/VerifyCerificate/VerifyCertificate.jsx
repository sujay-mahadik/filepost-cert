import React from "react";
import { Row, Col, Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import FormInputs from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { Form } from "react-bootstrap";
import getWeb3 from "../../utils/getWeb3";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import ipfs from "../../utils/ipfs";
import NodeRSA from "../../utils/rsa";
import md5 from "../../utils/md5";

class CertificateVerification extends React.Component {
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
        fileExt: '',
        status: ''
    }
    constructor(props, context) {
        super(props, context);
        // Binding "this" creates new function with explicitly defined "this"
        // Now "openArticleDetailsScreen" has "ArticleListScreen" instance as "this"
        // no matter how the method/function is called.
    }
    componentDidMount = async () => {


        
        try {
            //   // Get network provider and web3 instance.
            const web3 = await getWeb3();
            console.log('idhar hich hai apun');
            //   // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            console.log(accounts)
            const networkId = await web3.eth.net.getId();
            console.log(networkId);
            const deployedNetwork = SimpleStorageContract.networks[networkId];
            const instance = new web3.eth.Contract(
                SimpleStorageContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            //   // Set web3, accounts, and contract to the state, and then proceed with an
            //   // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance }, this.checkKey);

            //  
        } catch (error) {
            //   // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.log('called');
        }
    };

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

        const buffer = await Buffer.from(reader.result);

        this.setState({ buffer });
        ipfs.add(this.state.buffer, (err, ipfsHash) => {
            console.log(ipfsHash[0].path);
            this.setState({ upload: ipfsHash[0].path });

        })
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const { accounts, contract } = this.state;

        if(this.state.Link)
        {
            this.setState({fileHash:this.state.Link});
            fetch('https://ipfs.io/ipfs/'+this.state.Link).then(response=>response.text()).then(data=>this.setState({oebuffer:data},this.verify));
            }
      
                // Examine the text in the response
                
        

          // Examine the text in the response
          
        
        else{
            this.setState({fileHash:this.state.upload})
            
            this.setState({oebuffer:this.state.buffer},this.verify)
        }

    };
    verify = async () => {

        const { accounts, contract } = this.state;

        var ff = await contract.methods.getAllUsersName().call({ from: accounts[0] });
        console.log(ff);
        ff = await contract.methods.getAllUsersAdd().call({ from: accounts[0] });
        console.log(ff);
        console.log(this.state.oebuffer.data)
        var hash =md5(this.state.oebuffer);
        
        
        var digitalSignature = await contract.methods.getDigitalSignature(this.state.fileHash).call({ from: accounts[0] });
        console.log(digitalSignature[0], digitalSignature[1]);
        
        var name = await contract.methods.getName(digitalSignature[1]).call({ from: accounts[0] });
        this.setState({ name });
        var key = new NodeRSA();
        key.importKey(this.state.publicKey, 'public');
        console.log(key.exportKey('public'));
        console.log(digitalSignature);
        var hashFromDigitalSignature = key.decryptPublic(digitalSignature[0], 'utf8');
        console.log(hash);
        console.log(hashFromDigitalSignature);
        if (hash === hashFromDigitalSignature) {
            this.setState({ status: "The Certifiacate is Verified and issued by " + name });
        }
        else {
            this.setState({ status: "forged" });
        }
    }
    getKey = async (event) => {
        event.preventDefault();
        this.setState({ publicKey: event.target.value });
        console.log(this.state.publicKey);
    }
    getLink = async (event) => {
        event.preventDefault();
        this.setState({ Link: event.target.value });
        console.log(this.state.Link);
    }

    render() {
        return (
            <div className="content">
                <Row>
                    <Col xs={12}>
                        <Card>
                            <CardHeader><CardTitle>Verify</CardTitle></CardHeader>
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
                                        <FormInputs
                                        ncols={["col-md-6 pr-1"]}
                                        proprieties={[
                                            
                                            {
                                                label: "IPFS Link to the Certificate",
                                                inputProps: {
                                                    type: "textarea",
                                                    defaultValue:
                                                        "",
                                                    placeholder: "Link to IPFS Certificate or Hash of file",
                                                    onChange:this.getLink
                                                }
                                            }
                                        ]}
                                    />
                                    </div>
                                    <br />
                                    <FormInputs
                                        ncols={["col-md-6 pr-1"]}
                                        proprieties={[
                                            {
                                                label: "Public Key",
                                                inputProps: {
                                                    type: "textarea",
                                                    defaultValue:
                                                        "",
                                                    placeholder: "Enter Public Key of the Issuer",
                                                    onChange: this.getKey
                                                }
                                            }
                                        ]}
                                    />

                                    <Row>
                                        <div className="update ml-auto mr-auto">
                                            <Button type="submit" color="primary" round>Verify Certificate</Button>
                                        </div>
                                    </Row>
                                </Form>
                                <h5 className="text-info">
                                    {this.state.status}

                                </h5>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div >
        );
    }
}

export default CertificateVerification;
