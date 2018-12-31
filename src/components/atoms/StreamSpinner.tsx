import CircularProgress, { CircularProgressProps } from "@material-ui/core/CircularProgress";
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

interface State {
    visible: boolean;
    onScroll: () => void;
}

interface Props extends CircularProgressProps {
    onVisible: () => void;
    disable: boolean;
}

export default class extends React.Component<Props, State> {

    state: State = {
        onScroll: () => {
            if (!this.props.disable) {
                const rect = (ReactDOM.findDOMNode(this) as Element).getBoundingClientRect();
                if (rect.top < window.innerHeight && !this.state.visible) {
                    this.props.onVisible();
                    this.setState({ visible: true });
                } else if (this.state.visible) {
                    this.setState({ visible: false });
                }
            }
        },
        visible: false
    };

    componentDidMount() {
        this.state.onScroll();
        window.addEventListener("scroll", this.state.onScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.state.onScroll, false);
    }

    render () {

        const {
            onVisible,
            disable,
            ...props
        } = this.props;

        if (disable)
            return null;

        return(
            <Host>
                <CircularProgress {...props}/>
            </Host>
        );
    }
}

const Host = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3rem 0;
`;
