export async function getLoginPage(req, res) {
    res.render("login");
}

export async function postLoginPage(req, res) {
    const { email, password } = req.body;
    console.log("Login data", email, password);
    res.send("Login data received");
}