import React from "react";
import Image from "./Image";
import styled from "styled-components";
import withProps from "../util/withProps";

interface PropsBase {
    defaultImageUrl?: string;
    hintText?: string;
    labelText?: string;
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

interface State {
    focused: boolean;
    imageUrl: string | undefined;
    invalid: boolean;
}

type Props = React.InputHTMLAttributes<HTMLInputElement> & PropsBase;

export default class extends React.Component<Props, State> {
    componentWillMount() {
        this.setState({
            focused : false,
            imageUrl: undefined,
            invalid : false
        });
    }

    render() {
        const {
            defaultImageUrl,
            disabled = false,
            height = "128",
            hintText = "",
            labelText,
            name,
            id = name,
            onBlur = () => undefined,
            onChange = () => undefined,
            onFocus = () => undefined,
            onLoad,
            width = "128",
            ...props
        } = this.props;

        return (
            <Host>
                <label
                    htmlFor={id}
                >
                    <LabelText
                        invalid={this.state.invalid}
                        focused={this.state.focused}
                        disabled={disabled}
                    >
                        {labelText}
                    </LabelText><br />
                    <StyledImage
                        alt={hintText}
                        height={height}
                        onLoad={onLoad}
                        src={this.state.imageUrl || defaultImageUrl}
                        width={width}
                    />
                </label>
                <StyledInput
                    accept="image/*"
                    disabled={disabled}
                    id={id}
                    name={name}
                    // tslint:disable-next-line:jsx-no-lambda
                    onChange={e => {
                        onChange(e);
                        if (this.state.imageUrl) {
                            URL.revokeObjectURL(this.state.imageUrl);
                        }
                        const file = e.target.files![0];
                        this.setState({
                            imageUrl: file && URL.createObjectURL(file)
                        });
                    }}
                    // tslint:disable-next-line:jsx-no-lambda
                    onBlur={e => {
                        onBlur(e);
                        this.setState({
                            focused: false,
                            invalid: !e.target.validity.valid
                        });
                    }}
                    // tslint:disable-next-line:jsx-no-lambda
                    onFocus={e => {
                        onFocus(e);
                        this.setState({
                            focused: true
                        });
                    }}
                    type="file"
                    {...props}
                />
            </Host>
        );
    }
}

const Host = styled.div`
    margin: 16px 0 8px 0;
`;

const StyledImage = withProps<React.ImgHTMLAttributes<HTMLImageElement>>()(styled(Image))`
    border: 1px solid #DDD;
    cursor: pointer;
`;

interface LabelTextProps {
    invalid: boolean;
    focused: boolean;
    disabled: boolean;
}

const LabelText = withProps<LabelTextProps>()(styled.span)`
    :not(:empty) {
        display      : inline-block;
        margin-bottom: 8px;
        font-size    : .75rem;
        transition   : all .3s ease-out;
        color        : ${(props:LabelTextProps) => (
                             props.invalid  ? "#F40"
                           : props.focused  ? "#2196F3"
                           : props.disabled ? "#DDD"
                           :                  "#777"
                        )};
    }
`;

const StyledInput = styled.input`
    display: none;
`;
