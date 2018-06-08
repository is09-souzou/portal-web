import React from "react";
import styled from "styled-components";

export default class extends React.Component {

    componentWillMount() {
        this.setState({
            userMenuAnchorEl: undefined,
            userMenuOpend: false
        });
    }

    render() {
        return (
            <Host>
                testtest
            </Host>
        );
    }
}

const Host = styled.form`
    margin: 3rem;
    display: flex;
    flex-wrap: wrap;
`;
