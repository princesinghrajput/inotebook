const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//ROUTE 1: GET ALL THE NOTES USING: GET: "/api/auth/getallnotes". required logIn
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE 2: ADD A NEW NOTES USING: GET: "/api/auth/Aaddnotes".  required logIn
router.get(
    "/addnotes",
    fetchuser,
    [
        body("title", "Enter a valid title").isLength({ min: 3 }),
        body("description", "Description must be of atleast 5 character").isLength({
            min: 5,
        }),
    ],
    async (req, res) => {
        //if there are errors return errors and bad request


        try {
            const { title, description, tag } = req.body;
            const errors = validationResult(req);
            //if there are error return error and bad request
            if (!errors.isEmpty) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Notes({
                title, description, tag, user: req.user.id
            })
            const savedNotes = await note.save()

            res.json(savedNotes)
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");

        }
    }
);

//ROUTE 3: UPDATE AN EXISTING NOTES: PUT: "/api/auth/updatenotes".  required logIn
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    //create  a newNote object
    const newNote = {};
    if (title) {
        newNote.title = title
    };
    if (description) {
        newNote.description = description
    };
    if (tag) {
        newNote.tag = tag
    };

    //find the note to be updated and update it

    let note = await Notes.findById(req.params.id);
    if (!note) {
        return res.status(404).send("Not found");
    }

    if (note.user.toString() != req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note });
});


//ROUTE 4: DELETE AN EXISTING NOTES: DELETE: "/api/auth/deletenotes".  required logIn
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;


    //find the note to be updated and update it

    let note = await Notes.findById(req.params.id);
    if (!note) {
        return res.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    };

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({ "Success:": "Note has been deleted", note:note });
});

module.exports = router;
