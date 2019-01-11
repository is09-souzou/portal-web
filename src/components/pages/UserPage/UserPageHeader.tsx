import { Tab, Tabs } from "@material-ui/core";
import AppBar, { AppBarProps } from "@material-ui/core/AppBar";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import { TabProps } from "@material-ui/core/Tab";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useContext } from "react";
import DrawerContext from "src/contexts/DrawerContext";
import { User } from "src/graphQL/type";
import styled from "styled-components";

type Content = { value: string, text: string };

export default (
    {
        user,
        contents,
        selectedContentValue,
        onSelectContent
    }: {
        user: User,
        contents: Content[],
        selectedContentValue: string,
        onSelectContent: (content: Content) => void
    }
) => {
    const { toggleDrawer } = useContext(DrawerContext);

    return (
        <Host>
            <MenuIconButton
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
            >
                <MenuIcon/>
            </MenuIconButton>
            <BackImage
                src={user.avatarUri}
            />
            <Content>
                <UserAvatar
                    src={user.avatarUri}
                />
                <Info>
                    <DisplayName gutterBottom>
                        {user.displayName}
                    </DisplayName>
                    <Email>
                        {user.email}
                    </Email>
                </Info>
                <Tabs
                    value={selectedContentValue}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {contents.map(x =>
                        <StyledTab
                            disableRipple
                            key={x.value}
                            label={x.text}
                            value={x.value}
                            onClick={() => onSelectContent(x)}
                        />
                    )}
                </Tabs>
            </Content>
        </Host>
    );
};

const Host = styled(AppBar as React.SFC<AppBarProps>)`
    && {
        display: flex;
        flex-direction: column;
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        padding: 0;
        width: calc(100% - 4rem);
        margin: 1rem 3rem 0 2rem;
        border-radius: 8px;
        color: #333;
        background-color: white;
        @media (max-width: 767px) {
            width: calc(100% - 4rem);
        }
    }
`;

const MenuIconButton = styled(IconButton as React.SFC<IconButtonProps>)`
    && {
        position: absolute;
        top: 0;
        left: 0;
        @media (min-width: 768px) {
            display: none;
        }
    }
`;

const BackImage = styled.img`
    height: 14rem;
    object-fit: cover;
    width: 100%;
`;

const UserAvatar = styled.img`
    && {
        border-radius: 4px;
        object-fit: cover;
        box-shadow: 0px 0px 18px 2px rgba(0, 0, 0, 0.2);
        min-width: 8rem;
        min-height: 8rem;
        width: 8rem;
        height: 8rem;
        margin-bottom: 4px;
        @media (max-width: 768px) {
            min-width: 5rem;
            min-height: 5rem;
            width: 5rem;
            height: 5rem;
        }
    }
`;

const Content = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    height: 4rem;
    align-items: flex-end;
    padding: 0 1rem;
    background-color: rgba(0, 0, 0, .5);
    > :last-child {
        align-self: flex-end;
        margin-left: auto;
    }
    @media (max-width: 768px) {
        > :last-child {
            visibility: hidden;
        }
    }
`;

const Info = styled.div`
    margin-left: 1rem;
    color: white;
    margin-bottom: .5rem;
`;

const DisplayName = styled(Typography as React.SFC<TypographyProps>)`
    && {
        color: white;
        font-size: 1.5rem;
        margin-bottom: 0;
        @media (max-width: 768px) {
            font-size: 1rem;
        }
    }
`;

const Email = styled(Typography as React.SFC<TypographyProps>)`
    && {
        color: white;
    }
`;

const StyledTab = styled(Tab as React.SFC<TabProps>)`
    && {
        font-size: 1rem;
        color: white;
    }
`;
