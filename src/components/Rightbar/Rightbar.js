import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Progress, Alert} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {dismissAlert} from '../../actions/alerts';
import s from './Rightbar.module.scss';
import LinksGroup from './LinksGroup';
import {changeActiveSidebarItem} from '../../actions/navigation';
import {logoutUser} from '../../actions/user';



class Rightbar extends React.Component {
    static propTypes = {
        sidebarStatic: PropTypes.bool,
        sidebarOpened: PropTypes.bool,
        dispatch: PropTypes.func.isRequired,
        activeItem: PropTypes.string,
        location: PropTypes.shape({
            pathname: PropTypes.string,
        }).isRequired,
    };

    static defaultProps = {
        sidebarStatic: false,
        activeItem: '',
    };
    constructor(props) {
        super(props);
        this.state = {
            timer: '00:00:00',
            Ref: null,
        }
        this.doLogout = this.doLogout.bind(this);
    }
    getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }
    startTimer = (e) => {
        let { total, hours, minutes, seconds } 
                    = this.getTimeRemaining(e);
        if (total >= 0) {
    
            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            this.setState({
                timer: (hours > 9 ? hours : '0' + hours) + ':' +
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            })
        }
     }
 
 
     clearTimer = (e) => {
 
         // If you adjust it you should also need to
         // adjust the Endtime formula we are about
         // to code next    
         this.setState({ timer: '00:10:00' });
 
         // If you try to remove this line the 
         // updating of timer Variable will be
         // after 1000ms or 1sec
         if (this.state.Ref) clearInterval(this.state.Ref);
         const id = setInterval(() => {
             this.startTimer(e);
         }, 1000)
         this.setState({Ref:  id});
     }
 
     getDeadTime = (minutes) => {
         let deadline = new Date();
 
         // This is where you need to adjust if 
         // you entend to add more time
         deadline.setMinutes(deadline.getMinutes() + minutes);
         return deadline;
     }

    componentDidMount() {
        this.clearTimer(this.getDeadTime(10));
        this.element.addEventListener('transitionend', () => {
            if (this.props.sidebarOpened) {
                this.element.classList.add(s.sidebarOpen);
            }
        }, false);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sidebarOpened !== this.props.sidebarOpened) {
            if (nextProps.sidebarOpened) {
                this.element.style.height = `${this.element.scrollHeight}px`;
            } else {
                this.element.classList.remove(s.sidebarOpen);
                setTimeout(() => {
                    this.element.style.height = '';
                }, 0);
            }
        }
    }

    dismissAlert(id) {
        this.props.dispatch(dismissAlert(id));
    }

    doLogout() {
        this.props.dispatch(logoutUser());
    }

    render() {
        return (
            <nav
                className={cx(s.root)}
                ref={(nav) => {
                    this.element = nav;
                }}
            >
                <header className={s.logo}>
                    {/* eslint-enable */}
                    <span className="fw-semi-bold">
                        {this.state.timer}
                    </span>
                </header>
               
                <div>
                    {this.props.alertsList.map(alert => // eslint-disable-line
                        <div
                            key={alert.id}
                            className={s.sidebarAlert} 
                            color="transparent"
                            isOpen={true} // eslint-disable-line
                            toggle={() => {
                                this.dismissAlert(alert.id);
                            }}
                        >
                            <span>{alert.title}</span><br/>
                            <Progress className={`bg-subtle-blue progress-xs mt-1`} color={alert.color}
                                      value={alert.value}/>
                            <span className={s.alertFooter}>{alert.footer}</span>
                        </div>,
                    )}
                </div>
            </nav>
        );
    }
}

function mapStateToProps(store) {
    return {
        sidebarOpened: store.navigation.sidebarOpened,
        sidebarStatic: store.navigation.sidebarStatic,
        alertsList: store.alerts.alertsList,
        activeItem: store.navigation.activeItem,
    };
}

export default withRouter(connect(mapStateToProps)(Rightbar));
