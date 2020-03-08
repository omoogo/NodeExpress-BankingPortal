const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: true }));

const accountData = fs.readFileSync(path.join(__dirname, './json/accounts.json'), 'UTF8');
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync(path.join(__dirname, './json/users.json'), 'UTF8');
const users = JSON.parse(userData);

app.get('/', function(req, res) {
    res.render('index', {title: 'Account Summary', accounts: accounts});
});

app.get('/savings', function(req, res) {
    res.render('account', {account: accounts.savings});
});

app.get('/checking', function(req, res) {
    res.render('account', {account: accounts.checking});
});

app.get('/credit', function(req, res) {
    res.render('account', {account: accounts.credit});
});

app.get('/profile', function(req, res) {
    res.render('profile', {user: users[0]});
});

app.get('/transfer', function(req, res) {
    res.render('transfer');
});

app.post('/transfer', function(req, res, next) {
    // Set the from account new balance
    accounts[req.body.from].balance -= req.body.amount;

    // Set the to account new balance
    accounts[req.body.to].balance += parseInt(req.body.amount, 10);

    // Update account data
    const accountsJSON = JSON.stringify(accounts);
    fs.writeFileSync(path.join(__dirname, './json/accounts.json'), accountsJSON, 'UTF8');

    res.render('transfer', { message: 'Transfer Completed'});
});

app.get('/payment', function(req, res) {
    res.render('payment', { account: accounts.credit });
});

app.post('/payment', function(req, res) {
    accounts.credit.balance -= req.body.amount;
    accounts.credit.available += parseInt(req.body.amount, 10);
    const accountsJSON = JSON.stringify(accounts);
    fs.writeFileSync(path.join(__dirname, './json/accounts.json'), accountsJSON, 'UTF8');
    res.render('payment', { message: 'Payment Successful', account: accounts.credit });
});

app.listen(3000, () => {
    console.log('PS Project Running on port 3000!');
});