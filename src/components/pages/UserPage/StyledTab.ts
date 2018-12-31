import Tab, { TabProps } from "@material-ui/core/Tab";
import styled from "styled-components";

export default styled(Tab as React.SFC<TabProps>)`
    && {
        width: 50%;
        > :hover {
            color: #ff9100;
        }
    }
`;
