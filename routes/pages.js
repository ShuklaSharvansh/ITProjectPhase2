const express = require("express");
const router = express.Router();
const authcontroller = require('../controllers/auth');



router.get("/", (req,res) =>
{
    res.render("index");
});

/*router.get("/login", authcontroller.login, (req,res) =>
{
    res.render("login");
});*/

router.get("/login", authcontroller.login, (req,res) =>
{
    res.render("login");
});

router.get("/signup", (req,res) =>
{
    res.render("signup");
});

router.get("/aboutus", (req,res) =>
{
    res.render("aboutus");
});

router.get("/index", (req,res) =>
{
    res.render("index");
});


router.get("/account", authcontroller.isLoggedIn, (req,res,next) =>
{
    if(req.user == undefined)
    {
        res.render("login");
    }
    //res.render("account");
});

router.get("/auth/login", (req,res) =>
{
    res.render("account");
});

router.get("/Services/infographics/infographics", authcontroller.view2, (req,res) =>
{
    
});

router.get("/Services/animations/animations", authcontroller.view3, (req,res) =>
{

});

router.get("/Services/bgm/bgm", authcontroller.view1, (req,res) =>
{

});

router.get("/Services/processing/processing", authcontroller.view4, (req,res) =>
{
    
});

router.get("/Profiles/baseprofile", authcontroller.view, (req,res) =>
{
    
});

router.get("/profiles/profile1", authcontroller.viewp1,(req,res) =>
{
    
});

router.get("/profiles/profile2", authcontroller.viewp2, (req,res) =>
{
    
});


router.post('/auth/order1', authcontroller.order1, (req, res) =>
{
    if(req.user == undefined)
    {
        res.render('login');
    }
});

router.post('/auth/order2', authcontroller.order2, (req, res) =>
{
    if(req.user == undefined)
    {
        res.render('login');
    }
});

/*router.get('/auth/signup', (req, res)=>{
    res.render("signup")
})

router.get('/auth/login', (req, res)=>{
    res.render("login")
})

router.get('/auth/account', (req, res)=>{
    res.redirect("account")
})*/

module.exports = router;