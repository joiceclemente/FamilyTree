import { Request, Response } from 'express';
import { Person } from '../models/person';

export const createPerson = async (req: Request, res: Response) => {
  const { name, gender, id, partnerId, fatherId, motherId } = req.body;

  try {
    const newPerson = new Person({
      name,
      gender,
      id,
      partnerId: partnerId || null,
      fatherId: fatherId || null,
      motherId: motherId || null,
    });

    await newPerson.save();
    
    res.status(201).json({ message: 'Person created successfully', person: newPerson });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating person:', error.message);
      res.status(500).json({ message: 'Error creating person', error: error.message });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};
