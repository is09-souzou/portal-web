import React          from "react";
import { Typography } from "@material-ui/core";
import styled         from "styled-components";

const emojiList = ["(・－・)・・・", "(ノд・。) ", "(´；ω；`)", "(´･д･`)", "( ´･ω･)´･ω)(ω･`(･ω･` )"];

interface State {
    emoji: string;
}

export default class extends React.Component<React.HTMLAttributes<HTMLDivElement>, State> {
    componentWillMount() {
        this.setState({
            emoji: emojiList[Math.floor(Math.random() * emojiList.length)]
        });
    }

    render() {
        return (
            <Host {...this.props}>
                <Typography
                    variant="display4"
                >
                    {this.state.emoji}
                </Typography>
                <Typography
                    variant="display3"
                >
                    Oops! Something is wrong...
                </Typography>
            </Host>
        );
    }
}

const Host = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: inherit;
`;
