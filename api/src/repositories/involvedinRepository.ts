import pool from '../config/db';

export class InvolvedInRepository {
    
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM public.involvedin ORDER BY reportid ASC',
    );
    return result.rows;
  }

  static async findByIds(participantid: number, reportid: number) {
    const result = await pool.query(
      'SELECT * FROM public.involvedin WHERE participantid = $1 AND reportid = $2',
      [participantid, reportid],
    );
    return result.rows[0] || null;
  }

  static async create(involvedInData: {
    participantid: number;
    reportid: number;
  }) {
    const { participantid, reportid } = involvedInData;

    const result = await pool.query(
      `INSERT INTO public.involvedin (participantid, reportid)
       VALUES ($1, $2)
       RETURNING participantid, reportid`,
      [participantid, reportid],
    );
    return result.rows[0];
  }

  static async update(
    oldParticipantId: number,
    oldReportId: number,
    newData: { participantid: number; reportid: number }
  ) {
    const { participantid, reportid } = newData;
    const result = await pool.query(
      `UPDATE public.involvedin 
       SET participantid = $1, reportid = $2
       WHERE participantid = $3 AND reportid = $4
       RETURNING participantid, reportid`,
      [participantid, reportid, oldParticipantId, oldReportId],
    );
    return result.rows[0] || null;
  }

  static async remove(participantid: number, reportid: number) {
    const result = await pool.query(
      'DELETE FROM public.involvedin WHERE participantid = $1 AND reportid = $2',
      [participantid, reportid],
    );
    return (result.rowCount ?? 0) > 0;
  }
}