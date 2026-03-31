import pool from '../config/db';

export class ReportRepository {
    
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM public."Report" ORDER BY reportid ASC',
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await pool.query(
      'SELECT * FROM public."Report" WHERE reportid  = $1',
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
    hadasis: number
  }) {
    const { crimedate, reportdate, description, status , image_url, userid, regionid, hadasis } = reportData;

    const result = await pool.query(
      `INSERT INTO public."Report" (crimedate, reportdate, description, status, image_url, userid, regionid, hadasis)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING reportid, crimedate, reportdate, description, status, image_url, userid, regionid, hadasis`,
      [crimedate, reportdate, description, status, image_url || null, userid, regionid, hadasis],
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
      hadasis: number;
    },
  ) {
    const { crimedate, reportdate, description, status, image_url, userid, regionid, hadasis } = data;
    const result = await pool.query(
      `UPDATE public."Report" 
             SET crimedate = $1, reportdate = $2, description = $3, status = $4, image_url = $5, userid = $6, regionid = $7, hadasis = $8
             WHERE reportid = $9
             RETURNING reportid, crimedate, reportdate, description, status, image_url, userid, regionid, hadasis`,
      [
        crimedate,
        reportdate,
        description,
        status,
        image_url || null,
        userid,
        regionid,
        hadasis,
        id
      ],
    );
    return result.rows[0] || null;
  }

  static async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM public."Report" WHERE reportid = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
