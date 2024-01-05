const { json } = require('express');
const things = require('../model/Things');
const fs = require('fs')


exports.creatingThing = (req,res,next) => {
  console.log('save ....');
  console.log(JSON.parse(req.body.thing));
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id;
  delete thingObject._userId;
  console.log(thingObject);
  const thing  = new things({
    ...thingObject,
    userId : req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  thing.save()
  .then(()=> res.status(200).json({message : 'Objet enregistre avec success'}))
  .catch(err => res.status(400).json({ err }))

    // delete req.body._id;
    // // const thing = new Things({
    // //   title: req.body.title,
    // //   description: req.body.description,
    // //   ImageUrl: req.body.ImageUrl,
    // //   userId: req.body.userId,
    // //   price: req.body.price,
    // // });
  
    // const thing = new Things({
    //   ...req.body
    // });
    // console.log(thing);
    

    
    // thing.save()
    // .then(()=> res.status(201).json({message : "Objet enregistre !"}))
    // .catch(err => res.status(400).json({ err }))
  }




  exports.getThing = (req, res, next)=>{
    things.findOne({_id: req.params.id})
    .then(things => res.status(200).json(things))
    .catch(err => res.status(400).json({err}))
  }



  exports.modifyThing = (req, res, next) => {
    console.log('modification...');
  
    console.log(req.file.filename);

    const thingObject = req.file ? {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...req.body }

    console.log(thingObject);

    delete thingObject.userId;
    things.findOne({_id: req.params.id})
    .then((thing) => {
      console.log(thing);
      console.log('#id ===='+req.params.id);
      if (thing.userId != req.auth.userId) {
        console.log('non autorise');
        res.status(401).JSON({ message: 'Non-Autorise'});
      }else{
        things.updateOne({_id:req.params.id}, {...thingObject, _id:req.params.id})
        .then((objetModifie)=> {
          res.status(200).json({message: 'succes'})
          console.log("success ....");
          console.log(objetModifie);
        })
        .catch(err => res.status(400).json({err}));
      }
    } )
    .catch(err => res.status(400).json({ err }))
    // console.log(req.params.id);
    // console.log(req.body);
    // things.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
    // .then(()=>{
    //   res.status(201).json({message: "modifie avec success"})
    //   console.log("modification reussi");
    // })
    // .catch(err => res.status(400).json({err}))
  }




  exports.deleteThing = (req, res, next)=>{

    things.findOne({_id: req.params.id})
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(401).json({message : 'non authorise'})
      }else{
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          things.deleteOne({_id:req.params.id})
          .then(()=>res.status(201).json({message: "Objet Supprimer avec succees"}))
          .catch(err=> res.status(400).json({err}))
        });
      }
    })
    .catch(err => res.status(400).json({err}))
    // Things.deleteOne({_id: req.params.id})
    // .then(()=>res.status(201).json({message: "Objet Supprimer avec succees"}))
    // .catch(err=> res.status(400).json({err}))
  }




  exports.getThings = (req,res,next)=>{
    things.find()
    .then(things => res.status(200).json(things))
    .catch(err => res.status(400).json({err}))
  }
