import React  from "react";
import styled from "styled-components";
import Image  from "./Image";

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

export type ImageInputProps = React.InputHTMLAttributes<HTMLInputElement> & PropsBase;

export default class extends React.Component<ImageInputProps, State> {
    componentWillMount() {
        this.setState({
            focused : false,
            imageUrl: undefined,
            invalid : false
        });
    }

    render() {
        const {
            className,
            defaultImageUrl,
            disabled = false,
            height = "",
            hintText = "",
            labelText,
            name = String(Math.random()),
            onBlur = () => undefined,
            onChange = () => undefined,
            onFocus = () => undefined,
            onSubmit = () => undefined,
            onLoad,
            width = "",
            ...props
        } = this.props;

        const id = this.props.id ? this.props.id : name;

        return (
            <Host
                className={className}
            >
                <StyledLabel
                    htmlFor={id}
                >
                    {labelText &&
                        <LabelText
                            invalid={this.state.invalid}
                            focused={this.state.focused}
                            disabled={disabled}
                        >
                            {labelText}
                        </LabelText>
                    }
                    <StyledImage
                        alt={hintText}
                        height={height}
                        onLoad={onLoad}
                        src={this.state.imageUrl || defaultImageUrl}
                        width={width}
                    />
                </StyledLabel>
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
                    unselectable={undefined}
                />
            </Host>
        );
    }
}

const Host = styled.div`
    margin: 16px 0 8px 0;
    display: flex;
`;

const StyledImage = styled(Image)`
    border: 1px solid #DDD;
    height: calc(100% - 1.1rem);
`;

const StyledLabel = styled.label`
    flex-grow     : 1;
    flex-direction: column;
    display       : flex;
    height        : inherit;
    width         : inherit;
    cursor        : pointer;
`;

interface LabelTextProps {
    invalid: boolean;
    focused: boolean;
    disabled: boolean;
}

const LabelText = styled<LabelTextProps, any>("span")`
    :not(:empty) {
        display      : inline-block;
        margin-bottom: 8px;
        font-size    : .75rem;
        transition   : all .3s ease-out;
        color        : ${(props: LabelTextProps) => (
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
