import React from "react";
import Link from "src/components/atoms/Link";
import SplittedList from "src/components/atoms/SplittedList";
import UserItem from "src/components/atoms/UserItem";
import { User } from "src/graphQL/type";

interface Props {
    users: User[];
    onUserItemClick: (x: User) => void;
}

export default (
    {
        users,
        onUserItemClick,
    }: Props
) => (
    <SplittedList
        items={users}
        renderItem={x => (
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
        )}
    />
);
