const blog = require('../models/blog');

function initRoutes(app) {

    app.get("/",(req,resp)=>{
        blog.find().sort({likes:-1}).then(
            function (blogs){
                blog.find().sort({createdAt:-1}).then(
                    function (blog1){
                        return resp.render('blo', {blog2:blogs,blog3:blog1}, null, { sort: { 'likes': -1 } }) 
                    }
                )
                // return resp.render('blo', {blog:blog}, null, { sort: { 'likes': -1 } }) 
            }
        )
    })

    app.get('/signup',(req,resp)=>{
        if(req.session.user){
            resp.redirect('/')
        }else{
        resp.render('i')
        }
    })


    //logout user
    app.get('/logout', (req, resp) => {
        req.session.user = null
        resp.redirect('/')
    });

    app.get('/writeblog',(req,resp)=>{
        resp.render('writeblog')
    })

    app.get("/search/:key",async(req,resp)=>{
        let a=[]
        console.log(req.params.key)
         blog.find().then(data=>{
            let = []
            console.log(data.length)
            if(req.params.key=='food'){
            for(i =0; i<data.length;i++){
                console.log(data[i].categories)
                if(data[i].categories=='food')
                {
                   
                    a.push(data[i])
                    
                }
            }

            return resp.render('search',{blog2:a})
        }

        if(req.params.key=='travel'){
            for(i =0; i<data.length;i++){
                console.log(data[i].categories)
                if(data[i].categories=='travel')
                {
                   
                    a.push(data[i])
                    
                }
            }

            return resp.render('search',{blog2:a})
        }

        if(req.params.key=='science'){
            for(i =0; i<data.length;i++){
                console.log(data[i].categories)
                if(data[i].categories=='science')
                {
                   
                    a.push(data[i])
                    
                }
            }

            return resp.render('search',{blog2:a})
        }

        if(req.params.key=='art'){
            for(i =0; i<data.length;i++){
                console.log(data[i].categories)
                if(data[i].categories=='art')
                {
                   
                    a.push(data[i])
                    
                }
            }

            return resp.render('search',{blog2:a})
        }
        else{
            resp.redirect('/')
        }
        })
       
    })

    //Reading Particular Blog
    app.get('/blogs/category/:ids',(req,resp)=>{
        
            blog.find({ _id: req.params.ids }).then(
                function (blog) {
                    req.session.blogs = blog
                    console.log(blog)
                    return resp.render('eachblog', {blog:blog}, null, { sort: { 'createdAt': -1 } })
                }
            )
        
    })

    app.get('/profile',(req,resp)=>{
        resp.render('profile')
    })

    app.get('/about',(req,resp)=>{
        resp.render('about')
    })

}

module.exports = initRoutes;