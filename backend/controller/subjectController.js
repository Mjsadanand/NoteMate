import Subject from '../models/subjects.js';

// Fetch all subjects
export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
};

// Fetch a specific subject by ID
export const getSubjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await Subject.findById(id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        res.json(subject);
    } catch (error) {
        console.error('Error fetching subject:', error);
        res.status(500).json({ error: 'Failed to fetch subject' });
    }
};

// Create a new subject
export const createSubject = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) return res.status(400).json({ error: 'Subject name is required' });
        const newSubject = new Subject({ name });
        const savedSubject = await newSubject.save();
        res.status(201).json(savedSubject);
    } catch (error) {
        console.error('Error creating subject:', error);
        res.status(500).json({ error: 'Failed to create subject' });
    }
};

// Update an existing subject by ID
export const updateSubject = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        if (!name) return res.status(400).json({ error: 'Subject name is required' });
        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true } // Return the updated document and validate updates
        );
        if (!updatedSubject) return res.status(404).json({ error: 'Subject not found' });
        res.json(updatedSubject);
    } catch (error) {
        console.error('Error updating subject:', error);
        res.status(500).json({ error: 'Failed to update subject' });
    }
};

// Delete a subject by ID
export const deleteSubject = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSubject = await Subject.findByIdAndDelete(id);
        if (!deletedSubject) return res.status(404).json({ error: 'Subject not found' });
        res.json({ message: 'Subject deleted successfully', deletedSubject });
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).json({ error: 'Failed to delete subject' });
    }
};
