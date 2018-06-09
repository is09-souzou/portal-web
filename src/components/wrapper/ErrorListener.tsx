import React, { ReactElement } from "react";
import ErrorComponent from "../Error";

export interface ErrorListenerProps {
    errorListener: {
        // TODO fix
        ErrorComponent: any,
        onError: (error: Error) => void
    };
}

interface Props {
}

interface Model {
    errors: {error: Error, key: number}[];
}

export default class extends React.Component<Props, Model> {

    onCloseByKey = (key: number) => () => this.setState({
        errors: this.state.errors.filter(y => key !== y.key)
    })

    componentWillMount() {
        this.setState({
            errors: []
        });
    }

    render() {

        const {
            children,
            ...props
        } = this.props;

        return (
            <div>
                {React.cloneElement(
                    children as ReactElement<ErrorListenerProps>,
                    {
                        errorListener: {
                            ErrorComponent,
                            onError: (error: Error) => this.setState({
                                errors: this.state.errors.concat({
                                    error,
                                    key  : Date.now()
                                })
                            }),
                        },
                        ...props
                    }
                )}
                {this.state.errors.map(x =>
                    <ErrorComponent
                        key={x.key}
                        error={x.error}
                        open={true}
                        onClose={this.onCloseByKey(x.key)}
                    />
                )}
            </div>
        );
    }
}
