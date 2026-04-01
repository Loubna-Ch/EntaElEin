import pool from '../config/db';

export class AlertFromAiRepository {
    
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM public."alertfromai" ORDER BY alertid ASC',
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await pool.query(
      'SELECT * FROM public."alertfromai" WHERE alertid  = $1',
      [id],
    );
    return result.rows[0] || null;
  }


  static async create(alertData: {
    title: string;
    message: string;
    hadasid: number;
  }) {
    const { title, message, hadasid } = alertData;

    const result = await pool.query(
      `INSERT INTO public."alertfromai" (title, message, hadasid)
             VALUES ($1, $2, $3)
             RETURNING alertid, title, message, hadasid`,
      [title, message, hadasid],
    );
    return result.rows[0];
  }

  static async update(
    id: number,
    data: {
      title: string;
      message: string;
      hadasid: number;
    },
  ) {
    const { title, message, hadasid } = data;
    const result = await pool.query(
      `UPDATE public."alertfromai" 
             SET title = $1, message = $2, hadasid = $3
             WHERE alertid = $4
             RETURNING alertid, title, message, hadasid`,
      [
        title || null,
        message || null,
        hadasid || null,
        id,
      ],
    );
    return result.rows[0] || null;
  }

  static async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM public."alertfromai" WHERE alertid = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
