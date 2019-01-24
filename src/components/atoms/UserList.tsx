import React from "react";
import Link from "src/components/atoms/Link";
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
        {[...Array(userListRow).keys()].map(x => (
            <div
                key={x}
                style={{
                    width: `calc(100% / ${userListRow})`
                }}
            >
                {users
                    .filter((_, i) => i % userListRow === x)
                    .map(x => (
                        <Link
                            key={x.id}
                            to={`/users/${x.id}`}
                        >
                            <UserItem
                                user={x}
                                key={x.id}
                                onClick={() => onUserItemClick(x)}
                            />
                        </Link>
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
