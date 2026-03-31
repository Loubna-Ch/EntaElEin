import pool from '../config/db';

export class HadasRepository {
  static async findAll() {
    const result = await pool.query(
      'SELECT hadasid, hadasdescription FROM public."Hadas" ORDER BY hadasid ASC',
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await pool.query(
      'SELECT hadasid, hadasdescription FROM public."Hadas" WHERE hadasid = $1',
      [id],
    );
    return result.rows[0] || null;
  }
  

  static async create(hadasData: {
    hadasdescription: string;
  }) {
    const { hadasdescription } = hadasData;

    const result = await pool.query(
      `INSERT INTO public."Hadas" (hadasdescription)
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
      `UPDATE public."Hadas" 
             SET hadasdescription = $1
             WHERE hadasid = $2
             RETURNING hadasid, hadasdescription`,
      [
        hadasdescription || null,
      ],
    );
    return result.rows[0] || null;
  }

  static async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM public."Hadas" WHERE hadasid = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
