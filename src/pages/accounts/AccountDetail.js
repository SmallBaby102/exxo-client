/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Button, Table, Label, Badge, Input, FormGroup, InputGroup } from "reactstrap";
import axios from "axios";
import { setChecking } from '../../actions/navigation'
import { connect } from "react-redux";
import Select from "react-select";
import s from "./Accounts.module.scss";
import { toast } from "react-toastify";

class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tradingAccountId: null,
      account: "",
    };
    this.back = this.back.bind(this);
  }
  back() {
    this.props.history.goBack();
  }
 
  componentDidMount() {
    if(this.props.account?.verification_status !== "Approved")
    {
      this.props.history.push(`/app/profile/verify`);
      return;
    }
    const { match } = this.props;
    const tradingAccountId = match.params?.id;
    this.setState({ tradingAccountId })
    const systemUuid = match.params?.systemUuid;
    this.props.dispatch(setChecking(true));
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/tradingAccount/balance`, { params: { tradingAccountId, systemUuid, partnerId: this.props.account?.partnerId }})
    .then( async result => {
      this.props.dispatch(setChecking(false));
      this.setState({ account: result.data})
    }) 
    .catch(e => {
      this.props.dispatch(setChecking(false));
      console.log(e);
    })
  }
  render() {
  const { themeColor } = this.props;
  const { account, tradingAccountId } = this.state;
    return (
      <div className={s.root}>
         <div className="form-content">
              <h4 className={`page-title-${themeColor} mb-4`}>
                Account Detail
              </h4>
              <Table lg={12} md={12} sm={12} striped>
                <tbody>
                    <tr >
                      <td>
                        Account Number
                      </td>
                      <td>{ tradingAccountId }</td>
                    </tr>
                    <tr >
                      <td>
                        Account Type
                      </td>
                      <td>{ tradingAccountId }</td>
                    </tr>
                    <tr >
                      <td>
                        Label
                      </td>
                      <td>{ tradingAccountId }</td>
                   </tr>
                    <tr >
                      <td>
                        Credit
                      </td>
                      <td>{ account?.credit }</td>
                   </tr>
                    <tr >
                      <td>
                        Balance
                      </td>
                      <td>{ account?.balance } USD</td>
                   </tr>
                    <tr >
                      <td>
                        Free Margin
                      </td>
                      <td>{ account?.freeMargin } USD</td>
                   </tr>
                    <tr >
                      <td>
                        Equity
                      </td>
                      <td>{ account?.equity } USD</td>
                   </tr>
                    <tr >
                      <td>
                        Margin Level
                      </td>
                      <td>{ account?.marginLevel }</td>
                   </tr>
                </tbody>
              </Table>
          </div>
          <div className={s.buttonGroup}>
                <Button className="btn-info sm" onClick={this.back}>Back</Button>
          </div>
      </div>
    );
  }
}
function mapStateToProps(store) {
  return {
    themeColor: store.navigation.themeColor,
    account: store.auth.account,
    tradingAccounts: store.auth.tradingAccounts,
    offerNames: store.auth.offerNames,
  };
}
export default connect(mapStateToProps)(Accounts);