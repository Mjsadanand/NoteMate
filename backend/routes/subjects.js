import express from 'express';
import {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
} from '../controller/subjectController.js';

const router = express.Router();

router.get('/', getAllSubjects); // Get all subjects
router.get('/:id', getSubjectById); // Get subject by ID
router.post('/', createSubject); // Create a new subject
router.put('/:id', updateSubject); // Update a subject by ID
router.delete('/:id', deleteSubject); // Delete a subject by ID

export default router;
