/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Button, Table, Label } from "reactstrap";
import axios from "axios";
import { setChecking } from '../../actions/navigation'
import { connect } from "react-redux";
import Select from "react-select";
import s from "./Accounts.module.scss";
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

class Commission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      original_transactions: [],
      transactions: [],
      sdate: "",
      edate: "",
      total_amount: 0,
    };
  }

  componentDidMount() {
    // get given parent trading account's deposit list
    const email = this.props.account.email;
    const tradingAccountUuid = this.props.account?.ibParentTradingAccountUuid;
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/ib-parent-trading-account-deposits`, { params: { tradingAccountUuid, email }})
    .then( async result => {
      this.props.dispatch(setChecking(false));
      console.log("Commission Transaction List", result);
      this.setState({ transactions: result.data}); 
      this.setState({ original_transactions: result.data});

      let tamount = 0;
      result.data && result.data?.map((row) => {
        tamount += row.amount;
      });
      this.setState({total_amount: Number(tamount).toFixed(2)});
    }) 
    .catch(e => {
      this.props.dispatch(setChecking(false));
      console.log(e);
    })

    let today = new Date();
    this.setState({sdate: (today.getMonth() + 1) + "/" + today.getDate() + "/" + (today.getFullYear() - 10 )});
    this.setState({edate: (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear()});

  }

  searchTransaction(sd, ed) {
    let s_date = new Date(sd);
    let e_date = new Date(ed);
    s_date = s_date.getFullYear() + "-" + (s_date.getMonth() < 10? "0" + (s_date.getMonth() + 1):(s_date.getMonth() + 1) ) + "-" + (s_date.getDate() < 11? "0" + s_date.getDate():s_date.getDate()) + "T00:00:00.000Z";
    e_date = e_date.getFullYear() + "-" + (e_date.getMonth() < 10? "0" + (e_date.getMonth() + 1):(e_date.getMonth() + 1) ) + "-" + (e_date.getDate() < 11? "0" + e_date.getDate():e_date.getDate()) + "T23:59:00.000Z";
    let s_transactions = this.state.original_transactions.filter(item => {      
      if ( item.updated <= e_date && item.updated >= s_date ) return true;
      else return false;
    });   

    this.setState({transactions: s_transactions });
  }

  render() {
  const { themeColor } = this.props;
  const { transactions, sdate, edate, total_amount } = this.state;
    return (
      <div className={s.root}>
         <div className="form-content">
              <h4 className={`page-title-${themeColor}`}>
                IB Commissions
              </h4>
              <Row>
                <Col md={3} className="c_padd_right_0">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disableFuture
                      openTo="day"
                      views={['year', 'month', 'day']}
                      value={sdate}
                      onChange={(newValue) => {
                        this.setState({ sdate: newValue });
                        this.searchTransaction(newValue, edate);
                      }}
                      renderInput={(params) => <TextField {...params}  
                      sx={{
                        '.MuiInputBase-input': { height: "35px", padding: "0px 0 0 10px", width: "100%", },
                      }}
                    />}
                    />
                  </LocalizationProvider> 
                </Col>
                <Col md={1} className="text-center c_padd_left_0 c_padd_right_0"> ~ </Col>
                <Col md={3} className="c_padd_left_0 c_padd_right_0">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disableFuture
                      openTo="day"
                      views={['year', 'month', 'day']}
                      value={edate}
                      onChange={(newValue) => {
                        this.setState({ edate: newValue });
                        this.searchTransaction(sdate, newValue);
                      }}
                      renderInput={(params) => <TextField {...params}  
                      sx={{
                        '.MuiInputBase-input': { height: "35px", padding: "0px 0 0 10px", width: "100%", },
                      }}
                    />}
                    />
                  </LocalizationProvider> 
                </Col>
                <Col md={5} className="c_commission_total_col">Total Amount: <strong>{total_amount} USD</strong></Col>
              </Row>
              <div className={s.overFlow}>
                <label></label>
                <Table lg={12} md={12} sm={12} striped>
                  <thead>
                    <tr className="fs-sm">
                      <th className="hover-overlay hover-zoom hover-shadow ripple">Id</th>
                      <th>Payment Gateway Name</th>
                      <th>Payment Method</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created Datetime</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.transactions && this.state.transactions?.map((row) => (
                      <tr className="c_accounts_tr" key={row.uuid} onDoubleClick={(e) => this.accountDetail(row.login)} >
                        <td >{ row.uuid }</td>
                        <td>{ row.paymentGatewayName }</td>
                        <td>{row.paymentMethod}</td>
                        <td>{row.amount}</td>
                        <td>{row.status}</td>
                        <td>{row.updated}</td>
                      </tr>
                    ))}
                    {
                      this.state.transactions === "" && 
                        <tr>
                          <td colSpan={10} className="text-center">There is not any deposit transaction history.</td>
                        </tr>
                    }
                  </tbody>
                </Table>
              </div>              
          </div>
      </div>
    );
  }
}
function mapStateToProps(store) {
  return {
    themeColor: store.navigation.themeColor,
    account: store.auth.account,
  };
}
export default connect(mapStateToProps)(Commission);