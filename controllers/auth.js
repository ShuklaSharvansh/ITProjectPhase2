const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { promisify } = require('util');

const db = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST ,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PWD,
        database: process.env.DATABASE
    }
);

//login 
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  
    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).render("login", {
        message: 'Please provide email and password'
      });
    }
  
    // 2) Check if user exists && password is correct
    db.query('SELECT * FROM user WHERE email = ?', [email], async(error, results) => {
        if(results==0) {
            return res.status(401).render("login", {
            message: 'Email does not exist'
             });
        }
        console.log(results);
        console.log(password);
        const isMatch = await bcrypt.compare(password, results[0].password);
        console.log(isMatch);
        if(!results || !isMatch ) {
         return res.status(401).render("login", {
           message: 'Incorrect email or password'
        });
      } else {
        // 3) If everything ok, send token to client
        const id = results[0].id;
        console.log("ky abhosdike");
        console.log(id);
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
        });
        
  
        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        };
        res.cookie('jwt', token, cookieOptions);
        console.log(req.cookie);
        res.render('index', {message : 'Login Successful!'});
    
     }
    });
  };
  
//register
exports.register = (req, res) => {
    
    console.log(req.body);
    const {name, email, p1, p2} = req.body;

    db.query('SELECT email FROM user WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        if(!name || !email) {
            return res.status(401).render("signup", {
            message: 'Fill all the fields'
             });
        }
        if(results.length > 0){
            return res.render('signup', {
                message : 'That email is already in use!'
            })
        }
        
        let h_password = await bcrypt.hash(p1,8);
        console.log(h_password);

        db.query('INSERT INTO user SET ?', {name: name, email: email, password: h_password}, (error,results) => {
            if(error){
                console.log(error);
            }else{
                db.query('SELECT id FROM user WHERE email = ?', [email], (error, result) => {
                    const id = result[0].id;
                    console.log(id);
                    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                      expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
                    });
          
                    const cookieOptions = {
                      expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                      ),
                      httpOnly: true
                    };
                    res.cookie('jwt', token, cookieOptions);
                    console.log(req.cookies);
          
                    //res.status(201).redirect("/index");
                    res.render('index',{message : 'Registeration Successful'})
                  });
            }
        });
    });
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt, 
        process.env.JWT_SECRET
        );

      console.log(decoded);
      
      // 2) Check if user still exists
      db.query('SELECT * FROM user WHERE id = ?', [decoded.id], (error, result) => {
        console.log(result)
        if(!result) {
          return next();
        }
        // THERE IS A LOGGED IN USER
        //req.user = result[0];
        req.user = result[0];
        
        db.query('SELECT * FROM orderhistory WHERE uid = ?',[decoded.id],(err, row) =>
    {
        if(!err)
        {
            console.log(row);
            res.render("account", {user: req.user, row: row});
        }
        else
        {
            console.log(error);
        }
    });

    return next();
          /*db.query('SELECT * FROM course WHERE uid = ?',[decoded.id], (err, row) => {
          if(!err)
          {
            console.log(row);
            req.locals = row[0];
            res.render('profile', {
              user:req.user,
              row})
          }
          else{
            console.log(err);
          }
        });*/

        res.render('account',
        {
            user: req.user
        });

        return next();
      });
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};

//logout
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  //res.status(200).redirect("/index");
  res.render('index',{message : 'Logout Successful'})
};


exports.order1 = async (req,res,next) => {
    const {sliderrange2, details, cname} = req.body;
    console.log(req.cookies);
    if(req.cookies.jwt)
    {
     try{   
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt, 
            process.env.JWT_SECRET
            );
        var sharru = "Harshit Singh Rautela";
        var money =  sliderrange2*30 + 1080;        
        db.query('INSERT INTO orderhistory SET ?', {uid: decoded.id, nameofcreator: sharru, price: money, details: details}, (error, result) =>
        {
            if(error)
            {
                console.log(error);
            }
        })
        res.redirect('/account');
        return next();
    }
    catch(error){
        return next();
    }
    } 
    else
    {
        return next();
    }  
}
exports.order2 = async (req,res,next) => {
    const {sliderrange2, details, cname} = req.body;
    console.log(req.cookies);
    if(req.cookies.jwt)
    {
     try{   
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt, 
            process.env.JWT_SECRET
            );
        var sharru = "Sharvansh Shukla";
        var money =  sliderrange2*30 + 1050;        
        db.query('INSERT INTO orderhistory SET ?', {uid: decoded.id, nameofcreator: sharru, price: money, details: details}, (error, result) =>
        {
            if(error)
            {
                console.log(error);
            }
        })
        res.redirect('/account');

        return next();
    }
    catch(error){
        return next();
    }
    } 
    else
    {
        return next();
    }  
}




































