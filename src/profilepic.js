import React from "react";

export default function({ image, first, last, onClick }) {
    image = image || "/images/default.jpg";
    return (
        <div className="profileImageContainer">
            <img
                className="profileImage"
                src={image}
                width={80}
                alt={`${first} ${last}`}
                onClick={onClick}
            />
        </div>
    );
}
