const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Pin = require('../models/Pin');
const config = require('../config');

// Get all pins
router.get('/', async (req, res) => {
  try {
    const pins = await Pin.find().sort({ createdAt: -1 });
    res.json(pins);
  } catch (error) {
    console.error('Get pins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pin by ID
router.get('/:id', async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }
    res.json(pin);
  } catch (error) {
    console.error('Get pin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// GET pin by userId
router.get('/user/:userId',async(req,res)=>{
  try{
    // const id = ObjectId(req.params.userId)
    const id = new mongoose.Types.ObjectId(req.params.userId);
    const pins = await Pin.find({user:id});
    if(!pins){
      return res.status(404).json({message:'User pins not found'});
    }
    res.json(pins);
  }catch(error){
    console.error('Get user specific pins error: ',error);
    res.status(500).json({message:'Server errorrr'});
  }
})
// olivia id: '6809099e6fa8e9e7869f7509'


// Create pin
router.post('/', async (req, res) => {
  try {
    const { title, description, imageUrl, userId } = req.body;
    const pin = new Pin({
      title,
      description,
      imageUrl,
      user: userId,
    });
    await pin.save();
    res.status(201).json(pin);
  } catch (error) {
    console.error('Create pin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update pin
router.put('/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const pin = await Pin.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }
    res.json(pin);
  } catch (error) {
    console.error('Update pin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete pin
router.delete('/:id', async (req, res) => {
  try {
    const pin = await Pin.findByIdAndDelete(req.params.id);
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }
    res.json({ message: 'Pin deleted' });
  } catch (error) {
    console.error('Delete pin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/random-image/:query',async (req,res)=>{
  try{
    const {query} = req.params;
    console.log('message from api: getting image using', query)
    const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${config.UNSPLASH_ACCESS_KEY}&query=${query}`)
    // const response = await fetch('https://api.unsplash.com/photos/random?client_id=uJuP4SN1BMsQIiEcRBxPo81SKwuHV6fEwksb3WnWaic&query=car+detailing');
    console.log('endpoint raw strucutre: ', response)
    const data = await response.json();
    res.json(data);
    // res.json(response)
    // return response

  }catch(error){
    console.error('Get image error: ', error);
    res.status(500).json({message:'Server errorr'});
  }
})
module.exports = router; 