/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book= require("../models").Book; 
module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res)=>{
      try{
        const books=await Book.find({});
        if(!books){
          res.json([]);
          return;
        }
        const formatData=books.map((book)=>{
          return{
            
            title: book.title,
            _id: book._id,
            // comments: book.comments,
            commentcount: book.comments.length,
          };
        });
        res.json(formatData);
        return;
      }catch(err){
        res.json([]);
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async (req, res)=>{
      let title = req.body.title;
      if(!title){
        res.send("missing required field title");
        return;
      }
      const newBook= new Book({title, comments:[]});
      try{
        const book= await newBook.save();
        res.json({ _id:book._id, title: book.title });
      } catch(err){
        res.send("there was an error saving")
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async (req, res)=>{
      try{
        const deleted= await Book.deleteMany();
        res.send("complete delete successful");
      }catch(err){
        res.send('error');
      }
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async (req, res)=>{
      let bookid = req.params.id;
      try{
        const book=await Book.findById(bookid);
        if(!book){
          res.send("no book exists");
          return;
        }
        res.json({title:book.title,
          _id:book._id,
          comments:(book.comments? book.comments:[])});
      }catch(err){
        res.send('no book exists');
        return;
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async (req, res)=>{
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment){
        res.send("missing required field comment");
        return;
      }
      try{
        let book=await Book.findById(bookid);
        if(!book){
          res.send("no book exists");
          return;
        }
        book.comments.push(comment);
        book=await book.save();
        res.json({
          title:book.title,
          _id:book._id,
          comments: book.comments,
        })

      }catch(err){
        res.send('no book exists');
        return;
      }
    })
    
    .delete(async (req, res)=>{
      let bookid = req.params.id;
      try{
        const deleted= await Book.findByIdAndDelete(bookid);
        if(!deleted){
          throw new Error("no borró na")
        }
        res.send("delete successful");
        return;
      }catch(err){
        res.send('no book exists');
      }
    });
  
};
