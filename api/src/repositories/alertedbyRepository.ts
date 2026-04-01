import pool from "../config/db";

export class AlertbyRepository {
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM public."alertedby" ORDER BY userid ASC',
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await pool.query(
      'SELECT * FROM public."alertedby" WHERE alertbyid  = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  static async create(alertedbyData: {
    userid: number;
    alertid: number;
    sentat: Date;
  }) {
    const { userid, alertid, sentat } = alertedbyData;

    const result = await pool.query(
      `INSERT INTO public."Alertedby" (userid, alertid, sentat)
             VALUES ($1, $2, $3)
             RETURNING alertbyid, userid, alertid, sentat`,
      [userid, alertid, sentat],
    );
    return result.rows[0];
  }

  static async update(
    id: number,
    data: {
      userid: number;
      alertid: number;
      sentat: Date;
    },
  ) {
    const { userid, alertid, sentat } = data;
    const result = await pool.query(
      `UPDATE public."Alertedby" 
             SET userid = $1, alertid = $2, sentat = $3
             WHERE alertbyid = $4
             RETURNING alertbyid, userid, alertid, sentat`,
      [
        userid || null,
      ],
    );
    return result.rows[0] || null;
  }

  static async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM public."alertedby" WHERE alertbyid = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
