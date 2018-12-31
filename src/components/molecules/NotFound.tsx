import React      from "react";
import Typography from "@material-ui/core/Typography";
import styled     from "styled-components";

const emojiList = ["(＝△＝)", "(´・ω・`)", "(＿´Д｀)", "(= ‐ω‐ =)", "(*ノω・*)"];

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
            <Host
                {...this.props}
                unselectable={undefined}
            >
                <Typography
                    variant="display3"
                >
                    {this.state.emoji}
                </Typography>
                <Typography
                    variant="display1"
                >
                    Not Found
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
    > :nth-child(2) {
        margin-top: 1rem;
    }
`;
