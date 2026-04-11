import pool from '../config/db';

export class HadasRepository {
  static async findAll() {
    const result = await pool.query(
      'SELECT hadasid, hadasdescription FROM public."hadas" ORDER BY hadasid ASC',
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await pool.query(
      'SELECT hadasid, hadasdescription FROM public."hadas" WHERE hadasid = $1',
      [id],
    );
    return result.rows[0] || null;
  }
  
  static async create(hadasData: {
    hadasdescription: string;
  }) {
    const { hadasdescription } = hadasData;

    const result = await pool.query(
      `INSERT INTO public."hadas" (hadasdescription)
             VALUES ($1)
             RETURNING hadasid, hadasdescription`,
      [hadasdescription],
    );
    return result.rows[0];
  }

  static async update(
    id: number,
    data: {
      hadasdescription: string;
    },
  ) {
    const { hadasdescription } = data;
    const result = await pool.query(
      `UPDATE public."hadas" 
             SET hadasdescription = $1
             WHERE hadasid = $2
             RETURNING hadasid, hadasdescription`,
      [
        hadasdescription || null, id,
      ],
    );
    return result.rows[0] || null;
  }

  static async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM public."hadas" WHERE hadasid = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
