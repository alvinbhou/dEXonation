import React from 'react';
import { Input, Row, Col, Form, Icon, Card, Button, Alert, Avatar, message} from 'antd';
import { web3, web3metamask } from 'utils/web3';
import { findGetParameter } from 'utils/util';
import { DonateContractMetamask, DonateContract } from 'contracts/contract';
import Header from 'components/Header';
import Footer from 'components/Footer';
import 'styles/donate.scss';

const FormItem = Form.Item;
const { TextArea } = Input;

class DonateForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showMetamaskError: false,
      showNetworkWarning: false
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let that = this;
    console.log(web3metamask);
    this.props.form.validateFields((err, values) => {
      if (!err && web3metamask) {
        console.log(123);
        /* check metamask login status */
        web3metamask.eth.getAccounts().then(e => {
          console.log(e);
          if(e.length == 0){
            that.setState({showMetamaskError: true});
          }
          else{
            that.setState({showMetamaskError: false});
            that.donateCall(values, e[0]);
          }
        });
      } else {
        that.setState({showMetamaskError: true});
      }
    })
  }

  donateCall = (values, addr) => {
    let that = this;
    let donateTransactionOptions = {
      from: addr,
      gas: 800000,
      gasPrice: web3.utils.toWei("30", 'gwei'),
      value: web3.utils.toWei(String(values.damount), 'ether')
    }
    console.log(donateTransactionOptions);
    DonateContractMetamask.methods.donate(values.daddr, values.ddonor, values.dmssg).send(donateTransactionOptions,function(error, result){
      if (!error) {
        message.success(<span> View on <a href={`${ETHERSCAN_URL}/`+`transaction/${result}`}>DEXSCAN</a></span>, 8);
        console.log('r', result)
      } else {
        console.log('e', error)
      }
    });
  }

  componentDidMount () {
    this.props.form.setFieldsValue({
      daddr: findGetParameter('addr')
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
      <Header/>
      <Row
        className = 'main-bg-color'
        style={{
          paddingBottom: '80px',
          minHeight: '90vh',
          marginTop: '-1px'
        }}
        type="flex"
        justify="space-around"
        align="middle"
      >
        <Col style={{
          width: '55vh'
        }}>
          <Card className="DonateMainCard" title={
            <div>
              <Avatar size={42} src="https://i.imgur.com/vhNAxeY.png"/> 
              <span> Donate Information</span>
            </div>
          } style ={{marginTop: '12%'}}>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <div> Streamer's Address </div>
              <FormItem>
                {getFieldDecorator('daddr', {
                  rules: [{ required: true, message: `Please input the streamer's wallet address!` }]
                })(
                  <Input prefix={<Icon type="wallet" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="Address"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('ddonor', {
                  rules: [{ required: true, message: 'Please input your donate username' }]
                })(
                  <Input maxLength="30" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Donor Username" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('damount', {
                  rules: [{ required: true, message: 'Please input the amount of DXN' }]
                })(
                  <Input type="text" pattern="[0-9.]*" prefix={<Icon type="red-envelope" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="0.00 DXN" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('dmssg', {
                  rules: [{ required: true, message: 'Please say something :o' }]
                })(
                  <TextArea maxLength="100" prefix={<Icon type="red-envelope" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Donate messages (100 characters)" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Donate
                </Button>
              </FormItem>
            </Form>
            { this.state.showMetamaskError ? <div
              style = {{marginBottom: '10px'}}
              justify="space-around"
            > <Alert
                message="DekuSan not login"
                description={ <div>Please ensure you have installed <a href="https://dexon.org/faucet">DekuSan Wallet</a> and login </div>}
                type="error"
                showIcon
              /></div> : null }
            { this.state.showNetworkWarning ? <div> <Alert
              message="Network warning"
              description= { <div>Please switch to {NETWORK_NAME} </div>}
              type="warning"
              showIcon
            /> </div> : null }
          </Card>
        </Col>
      </Row>
      <Footer/>
      </div>
    )
  }
}

var TCount = 0

function DonateQuick(to_addr, key, v, donorArray, msgArray, i, interval) {
  let ret = web3.eth.accounts.privateKeyToAccount(key)
  console.log(web3.eth.getTransactionCount(ret.address)+1)
  web3.eth.getTransactionCount(ret.address).then(count => {
    for(let j = 0; j < i; ++j) {
      console.log(count)
      let donor = donorArray[Math.floor(Math.random() * donorArray.length)]
      console.log(donor)
      let msg = msgArray[Math.floor(Math.random() * msgArray.length)]
      let encoded = DonateContract.methods.donate(to_addr, donor, msg).encodeABI()
      let rawTransaction = {
        nonce: count,
        from: ret.address,
        to: CONTRACT_ADDRESS,
        value: web3.utils.toWei(String((v*Math.random()*2).toFixed(5)), 'ether'),
        gas: 2000000,
        gasPrice: '40',
        data: encoded,
      }
      console.log(rawTransaction)
      ret.signTransaction(rawTransaction, function(error, result){
        if(error) {
          console.log("Failed signing transaction: ", error)
        } else {
          console.log(result.rawTransaction)
          web3.eth.sendSignedTransaction(result.rawTransaction, function(error, result){
            if(error) {
              console.log(error)
            } else {
              console.log(result)
            }
          })
        }
      })
      count += 1
    }
  })
}

window.dq = DonateQuick

const WrappedDonateForm = Form.create()(DonateForm)
export default WrappedDonateForm
