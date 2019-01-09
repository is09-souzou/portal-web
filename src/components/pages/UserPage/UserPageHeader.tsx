import { Tab, Tabs } from "@material-ui/core";
import React from "react";
import UserAvatar from "src/components/pages/ProfilePage/UserAvatar";
import StyledTypography from "src/components/pages/UserPage/StyledTypography";
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
) => (
    <Host>
        <img
            src={user.avatarUri}
        />
        <div>
            <UserAvatar
                src={user.avatarUri}
            />
            <div>
                <StyledTypography gutterBottom>
                    {user.displayName}
                </StyledTypography>
                <StyledTypography>
                    {user.email}
                </StyledTypography>
            </div>
            <Tabs
                value={selectedContentValue}
                indicatorColor="primary"
                textColor="primary"
            >
                {contents.map(x =>
                    <Tab
                        disableRipple
                        key={x.value}
                        label={x.text}
                        value={x.value}
                        onClick={() => onSelectContent(x)}
                    />
                )}
            </Tabs>
        </div>
    </Host>
);

const Host = styled.header`
    display: flex;
    flex-direction: column;
    > :first-child {
        height: 10rem;
        object-fit: cover;
    }
    > :last-child {
        display: flex;
        height: 5rem;
        align-items: center;
        margin-left: 5rem;
        > :first-child {
            margin-bottom: 5rem;
        }
        > :last-child {
            margin-top: auto;
            margin-left: auto;
            visibility: visible;
        }
        @media (max-width: 768px) {
            margin-left: 1rem;
            > :last-child {
                visibility: hidden;
            }
        }
    }
`;
