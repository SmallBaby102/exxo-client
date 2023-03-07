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

    // this.searchTransaction = this.searchTransaction.bind(this);

  }

  componentDidMount() {
    // get given parent trading account's deposit list
    const email = this.props.account.email;
    const tradingAccountUuid = this.props.account?.ibParentTradingAccountUuid;
    this.props.dispatch(setChecking(true));
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/ib-parent-trading-account-deposits`, { params: { tradingAccountUuid, email}} )
    .then(async result => {
      this.props.dispatch(setChecking(false));
      console.log("Commission Transaction List", result.data);
      let tamount = 0;
      result.data && result.data?.map((row) => {
        tamount += Number(row.amount);
      });
      console.log("tamount:", tamount);
      let today = new Date();

      this.setState({ 
        ...this.state,
        transactions: result.data,
        original_transactions: result.data,
        total_amount: Number(tamount/100).toFixed(2)
        
      }); 
    }) 
    .catch(e => {
      this.props.dispatch(setChecking(false));
      console.log(e);
    })

  }

  searchTransaction(sd, ed) {
    let s_date = new Date(sd);
    let e_date = new Date(ed);
    let s_transactions = this.state.original_transactions.filter(item => {      
      if ( item.generatedTime <= e_date.getTime() && item.generatedTime >= s_date.getTime() ) return true;
      else return false;
    });       
    console.log("s_transactions:", s_transactions);
    console.log(e_date, s_date);
    this.setState({
      ...this.state,
      s_date:sd, 
      e_date:ed,
      transactions: s_transactions 
    });

  }

  onClickLastWeek() {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    let s_date = ( lastWeek.getMonth() + 1 ) + "/" + lastWeek.getDate() + "/" + lastWeek.getFullYear();
    let e_date = ( today.getMonth() + 1 ) + "/" + today.getDate() + "/" + today.getFullYear();
  
    this.searchTransaction(s_date, e_date);
  };

  onClickLastMonth() {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    let s_date = ( lastWeek.getMonth() + 1 ) + "/" + lastWeek.getDate() + "/" + lastWeek.getFullYear();
    let e_date = ( today.getMonth() + 1 ) + "/" + today.getDate() + "/" + today.getFullYear();
    this.setState({sdate: s_date});
    this.searchTransaction(s_date, e_date);
  };

  render() {
    const { transactions, sdate, edate, total_amount } = this.state;
   
  const { themeColor } = this.props;
    return (
      <div className={s.root}>
         <div className="form-content">
              <h4 className={`page-title-${themeColor}`}>
                IB Commissions
              </h4>
              <Row>
                <Col md={2} className="c_padd_right_0">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disableFuture
                      openTo="day"
                      views={['year', 'month', 'day']}
                      value={String(this.state.s_date)}
                      onChange={(newValue) => {
                        this.searchTransaction(newValue, this.state.e_date);
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
                <Col md={2} className="c_padd_left_0 c_padd_right_0">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disableFuture
                      openTo="day"
                      views={['year', 'month', 'day']}
                      value={String(this.state.e_date)}
                      onChange={(newValue) => {
                        this.searchTransaction(this.state.s_date, newValue);
                      }}
                      renderInput={(params) => <TextField {...params}  
                      sx={{
                        '.MuiInputBase-input': { height: "35px", padding: "0px 0 0 10px", width: "100%", },
                      }}
                    />}
                    />
                  </LocalizationProvider> 
                </Col> 
                <Col md={4}> 
                  <Button className="input-content btn-success" onClick={() => this.onClickLastWeek()}>Last Week</Button> &nbsp; 
                  <Button className="input-content btn-success" onClick={() => this.onClickLastMonth()}>Last Month</Button>
                </Col> 
                <Col md={3} className="c_commission_total_col">Total Amount: <strong>{this.state.total_amount} USD</strong></Col>
              </Row>
              <div className={s.overFlow}>
                <label></label>
                <Table lg={12} md={12} sm={12} striped>
                  <thead>
                    <tr className="fs-sm">
                      <th className="hover-overlay hover-zoom hover-shadow ripple">Id</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    { 
                      transactions.map((row, i) => {
                        
                        return(<tr className="c_accounts_tr" key={row.uuid} onDoubleClick={(e) => this.accountDetail(row.login)} >
                          <td >{ row.clientId }</td>
                          <td>{String(new Date(Number(row.generatedTime)))}</td>
                          <td>{row.amount/100}</td>
                          <td>{row.comment}</td>
                        </tr>)
                      }
                      )
                    }
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