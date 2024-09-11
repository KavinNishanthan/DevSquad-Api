// Importing packages
import multer from 'multer';

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to upload files
 */

const upload = multer({ dest: 'uploads/' });

export default upload;
