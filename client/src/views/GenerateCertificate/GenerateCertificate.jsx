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
import CryptoJS from "../../utils/crypto";

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
    constructor(props){
        super(props);
        
        this.captureFile=this.captureFile.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.onSubmitGenerate=this.onSubmitGenerate.bind(this);
        this.checkKey=this.checkKey.bind(this);
        this.getIssuerPrivateKey=this.getIssuerPrivateKey.bind(this);
        this.getReceiversAddress=this.getReceiversAddress.bind(this);
    }
    componentDidMount = async ()=>
    {
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
              console.log(accounts[0]);
            //   // Set web3, accounts, and contract to the state, and then proceed with an
            //   // example of interacting with the contract's methods.
               this.setState({ web3, accounts, contract: instance },this.checkKey);
               
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
        //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
        //set this buffer -using es6 syntax
        this.setState({ buffer });
        //console.log(this.state.buffer.toString());
        
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const {accounts,contract} = this.state;
        var hash = md5(this.state.buffer);
        console.log(hash);
        var key = new NodeRSA();
        key.importKey(this.state.issuerPrivateKey,'private');

        var digitalSignature = key.encryptPrivate(hash,'base64','utf8');
        console.log("ddd"+digitalSignature);
        //key.importKey('-----BEGIN PUBLIC KEY-----MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALp+eZTC0q9CqLYCU1z3uOpWjbINFyORAsU7HccJy1ln/cH1+6JLuxrF85X9THyHp0cNLEeB8O8shBADi9Ig96ECAwEAAQ==-----END PUBLIC KEY-----','public')
        //var has = key.decryptPublic(digitalSignature, 'utf8');
        //console.log(has);
        var data ;
             contract.methods.getLinks(accounts[0]).call().then(res => {
                 console.log(res)
             });
           console.log(data);
        await ipfs.add(this.state.buffer,(err,ipfsHash)=>{
            console.log(ipfsHash);
            const path =  "http://ipfs.io/ipfs/"+ipfsHash[0].path;
            console.log(path);
            this.setState({path : ipfsHash[0].path});
            contract.methods.addData(this.state.path,digitalSignature,this.state.receiverAddress,accounts[0]).send({from:accounts[0]});
            
        
        })
        
    };
    checkKey = async() => {
        const {accounts,contract} = this.state;
        const keyStatus = await contract.methods.checkPublicKey(accounts[0]).call();
        this.setState({keyStatus:keyStatus})
        console.log(keyStatus);
        
            
        
    }
    onSubmitGenerate = async(event) => {
        event.preventDefault();
        const {accounts,contract} = this.state;
        console.log("here")
        if(this.state.keyStatus == 0)
        {
            var keypair = new NodeRSA({b:512});
            
            //console.log(this.state.privateKey);
            

            await contract.methods.addPublicKey(keypair.exportKey('public'),accounts[0]).send({from:accounts[0]});
            this.setState({privateKey : keypair.exportKey('private')});
            var cipherKey = CryptoJS.AES.encrypt(this.state.privateKey, this.state.password);
            console.log(cipherKey);
        }
        

    }
    getReceiversAddress = async(event)=>{
        event.preventDefault();
        const {accounts,contract} = this.state;

        this.setState({receiverAddress : event.target.value});
        console.log(this.state.receiverAddress);
        var data ;
             contract.methods.getLinks(accounts[0]).call().then(res => {
                 console.log(res)
             });
           console.log(data);
    }
    getIssuerPrivateKey =  async(event)=>
    {
        const {accounts,contract} = this.state;
        event.preventDefault();
        this.setState({issuerPrivateKey: event.target.value});
        console.log(this.state.issuerPrivateKey);
        var publickey = await contract.methods.getPublicKey(accounts[0]).call();
        var key = new NodeRSA(this.state.issuerPrivateKey);
        var publickeyoe = key.exportKey('public');
        if(publickey === publickeyoe)
        {
            this.setState({keyMatch:true});
        }
        else{
            this.setState({keyMatch:"not your privatekey"});
        }
        console.log(this.state.keyMatch);
    }
    getPassword = async(event) =>
    {
        event.preventDefault();
        this.setState({password : event.target.value});
    }

    render() {
        if(this.state.keyStatus == 1)
        {
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
                                                        placeholder: "Enter Receivers Address",
                                                        onChange : this.getReceiversAddress
                                                    }
                                                },
                                                {
                                                    label: "Issuers Private Key",
                                                    inputProps: {
                                                        type: "textarea",
                                                        defaultValue:
                                                            "",
                                                        placeholder: "Enter Issuers Private Key",
                                                        onChange : this.getIssuerPrivateKey
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
        else
        {
            return (
                <div className="content">
                    <Row>
                        <Col xs={12}>
                        
                            <Card>
                                <CardHeader><CardTitle>Generate</CardTitle></CardHeader>
                                <CardBody>
                                    <h1>You haven't Generated a KeyPair yet</h1>
                                    <Form onSubmit={this.onSubmitGenerate}>
                                    
                                        <Button type='submit' color='primary' round>Generate keypair</Button>
                                    </Form>
                                    <h1>{this.state.privateKey}</h1>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div >
                
                
            );

        }
        
    }
}

export default CertificateGeneration;
