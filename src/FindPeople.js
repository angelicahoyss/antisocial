import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople({ id }) {
    const [searchUsers, setSearchUsers] = useState();
    const [users, setUsers] = useState();

    useEffect(() => {
        if (!searchUsers) {
            (async () => {
                const usersList = await axios.get("/users");
                setUsers(usersList.data);
            })();
        } else {
            (async () => {
                const searchList = await axios.post("/users.json", {
                    val: searchUsers
                });
                // console.log(searchList.data);
                setUsers(searchList.data);
            })();
        }
    }, [searchUsers]);

    return (
        <div>
            {searchUsers ? (
                <h3>find people</h3>
            ) : (
                <h3>checkout who just joined!</h3>
            )}
            <input
                placeholder="search"
                onChange={e => setSearchUsers(e.target.value)}
            />
            {users &&
                users.map(user => (
                    <div key={user.id}>
                        <Link to={`/user/${user.id}`}>
                            <img
                                src={user.image}
                                alt={`${user.first} ${user.last}`}
                            />
                            <p>{user.first}</p>
                            <p>{user.last}</p>
                        </Link>
                    </div>
                ))}
            <h3>are you looking for someone in particular?</h3>
        </div>
    );
}
