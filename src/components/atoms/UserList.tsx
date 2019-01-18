import React from "react";
import UserItem from "src/components/atoms/UserItem";
import { User } from "src/graphQL/type";
import styled from "styled-components";

interface Props {
    users: User[];
    userListRow: number;
    onUserItemClick: (x: User) => void;
}

export default (
    {
        users,
        userListRow,
        onUserItemClick
    }: Props
) => (
    <UserList>
        {[...Array(userListRow).keys()].map(x => console.log("debug", x) || (
            <div
                key={x}
                style={{
                    width: `calc(100% / ${userListRow})`
                }}
            >
                {users
                    .filter((_, i) => i % userListRow === x)
                    .map(x => (
                        <UserItem
                            user={x}
                            key={x.id}
                            onClick={() => onUserItemClick(x)}
                        />
                    )
                )}
            </div>
        ))}
    </UserList>
);

const UserList = styled.div`
    margin: 0 3rem;
    display: flex;
    > * {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 1rem;
    }
`;
