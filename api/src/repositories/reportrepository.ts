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
    reportdate: string;
    description: string;
    status: string;
    image_url?: string;
    userid: number;
    regionid: number;
    hadasid: number 
  }) {
    const { crimedate, reportdate, description, status , image_url, userid, regionid, hadasid } = reportData;

    const result = await pool.query(
      `INSERT INTO public."crimereport" (crimedate, reportdate, description, status, image_url, userid, regionid, hadasid)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING reportid, crimedate, reportdate, description, status, image_url, userid, regionid, hadasid`,
      [crimedate, reportdate, description, status, image_url || null, userid, regionid, hadasid],
    );
    return result.rows[0];
  }

  static async update(
    id: number,
    data: {
      crimedate: string;
      reportdate: string;
      description: string;
      status: string;
      image_url?: string;
      userid: number;
      regionid: number;
      hadasid: number;
    },
  ) {
    const { crimedate, reportdate, description, status, image_url, userid, regionid, hadasid } = data;
    const result = await pool.query(
      `UPDATE public."crimereport" 
             SET crimedate = $1, reportdate = $2, description = $3, status = $4, image_url = $5, userid = $6, regionid = $7, hadasid = $8
             WHERE reportid = $9
             RETURNING reportid, crimedate, reportdate, description, status, image_url, userid, regionid, hadasid`,
      [
        crimedate,
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
