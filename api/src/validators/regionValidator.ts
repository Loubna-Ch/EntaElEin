import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const regionValidators = [
    body('regionname')
        .trim()
        .notEmpty()
        .withMessage('Location selection is required')
        .isIn([
            'Tripoli - El Mina', 
            'Tripoli - Abi Samra', 
            'Tripoli - El Tell', 
            'Tripoli - Qalamoun', 
            'Tripoli - Bab al-Tabbaneh', 
            'Tripoli - Jabal Mohsen', 
            'Tripoli - Azmi', 
            'Tripoli - Dam wa Farez',
            'Tripoli - Bahsas',
            'Beirut', 'Baabda', 'Matn', 'Shouf', 'Aley', 'Keserwan', 'Jbeil',
            'Akkar', 'Koura', 'Zgharta', 'Bsharri', 'Batroun', 'Minieh-Dannieh',
            'Zahlé', 'West Beqaa', 'Rashaya', 'Baalbek', 'Hermel',
            'Sidon', 'Tyre', 'Jezzine', 'Nabatieh', 'Marjeyoun', 'Hasbaya', 'Bint Jbeil'
        ])
        .withMessage('Please select a valid Lebanese Region or Tripoli Neighborhood'),

    validate,
];