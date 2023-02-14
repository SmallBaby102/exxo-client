/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Button , Label, Input,Spinner } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import s from "./Deposit.module.scss";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Link, withRouter } from "react-router-dom";
import { AiOutlineCopy } from "react-icons/ai";
import { Snackbar } from "@mui/material";
import ReactSelect from "react-select";

import { setChecking } from '../../actions/navigation'
import { toast } from "react-toastify";

class StacoinexResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      timer: '00:00:00',
      minutes: 10,
      seconds: 0,
    };
  }
 
  
  componentDidMount() {
    this.myInterval = setInterval(() => {
      const { seconds, minutes } = this.state

      if (seconds > 0) {
          this.setState(({ seconds }) => ({
              seconds: seconds - 1
          }))
      }
      if (seconds === 0) {
          if (minutes === 0) {
              clearInterval(this.myInterval)
          } else {
              this.setState(({ minutes }) => ({
                  minutes: minutes - 1,
                  seconds: 59
              }))
          }
      } 
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.myInterval)
  }
  render() {
  const { themeColor, result } = this.props;
  const { minutes, seconds } = this.state;
    return (
      <div className={s.root}>
        
          <div className="form-content">
              <h6 className={`page-title-${themeColor}`}>
                Vui lòng mở ứng dụng Mobile Banking bất kỳ để quét mã QR.
                Lưu ý: Nhập chính xác số tiền và nội dung bên dưới khi chuyển khoản
                (tất cả thông số sẽ được điền tự động khi quét mã QR bên dưới)
              </h6>
              <br/>
              <Row className="mt-2">
                  <Col md={12} className="d-flex align-items-center">
                      <Label><strong >Nội dung chuyển khoản : {result?.bankTransfer.transfer_code} </strong></Label>
                  </Col>
              </Row>
              <Row>
                  <Col md={12}>
                        <h6 className="mt-3">Vui lòng thực hiện chuyển khoản trong vòng 10 phút. Sau thời gian này, yêu cầu gửi tiền của bạn sẽ bị hủy : 
                        <br/>
                        <br/>
                        <strong style={{ fontSize: "1.2rem"}}>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</strong></h6>
                  </Col>
                  <Col md={12} className="text-center">
                        <ImageList sx={{ width: "100%", height: "94%", marginTop: 2}} cols={4}>
                            {result?.listBank?.map((item) => (
                                <ImageListItem key={item.id}  sx={{ width: 200 }}  >
                                    <img
                                        src={`${item.qr_code_url}`}
                                        srcSet={`${item.qr_code_url}`}
                                        alt={item.code}
                                        loading="lazy"
                                        
                                    />
                                    <ImageListItemBar
                                        title={item.name}
                                        subtitle={<span>Id: {item.account_no}</span>}
                                        position="below"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                  </Col>
              </Row>
          </div>
        
      </div>
    );
  }
}
function mapStateToProps(store) {
  return {
    themeColor: store.navigation.themeColor,
    account: store.auth.account
  };
}
export default withRouter(connect(mapStateToProps)(StacoinexResult));