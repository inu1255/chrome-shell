import React from 'react';
import ReactDOM from 'react-dom'
import DanmuText from './danmu-text.js'

const danmu_container = {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointEvent: 'auto',
    zIndex: 99999,
}

class Danmu extends React.Component {
    constructor(props) {
        super(props)
        this.displayName = 'Danmu'
        this.state = {
            data: props.data,
            begin: 0
        }
    }
    componentDidMount() {
        this.state.begin = new Date().getTime()
        var dom = ReactDOM.findDOMNode(this)
        this.state.width = dom.childNodes[0].clientWidth
        this.state.height = dom.childNodes[0].clientHeight
        this.timer = setInterval(() => this.setState({}), 100)
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    renderItem = (item, i) => {
        let {width, begin} = this.state
        let {pause, total, opacity} = this.props
        let props = { item, pause, total, opacity, width, begin, }
        return <DanmuText key={ i } {...props}></DanmuText>
    }
    render() {
        let {data} = this.state
        return (
            <div>
                <div style={ danmu_container }>
                    { data.map(this.renderItem) }
                </div>
            </div>
        )
    }
}

Danmu.defaultProps = {
    data: [],
    opacity: 0.9,
    total: 6000
}

export default Danmu
