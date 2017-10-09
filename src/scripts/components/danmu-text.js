import React from 'react';
import pureRender from 'pure-render-decorator'

class DanmuText extends React.Component {
    constructor(props) {
        super(props)
        this.displayName = 'DanmuText'
        this.state = {}
    }
    componentDidMount() {
        this.moving(this.props)
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.pause && !nextProps.pause) {
            this.moving(nextProps)
        } else if (!this.state.style) {
            this.moving(nextProps)
        }
    }
    setStyle(props) {
        let {pause, width, begin, total, opacity, item} = props
        var time = new Date().getTime() - begin - (item.time || 0)
        if (time < 0 || time > total) return
        var size = item.size || 16
        var spanWidth = size * item.text.length
        var parentWidth = width + spanWidth
        if (pause || !this.state.style) {
            this.state.style = {
                "color": item.color || "white",
                "textShadow": " 0px 0px 2px #000000",
                "opacity": opacity,
                "whiteSpace": "nowrap",
                "fontWeight": "bold",
                "fontFamily": "SimHei",
                "fontSize": size,
                "transition": pause ? 'none' : `all ${total - time}ms linear`,
                "position": "absolute",
                "left": parentWidth * (total - time) / total - spanWidth,
                "top": 0,
            }
        }
    }
    moving(props) {
        let {pause, width, begin, total, opacity, item} = props
        var time = new Date().getTime() - begin - (item.time || 0)
        if (time > total) return
        if (time < 0) {
            setTimeout(() => {
                this.moving(this.props)
            }, -time)
            return
        }
        console.log("moving")
        this.setStyle(props)
        this.setState({})
        setTimeout(() => {
            var style = this.state.style
            var item = props.item
            var size = item.size || 16
            var spanWidth = size * item.text.length
            style = Object.assign({}, style, { left: -spanWidth })
            console.log(style)
            this.setState({ style })
        }, 1500)
    }
    render() {
        let {pause, width, begin, total, opacity, item} = this.props
        var time = new Date().getTime() - begin - (item.time || 0)
        if (time < 0 || time > total) return null
        console.log(this.state.style)
        return <span style={ this.state.style }>{ item.text }</span>
    }
}

DanmuText.defaultProps = {
    pause: false,
    width: window.innerWidth,
    begin: 0,
    total: 6000,
    opacity: 0.9,
    item: { text: "" },
}

export default pureRender(DanmuText)
