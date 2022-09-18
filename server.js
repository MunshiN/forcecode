const express = require('express');
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require('express-session');
const MongoDbStore = require("connect-mongo");
const cloudinary = require("cloudinary").v2;
const fileUpload = require('express-fileupload')
const nodemailer = require('nodemailer')


const app = express();
const port = process.env.PORT|| 1018

app.use(express.json())
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: false
}))


mongoose.connect('mongodb://localhost:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(flash())
app.use(session({
    secret: '1234567qwdeq890QWERTY',
    resave: false,
    store: MongoDbStore.create({ mongoUrl: 'mongodb://localhost:27017/blog' }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }

}))

app.use((req, res, next) => {
    res.locals.session = req.session
    let h = res.locals.session
    let q = req.session.user
    next()
})

// const db = mongoose.connection
// db.once('open', _ => {
//   console.log('Database connected')
// })
app.use("/static", express.static('./static/'));
const Register = require("./backend/models/user");
const Blog = require('./backend/models/blog')



app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile);

app.use(fileUpload({
    useTempFiles: true
}))


//Setting Cloudinary
cloudinary.config({
    cloud_name: 'dihumtgjw',
    api_key: '419823895856789',
    api_secret: 'cGbA8wVSkoQrtTvhZfRIWy7K__8',
    secure: true
});


app.post('/mail',(req,resp)=>{
    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'nmunshi40@gmail.com',
            pass:'larwrezmcepfztfj'
        }
    });
    
    var mailOptions = {
        from:'nmunshi40@gmail.com',
        to:'naharlaxit@gmail.com',
        subject:'rte',
        text:'localhost:1018/blogs/categories/'+req.session.blogs._id
    };
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }else{
            console.log('email sent')
            resp.redirect('/')
        }
    })
})

//Signup User
app.post('/sign_up', async(req,resp)=>{
    var username = req.body.username
    var name = req.body.name
    var email = req.body.email
    var phno = req.body.phoneno
    var password = req.body.password
    var confirmPassword = req.body.confirmpassword

    Register.exists({ email: email }, (err, result) => {
        if (result) {
            return resp.render('signup')
        }
    })

    if (password === confirmPassword) {

        const registerUser = new Register({
            username: username,
            name: name,
            email: email,
            phno: phno,
            password: password,
        })

        await registerUser.save().then((user) => {
            console.log('save')
            return resp.redirect('/')
        }).catch(err => {
            console.log('error')
            return resp.render('signup')
        })
    } else {
        resp.redirect('/')

    }
    
})

//Login User
app.post("/login", async (req, resp) => {
    var email = req.body.email
    var password = req.body.password

    const user = await Register.findOne({ email: email })
    if (user != null) {
        if (password === user.password) {
            if (req.session.user == null) {
                req.session.user = user
                console.log('login Successfully')
                resp.redirect('/')
            }

        }
        else {
            req.flash('error', 'password Wrong')
            console.log("User Not Found")
            resp.redirect('/login')

        }
    } else {
        req.flash('error', 'Email Not Found')
        resp.redirect('/login')
    }
})

//Upload Blog
app.post('/upload_blog',async(req,resp)=>{
    
    const file = req.files.image

    cloudinary.uploader.upload(file.tempFilePath, async(err, result) => {
        console.log(result)
        const title = req.body.title
    const categories = req.body.categories
    const description = req.body.description
    const image = result.url

    const blog = new Blog({
        title:title,
        categories:categories,
        description:description,
        image:image
    })

    console.log(blog)
    await blog.save().then((result) => {
        console.log('save')
        return resp.redirect('/')
    }).catch(err => {
        console.log('error')
        return resp.redirect('/writeblog')
    })
    })

    console.log(req.body)
    

    
})

// like Post
app.post('/update-likes',async(req,resp)=>{

    
    let a= 0;
    
    Blog.findOne({_id:req.body._id.toString()}).then((res)=>{
        const id = req.session.user._id

        for (let aus = 0; aus < res.likelist.length; aus++){
            
        if(res.likelist[aus]==id){
            a=a+1;
            console.log(a)

        }
    }

    if(a==0){
    console.log(a)
    Blog.updateOne({_id:req.body._id},{
        $inc: { likes: 1 },
        $push:{likelist:req.session.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            console.log('error')
            return resp.status(422).json({error:err})
        }else{
            resp.json(result)
        }
    })
}
    })

    
})

//search type of blogs
app.post('/search',(req,resp)=>{
    var s = req.body.search
    if(s=='Food'){
        resp.redirect('/search/art')
        }
        if(s=='science'){
            resp.redirect('/search/science')
        }
    
})



require('./backend/routes/web')(app)
app.listen(port,(req,resp)=>{
    console.log('server running at 1018')
})
