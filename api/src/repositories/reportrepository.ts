import pool from '../config/db';

export class ReportRepository {
    
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM public."crimereport" ORDER BY reportid ASC',
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await pool.query(
      'SELECT * FROM public."crimereport" WHERE reportid  = $1',
      [id],
    );
    return result.rows[0] || null;
  }
  
  static async create(reportData: {
    crimedate: string;
    crimetime?: string;
    reportdate: string;
    description: string;
    status: string;
    image_url?: string;
    userid: number;
    regionid: number;
    hadasid: number 
  }) {
    const { crimedate, crimetime, reportdate, description, status , image_url, userid, regionid, hadasid } = reportData;

    const result = await pool.query(
      `INSERT INTO public."crimereport" (crimedate, crimetime, reportdate, description, status, image_url, userid, regionid, hadasid)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING reportid, crimedate, crimetime, reportdate, description, status, image_url, userid, regionid, hadasid`,
      [crimedate, crimetime || null, reportdate, description, status, image_url || null, userid, regionid, hadasid],
    );
    return result.rows[0];
  }

  static async update(
    id: number,
    data: {
      crimedate: string;
      crimetime?: string;
      reportdate: string;
      description: string;
      status: string;
      image_url?: string;
      userid: number;
      regionid: number;
      hadasid: number;
    },
  ) {
    const { crimedate, crimetime, reportdate, description, status, image_url, userid, regionid, hadasid } = data;
    const result = await pool.query(
      `UPDATE public."crimereport" 
             SET crimedate = $1, crimetime = $2, reportdate = $3, description = $4, status = $5, image_url = $6, userid = $7, regionid = $8, hadasid = $9
             WHERE reportid = $10
             RETURNING reportid, crimedate, crimetime, reportdate, description, status, image_url, userid, regionid, hadasid`,
      [
        crimedate,
        crimetime || null,
        reportdate,
        description,
        status,
        image_url || null,
        userid,
        regionid,
        hadasid,
        id
      ],
    );
    return result.rows[0] || null;
  }

  static async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM public."crimereport" WHERE reportid = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
