import React, { ReactElement, ReactNode } from "react";
import ErrorComponent from "../Error";

export interface ErrorListenerProps {
    errorListener: {
        // TODO fix
        ErrorComponent: any,
        onError: (error: Error) => void
    };
}

interface Props {
    render: (auth: ErrorListenerProps) => ReactNode;
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
                        onError: (error: Error) => this.setState({
                            errors: this.state.errors.concat({
                                error,
                                key  : Date.now()
                            })
                        }),
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
