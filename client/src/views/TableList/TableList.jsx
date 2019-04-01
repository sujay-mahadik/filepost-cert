import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";

import { thead, tbody } from "variables/general";
import getWeb3 from "../../utils/getWeb3";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
class RegularTables extends React.Component {
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
        console.log(accounts[0]);
        //   // Set web3, accounts, and contract to the state, and then proceed with an
        //   // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract: instance },this.getData);
        

        //  
    } catch (error) {
        //   // Catch any errors for any of the above operations.
        alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.log('called');
    }
};
getData = async()=>
{
  const { accounts, contract } = this.state;
    var data = await contract.methods.getLinks(accounts[0]).call();
    
    this.setState({data :data});
    console.log(this.state.data)
}

  render(){
    
    
    return (
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Simple Table</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      {thead.map((prop, key) => {
                        if (key === thead.length - 1)
                          return (
                            <th key={key} className="text-right">
                              {prop}
                            </th>
                          );
                        return <th key={key}>{prop}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {tbody.map((prop, key) => {
                      return (
                        <tr key={key}>
                          {prop.data.map((prop, key) => {
                            if (key === thead.length - 1)
                              return (
                                <td key={key} className="text-right">
                                  {prop}
                                </td>
                              );
                            return <td key={key}>{prop}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          
        </Row>
      </div>
    );
  }
}

export default RegularTables;
