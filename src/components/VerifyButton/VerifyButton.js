import React from 'react';
import s from './Widget.module.scss';
import { Link } from 'react-router-dom';


class Widget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }

  }

  render() {
    return (
        <React.Fragment>
            <Link to="/app/profile/verify" className={s.root}>
              <div className = {s.item_icon}></div>
              <div className = {s.item_title}>Verify your profile</div>
            </Link>
        </React.Fragment>
    );
  }
}

export default Widget;
