const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid');


const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(session({
    secret: uuid.v4(),
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');

const login = path.join(__dirname, 'view/login');
const home = path.join(__dirname, 'view/home');
//login section
const userDetail = {
    email: 'user@gmail.com',
    password: '123'
};
app.get('/', (req, res) => {
    const data = { logout: req.query.logout };
    // res.render(login);
    res.render(login, { data });
});
app.post('/', (req, res) => {
    if (req.body.email == userDetail.email && req.body.password == userDetail.password) {
        req.session.email = req.body.email;
        res.cookie('test', 'valueTest', { httpOnly: true, ecure: true });
        res.redirect('/home');
    } else {
        res.send('wrong password or email');
    }
})

app.get('/home', (req, res) => {
    if (!req.session.email) {
        res.redirect('/');
    } else {
        // console.log({email : req.session.email})
        res.render(home, { email: req.session.email });
    }
});


app.get('/logout', (req, res) => {
    res.clearCookie('test')
    req.session.destroy((err) => {//destroy
        if (err) {
            console.log(err);
        } else {
            res.redirect('/?logout=true');
        }
    })
});

const error = path.join(__dirname, 'view/error');
app.get('*', (req, res) => {
    res.render(error);
})

app.listen(300, () => console.log('300 port oper server running'));