/*exports.register = function (req, res) 
{
    console.log(req.body);

    const{name, email, p1, p2} = req.body;

    db.query("SELECT email FROM user WHERE email = ?",[email],async(error, results)=>
    {
        if(error)
        {
            console.log(error);
        }

        if(results.length > 0)
        {
            return res.render('signup',
            {
                message: 'Email already in use'   
            });
        }

        let hashedpwd = await bcrypt.hash(p1,8)
        
        db.query('INSERT into user SET ?', {name:name, email:email, password:hashedpwd}, (error, result)=>
        {
            if(error)
            {
                console.log(error);
            }
        })
    });
 
    res.redirect("../login");
};

exports.login = (req, res) =>{
    console.log(req.body)

    const {email, password} = req.body
    
    db.query('SELECT email FROM user WHERE email = ?',  [email], async(err, results)=>{
        if (err){
            console.log("errorrr")
            console.log(err)
        }

        if(results.length > 0)
        {
            return res.redirect('../account');
        }
        //console.log(password)
        //console.log(results[0].password)
        /*let hash1 = await bcrypt.hash(password, 8)
        if(result[0].password.localeCompare(hash1) == 0 )
        {
            console.log("Matched");
        }
        else
        {
            console.log("Mismatched");
        }*/
        /*if(results.length > 0){
            res.redirect('../blog/register')
            return res.render('register', {
                message: 'That email is taken.'
            })
        }
        let hashedPassword = await bcrypt.hash(password, 8)
        console.log(hashedPassword)
        
    })
};*/

exports.view = async (req, res, next) =>
{
    db.query('SELECT * FROM profiles',(err, row) =>
    {
        if(!err)
        {
            console.log(row);
            req.user = row;
            res.render("profiles/baseprofile", {row: req.user});
        }
        else
        {
            console.log(error);
        }
    })
    return next();
}

exports.view1 = async (req, res, next) =>
{
    db.query('SELECT * FROM profiles WHERE bgm = 1',(err, row) =>
    {
        if(!err)
        {
            console.log(row);
            req.user = row;
            res.render("services/bgm/bgm", {row: req.user});
        }
        else
        {
            console.log(error);
        }
    })
    return next();
}

exports.view2 = async (req, res, next) =>
{
    db.query('SELECT * FROM profiles WHERE info = 1',(err, row) =>
    {
        if(!err)
        {
            console.log(row);
            req.user = row;
            res.render("services/infographics/infographics", {row: req.user});
        }
        else
        {
            console.log(error);
        }
    })
    return next();
}

exports.view3 = async (req, res, next) =>
{
    db.query('SELECT * FROM profiles WHERE animate = 1',(err, row) =>
    {
        if(!err)
        {
            console.log(row);
            req.user = row;
            res.render("services/animations/animations", {row: req.user});
        }
        else
        {
            console.log(error);
        }
    })
    return next();
}

exports.view4 = async (req, res, next) =>
{
    db.query('SELECT * FROM profiles WHERE editing = 1',(err, row) =>
    {
        if(!err)
        {
            console.log(row);
            req.user = row;
            res.render("services/processing/processing", {row: req.user});
        }
        else
        {
            console.log(error);
        }
    })
    return next();
}

exports.viewp1 = async (req, res, next) =>
{
    db.query('SELECT * FROM profiles WHERE id = 1',(err, row) =>
    {
        if(!err)
        {
            console.log(row);
            req.user = row;
            res.render("profiles/profile1", {row: req.user});
        }
        else
        {
            console.log(error);
        }
    })
    
    return next();
    
}

exports.viewp2 = async (req, res, next) =>
{
    db.query('SELECT * FROM profiles WHERE id = 2',(err, row) =>
    {
        if(!err)
        {
            console.log(row);
            req.user = row;
            res.render("profiles/profile2", {row: req.user});
        }
        else
        {
            console.log(error);
        }
    })
    return next();
}

