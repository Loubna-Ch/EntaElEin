import pool from '../config/db';

export class InvolvedInRepository {
    
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM public."InvolvedIn" ORDER BY involvedinid ASC',
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await pool.query(
      'SELECT * FROM public."InvolvedIn" WHERE involvedinid  = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  static async create(involvedInData: {
    participantid: number;
    reportid: number;
  }) {
    const { participantid, reportid } = involvedInData;

    const result = await pool.query(
      `INSERT INTO public."InvolvedIn" (participantid, reportid)
             VALUES ($1, $2)
             RETURNING involvedinid, participantid, reportid`,
      [participantid, reportid],
    );
    return result.rows[0];
  }

  static async update(
    id: number,
    data: {
      participantid: number;
      reportid: number;
    },
  ) {
    const { participantid, reportid } = data;
    const result = await pool.query(
      `UPDATE public."InvolvedIn" 
             SET participantid = $1, reportid = $2
             WHERE involvedinid = $3
             RETURNING involvedinid, participantid, reportid`,
      [
        participantid || null,
        reportid || null,
        id,
      ],
    );
    return result.rows[0] || null;
  }

  static async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM public."InvolvedIn" WHERE involvedinid = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
