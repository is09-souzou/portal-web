import React, { ReactElement } from "react";
import ErrorComponent from "../Error";

interface PropsModel {
}

interface StateModel {
    errors: {error: Error, key: number}[];
}

export default class extends React.Component<PropsModel, StateModel> {

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
                    children as ReactElement<any>,
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
