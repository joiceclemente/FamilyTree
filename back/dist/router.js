"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const person_1 = require("./models/person");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
router.get('/person/ids', async (req, res) => {
    try {
        const people = await person_1.Person.find().exec();
        res.status(200).json(people);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error fetching persons', message: error.message });
        }
        else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});
router.post('/person', async (req, res) => {
    try {
        if (req.body.gender !== 'Male' && req.body.gender !== 'Female') {
            return res.status(400).json({ error: 'Invalid gender value' });
        }
        const existingPerson = await person_1.Person.findOne({ id: req.body.id });
        if (existingPerson) {
            return res.status(400).json({ error: 'Person with this ID already exists' });
        }
        const findPersonById = async (id) => {
            if (id === null || id === undefined)
                return null;
            const person = await person_1.Person.findOne({ id }).exec();
            if (!person) {
                console.error(`No person found with id ${id}`);
                return null;
            }
            return person;
        };
        const partner = await findPersonById(req.body.partnerId);
        const father = await findPersonById(req.body.fatherId);
        const mother = await findPersonById(req.body.motherId);
        console.log('Associated persons:', { partner, father, mother });
        const newPerson = new person_1.Person({
            ...req.body,
            partnerId: partner ? partner.id : null,
            fatherId: father ? father.id : null,
            motherId: mother ? mother.id : null,
        });
        await newPerson.save();
        if (partner) {
            await person_1.Person.findOneAndUpdate({ id: partner.id }, { partnerId: newPerson.id });
        }
        console.log('Person saved successfully:', newPerson);
        res.status(201).json(newPerson);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error saving person', message: error.message });
        }
        else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});
router.put('/person/:id', async (req, res) => {
    try {
        const { gender, partnerId, fatherId, motherId, ...rest } = req.body;
        const existingPerson = await person_1.Person.findOne({ id: req.params.id });
        if (!existingPerson) {
            return res.status(404).json({ error: 'Person not found' });
        }
        if (gender && gender !== 'Male' && gender !== 'Female') {
            return res.status(400).json({ error: 'Invalid gender value' });
        }
        const updateFields = { ...rest };
        if (gender)
            updateFields.gender = gender;
        if (typeof partnerId !== 'undefined') {
            if (partnerId) {
                const partner = await person_1.Person.findOne({ id: partnerId });
                if (!partner) {
                    return res.status(400).json({ error: 'Invalid partner ID' });
                }
                updateFields.partnerId = partnerId;
            }
            else {
                updateFields.partnerId = null;
            }
        }
        if (typeof fatherId !== 'undefined') {
            if (fatherId) {
                const father = await person_1.Person.findOne({ id: fatherId });
                if (!father) {
                    return res.status(400).json({ error: 'Invalid father ID' });
                }
                updateFields.fatherId = fatherId;
            }
            else {
                updateFields.fatherId = null;
            }
        }
        if (typeof motherId !== 'undefined') {
            if (motherId) {
                const mother = await person_1.Person.findOne({ id: motherId });
                if (!mother) {
                    return res.status(400).json({ error: 'Invalid mother ID' });
                }
                updateFields.motherId = motherId;
            }
            else {
                updateFields.motherId = null;
            }
        }
        const updatedPerson = await person_1.Person.findOneAndUpdate({ id: req.params.id }, { $set: updateFields }, { new: true });
        if (!updatedPerson) {
            return res.status(404).json({ error: 'Person not found after update' });
        }
        res.status(200).json(updatedPerson);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error updating person:', error.message);
            res.status(500).json({ error: 'Error updating person', message: error.message });
        }
        else {
            console.error('Unknown error occurred:', error);
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});
router.delete('/person/reset', async (req, res) => {
    try {
        await person_1.Person.deleteMany({});
        await mongoose_1.default.model('Counter').findOneAndUpdate({ name: 'personId' }, { $set: { value: 0 } }, { new: true, upsert: true });
        res.status(200).json({ message: 'All records have been deleted and IDs have been reset.' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error when resetting people', message: error.message });
        }
        else {
            res.status(500).json({ error: 'Unknown error', message: 'Unknown error occurred' });
        }
    }
});
router.delete('/person/:id', async (req, res) => {
    try {
        const deletedPerson = await person_1.Person.findOneAndDelete({ id: req.params.id });
        if (!deletedPerson) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json({ message: 'Person deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting person:', error.message);
            res.status(500).json({ error: 'Error deleting person', message: error.message });
        }
        else {
            console.error('Unknown error occurred:', error);
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});
exports.default = router;
