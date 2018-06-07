import React, { ReactNode, ReactElement } from "react";
import {
    IconButton,
    Snackbar
} from "@material-ui/core";

interface PropsModel {
}

interface StateModel {
    errors: {error: Error, key: number}[];
}

export default class extends React.Component<PropsModel, StateModel> {

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
                        onError: (error: Error) => this.setState({
                            errors: this.state.errors.concat({
                                error,
                                key  : Date.now()
                            })
                        }),
                        ...props
                    }
                )}
                {this.state.errors.map(x =>
                    <Snackbar
                        key={x.key}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        open={true}
                        autoHideDuration={6000}
                        // onClose={this.handleClose}
                        ContentProps={{
                            "aria-describedby": "message-id",
                        }}
                        message={<span id="message-id">{x.error.message}</span>}
                    />
                )}
            </div>
        );
    }
}
