exports.allAccess = (req, res) => {
    res.status(200).send({ public_content: "Public Content" });
};

exports.userBoard = (req, res) => {
    res.status(200).send({ user_content: "User Content" });
};

exports.adminBoard = (req, res) => {
    res.status(200).send({ admin_content: "Admin Content" });
};