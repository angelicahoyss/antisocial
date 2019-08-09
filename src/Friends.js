import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveUsers, unfriend, acceptRequest } from "./actions";
import FriendButton from "./FriendButton";
export default function Friends() {
    const dispatch = useDispatch();
    const list = useSelector(state => state.users);

    useEffect(() => {
        dispatch(receiveUsers());
    },[]);

    return (
        <div className="friends-list">
            <div className="friends">
                <h2>friends list</h2>
                {list &&
                    list
                        .filter(function(user) {
                            return user.accepted === true;
                        })
                        .map(user => (
                            <div key={user.id}>
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        src={user.image || "/images/default-copy.png"}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </Link>
                                <button
                                    onClick={() => dispatch(unfriend(user.id))}>unfriend
                                </button>
                            </div>
                        ))}
            </div>
            <div className="wannabes">
                <h2>friend requests</h2>
                {list &&
                    list
                        .filter(function(user) {
                            return user.accepted === false;
                        })
                        .map(user => (
                            <div key={user.id}>
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        src={user.image}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </Link>
                                <button onClick={() => dispatch(acceptRequest(user.id))}>
                                    accept friend request
                                </button>
                            </div>
                        ))}
            </div>
        </div>
    );
}
