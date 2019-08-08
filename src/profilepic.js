import React from "react";

export default function({ image, first, last, onClick, size }) {
    image = image || "/images/default-copy.png";
    return (
        <div className="profileImageContainer">
            <img
                className="profileImage"
                src={image}
                alt={`${first} ${last}`}
                onClick={onClick}
                height={size == "jumbo" ? 200 : 80}
            />
        </div>
    );
}
