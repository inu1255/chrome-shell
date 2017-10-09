import ext from "../utils/ext";
import storage from "../utils/storage";
import React from 'react';
import { Button, Input, Tabs } from 'antd'
const TabPane = Tabs.TabPane;

function sendLogin(user) {
    ext.runtime.sendMessage({ action: "login", user });
}
chrome.runtime.sendMessage({ greeting: 'hello' });
class App extends React.Component {
    constructor(props) {
        super(props)
        this.displayName = 'App'
        this.state = {
            user: {},
            current: {
                email: "",
                username: "未登录",
            },
            activeKey: "2"
        }
    }
    componentDidMount() {
        storage.get("user", ({user}) => {
            if (user && user.email) {
                this.setState({ current: user, activeKey: "1" })
                sendLogin(user)
            }
        })
    }
    success(user) {
        storage.set({ user }, () => {
            this.setState({ loging: false, current: user, activeKey: "1" })
            sendLogin(user)
        })
    }
    logout = () => {
        storage.set({ user: {} }, () => {
            this.setState({ current: {}, activeKey: "2" })
            sendLogin({})
        })
    }
    change(k, e) {
        this.state.user[k] = e.target.value
        this.setState({})
    }
    setEmail = this.change.bind(this, 'email')
    setPassword = this.change.bind(this, 'password')
    setUsername = this.change.bind(this, 'username')
    error = (user, error) => {
        this.setState({ loging: false, error: error.message })
        setTimeout(() => this.setState({ error: "" }), 5000)
    }
    onLogin = () => {
        var v = this.state.user
        this.setState({ loging: true })
        Bmob.User.logIn(v.email, v.password, {
            success: (user) => {
                v.username = user.get("username")
                this.success(v)
            },
            error: this.error
        });
    }
    onRegist = () => {
        this.setState({ loging: true })
        var v = this.state.user
        var user = new Bmob.User();
        user.set("username", v.username);
        user.set("password", v.password);
        user.set("email", v.email);

        user.signUp(null, {
            success: (user) => {
                console.log(user)
                this.success(v)
            },
            error: this.error
        });
    }
    render() {
        var {user, current} = this.state
        return (
            <div className="app-container">
                <span style={ { display: 'block' } }>登录成功后刷新页面，可以在页面右下角发弹幕</span>
                <Tabs activeKey={ this.state.activeKey } onChange={ (activeKey) => this.setState({ activeKey }) }>
                    <TabPane tab="当前用户" key="1">
                        <span style={ { display: 'block' } }>昵称: { current.username }</span>
                        <span style={ { display: 'block' } }>邮箱: { current.email }</span>
                        <Button disabled={ !current.email } onClick={ this.logout } style={ { width: '100%' } }>
                            注销
                        </Button>
                    </TabPane>
                    <TabPane tab="登录" key="2">
                        <Input value={ user.email } onChange={ this.setEmail } placeholder="邮箱"></Input>
                        <Input type='password'
                               value={ user.password }
                               onChange={ this.setPassword }
                               placeholder="密码"></Input>
                        <span>{ this.state.error }</span>
                        <Button loading={ this.state.loging }
                                disabled={ !(user.password && user.email) }
                                onClick={ this.onLogin }
                                style={ { width: '100%' } }>
                            登录
                        </Button>
                    </TabPane>
                    <TabPane tab="注册" key="3">
                        <Input value={ user.username } onChange={ this.setUsername } placeholder="用户名"></Input>
                        <Input value={ user.email } onChange={ this.setEmail } placeholder="邮箱"></Input>
                        <Input type='password'
                               value={ user.password }
                               onChange={ this.setPassword }
                               placeholder="密码"></Input>
                        <span>{ this.state.error }</span>
                        <Button loading={ this.state.loging }
                                disabled={ !user.username && user.password && user.email }
                                onClick={ this.onRegist }
                                style={ { width: '100%' } }>
                            注册
                        </Button>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default (App)
