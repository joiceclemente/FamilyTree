"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPerson = void 0;
const person_1 = require("../models/person");
const createPerson = async (req, res) => {
    const { name, gender, id, partnerId, fatherId, motherId } = req.body;
    try {
        const newPerson = new person_1.Person({
            name,
            gender,
            id,
            partnerId: partnerId || null,
            fatherId: fatherId || null,
            motherId: motherId || null,
        });
        await newPerson.save();
        res.status(201).json({ message: 'Person created successfully', person: newPerson });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error creating person:', error.message);
            res.status(500).json({ message: 'Error creating person', error: error.message });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
};
exports.createPerson = createPerson;
