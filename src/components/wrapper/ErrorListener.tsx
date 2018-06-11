import React, { ReactNode } from "react";
import ErrorComponent from "../Error";

export type OnError = (error: Error) => void;

export interface ErrorListenerProps {
    errorListener: {
        // TODO fix
        ErrorComponent: any,
        onError: OnError
    };
}

interface Props {
    render: (errorListener: ErrorListenerProps) => ReactNode;
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
            render,
            ...props
        } = this.props;

        return (
            <div>
                {render({
                    errorListener: {
                        ErrorComponent,
                        onError: (error: Error) => {
                            console.error(error);
                            this.setState({
                                errors: this.state.errors.concat({
                                    error,
                                    key  : Date.now()
                                })
                            });
                        },
                    },
                    ...props
                })}
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
