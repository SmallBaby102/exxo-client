/* eslint-disable no-unreachable */
import React from "react";
import { Row, Col, Progress, Table, Label, Input, Button } from "reactstrap";
import { connect } from "react-redux";

import s from "./Dashboard.module.scss";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
  const { themeColor, news } = this.props;
    return (
      <div className={s.root}>
       
        <div className="form-content">
            <h4 className={`page-title-${themeColor}`}>
              Change Backoffice Password
            </h4>
            <div>
            <strong>IMPORTANT!</strong> Please note, you are changing your <strong>Backoffice</strong> password. It is not the same thing as your MetaTrader password.
            </div>
            <Row>
                <Col lg={6} style={{ marginLeft: "10px" }}>
                      <div className="mt-2">
                        <Label>Enter your existing password *</Label>
                        <Input className="input-content" type="password" ></Input>
                      </div>
                      <div className="mt-3">
                        <Label>Enter your new password *</Label>
                        <Input className="input-content"  type="password" ></Input>
                      </div>
                      <div className="mt-3">
                        <Label>Repeat your new password *</Label>
                        <Input className="input-content"  type="password" ></Input>
                      </div>
                      <div className="mt-3">
                        <Button className="input-content btn-info">Change</Button>
                      </div>
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
    news: store.post.news
  };
}
export default connect(mapStateToProps)(Dashboard);
