import express from 'express';
import {
    getAllSubjects,
    getSubjectById,
    createSubject,
    getSubjectsWithNotes,
} from '../controller/subjectController.js';

const router = express.Router();

// Place the specific route before the parameterized route
router.get('/info', getSubjectsWithNotes); // Get subjects with notes count
router.get('/', getAllSubjects); // Get all subjects
router.get('/:id', getSubjectById); // Get subject by ID
router.post('/', createSubject); // Create a new subject

export default router;
