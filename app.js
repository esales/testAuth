require('dotenv').config()
const session = require('express-session')
const sessionStore = require('./config/bdSessao')
const sequelize = require('./config/bd')
const exphbs = require('express-handlebars')
const passport = require('./config/passport')
const express = require('express')
const app = express()

// app.get('/teste', (req, res) => {
//     res.send('Express funcionando');
// });

app.use(session({
    name: 'sid',
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax',
    },
}
));


app.engine('handlebars', exphbs.engine({defaultLayout: false}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.usuario = req.user || null;
    next();
});

// app.use((req, res, next) => {
//     console.log('REQUISIÇÃO:', req.method, req.url);
//     next();
// });

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/index'));

async function iniciar(){
    try {
        await sequelize.sync();

        app.listen(3000, () => {
            console.log('Servidor rodando na porta 3000');
        });
    } catch(e) {
        console.error('Erro:', e.message);
    }
}

// console.log('Auth:', require('./routes/auth').stack.map(r => ({
//     path: r.route?.path,
//     methods: r.route?.methods
// })

// )
// );

iniciar();