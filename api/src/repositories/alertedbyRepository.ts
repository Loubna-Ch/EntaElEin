import pool from '../config/db';

export class AlertedByRepository {
    
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM public.alertedby ORDER BY sentat ASC',
    );
    return result.rows;
  }

  static async findByIds(userid: number, alertid: number) {
    const result = await pool.query(
      'SELECT * FROM public.alertedby WHERE userid = $1 AND alertid = $2',
      [userid, alertid],
    );
    return result.rows[0] || null;
  }

  static async create(alertedByData: {
    userid: number;
    alertid: number;
  }) {
    const { userid, alertid } = alertedByData;

    const result = await pool.query(
      `INSERT INTO public.alertedby (userid, alertid, sentat)
       VALUES ($1, $2, $3)
       RETURNING userid, alertid`,
      [userid, alertid],
    );
    return result.rows[0];
  }

  static async update(
    oldUserId: number,
    oldAlertId: number,
    newData: { userid: number; alertid: number }
  ) {
    const { userid, alertid } = newData;
    const result = await pool.query(
      `UPDATE public.alertedby 
       SET userid = $1, alertid = $2
       WHERE userid = $3 AND alertid = $4
       RETURNING userid, alertid, sentat`,
      [userid, alertid, oldUserId, oldAlertId],
    );
    return result.rows[0] || null;
  }

  static async remove(userid: number, alertid: number) {
    const result = await pool.query(
      'DELETE FROM public.alertedby WHERE userid = $1 AND alertid = $2',
      [userid, alertid],
    );
    return (result.rowCount ?? 0) > 0;
  }
}