import { Typography } from "@material-ui/core";
import React from "react";
import { User } from "src/graphQL/type";
import styled from "styled-components";

interface UserItemProps extends React.HTMLAttributes<HTMLDivElement> {
    user: User;
}

export default (
    {
        user,
        ...props
    }: UserItemProps
) => (
    <UserItemBase
        {...props}
        unselectable={undefined}
    >
        <UserImage
            src={(
                user.avatarUri ? user.avatarUri : "/img/no-image.png"
            )}
        />
        <div>
            <Typography variant="subtitle1">
                {user.displayName}
            </Typography>
        </div>
    </UserItemBase>
);

const UserImage = styled.img`
    width: 100%;
    border-radius: 8px;
    transition: all 0.15s ease-in-out;
    min-height: 4rem;
    cursor: pointer;
    :hover {
        background-color: #fff;
        transform: scale(1.1);
        box-shadow: 0 7px 14px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
    }
`;

const UserItemBase = styled.div`
    min-height: 10rem;
    margin-bottom: 2rem;
    width: 100%;
`;
