import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
} from "@material-ui/core";
import ImageInput, { ImageInputProps } from "./ImageInput";

interface Props extends ImageInputProps {
    open: boolean;
    onClose: () => void;
}

interface State {
    imageInputDialogVisible: boolean;
    imageUrl: string;
    uploadingImage: boolean;
}

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            imageInputDialogVisible: false,
            uploadingImage: false
        });
    }

    render() {
        const {
            onClose,
            onChange,
            open = false,
            ...props
        } = this.props;

        return (
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-slide-title"
            >
                <DialogTitle
                    id="editable-avatar-dialog-title"
                >
                    Upload Image
                </DialogTitle>
                <DialogContent>
                    <ImageInput
                        name="newImage"
                        width="256"
                        height="256"
                        {...props}
                    />
                </DialogContent>
                {this.state.uploadingImage && <LinearProgress/>}
                <DialogActions>
                    <Button
                        onClick={onClose}
                    >
                        cancel
                    </Button>
                    <Button
                        component="button"
                        color="primary"
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
