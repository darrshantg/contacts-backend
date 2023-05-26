const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler( async (req,res)=> {
    const contacts = await Contact.find({user_id: req.User.id});
    res.status(200).json(contacts)
});

//@desc Create a contact
//@route POST /api/contacts
//@access private

const createContact =asyncHandler( async (req,res)=> {
    console.log("Request body:", req.body);
    const {name,email,phone} = req.body;
    if(!email || !phone || !name) {
        res.status(400);
        throw new Error("All fields required!");
    }
    const contact = await Contact.create({
        name, email, phone, user_id: req.User.id
    });
    res.status(201).json(contact)
});

//@desc Get a contact
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler( async (req,res)=> {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

//@desc update a contact
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (req,res)=> {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
   
    if(contact.user_id.toString() !== req.User.id) {
        res.status(403);
        throw new Error("User doesn't have permission to update other user's contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id, req.body, { new: true }
    )
    res.status(200).json(updatedContact);
});

//@desc delete a contact
//@route DELETE /api/contacts/:id
//@access private

const deleteContact =asyncHandler(async (req,res)=> {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.User.id) {
        res.status(403);
        throw new Error("User doesn't have permission to update other user's contacts");
    }
    
    await Contact.findByIdAndRemove(req.params.id);
    res.status(200).json(contact);
});

module.exports = {getContacts, createContact, getContact, updateContact, deleteContact}