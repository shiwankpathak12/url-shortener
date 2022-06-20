const express=require('express')
const mongoose  = require('mongoose')
const app=express()
const shorturl=require('./models/shorturl')
app.use(express.static('public'))
const port=process.env.port||2200
app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))

mongoose.connect("mongodb://locaLhost/urlshortener")
app.get('/',async (req,res)=>{
    const shorturls=await shorturl.find()
    res.render('view',{shorturls:shorturls})
})

app.post('/shorturls',async (req,res)=>{
    await shorturl.create({full:req.body.url})
    res.redirect('/')
})

app.get('/:shortUrl', async(req,res)=>{
    const shortUrl=await shorturl.findOne({short:req.params.shortUrl})
    if(shortUrl==null)
    return res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})

app.listen(port,()=>{
    console.log(`server is listening at port ${port}`)
})