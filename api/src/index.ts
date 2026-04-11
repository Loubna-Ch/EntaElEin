import path from 'path';
import dotenv from 'dotenv';
import app from './app';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT: number | string = process.env.PORT || process.env.SERVER_PORT || 3001;


app.listen(PORT, () => {
  
    console.log(`Server running on http://localhost:${PORT}`);
});