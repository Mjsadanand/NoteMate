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


export const getSubjectsWithNotes = async (req, res) => {
    try {
        const subjects = await Subject.find(); // Fetch all subjects
        const subjectsWithCounts = subjects.map((subject) => ({
            _id: subject._id,
            name: subject.name,
            notesCount: subject.files ? subject.files.length : 0, // Count the number of notes (files) in each subject
        }));

        res.status(200).json({
            totalSubjects: subjects.length, // Total number of subjects
            subjects: subjectsWithCounts,  // Array of subjects with note counts
        });
    } catch (error) {
        console.error('Error fetching subjects with notes:', error.message);
        res.status(500).json({ error: 'Failed to fetch subjects with notes' });
    }
};
