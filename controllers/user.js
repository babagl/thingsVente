const jwt = require('jsonwebtoken');
const User = require('../model/User');
const bcrypt = require('bcrypt');

exports.signUp = (req, res, next) => {
    console.log("Inscription ...");
    bcrypt.hash(req.body.password,10)
    .then((hash) => {
        console.log(hash);
        const user = new User({
            email: req.body.email,
            password: hash
        })

        user.save()
        .then(() => res.status(200).json({message: "Utilisateur enregistre avec success"}))
        .catch(err => res.status(400).json({err}));
    })
    .catch(err => res.status(500).json({err}));
};



exports.login = (req, res, next) => {
    console.log(req.body);
    User.findOne({ email: req.body.email })
        .then(user => {
            console.log(user);
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    console.log(valid);
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }else{
                        console.log("jwt codage");
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign({userId: user._id},"RANDOW_TOKEN_SECRET",{expiresIn: '24H'})
                        });
                        
                    }
                    
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };