import pool from '../config/db';

export class RegionRepository {
    
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM public."region" ORDER BY regionid ASC',
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await pool.query(
      'SELECT * FROM public."region" WHERE regionid  = $1',
      [id],
    );
    return result.rows[0] || null;
  }


  static async create(regionData: {
    regionname: string;
  }) {
    const { regionname } = regionData;

    const result = await pool.query(
      `INSERT INTO public."region" (regionname)
             VALUES ($1)
             RETURNING regionid, regionname`,
      [regionname],
    );
    return result.rows[0];
  }

  static async update(
    id: number,
    data: {
      regionname: string;
    },
  ) {
    const { regionname } = data;
    const result = await pool.query(
      `UPDATE public."region" 
             SET regionname = $1
             WHERE regionid = $2
             RETURNING regionid, regionname`,
      [
        regionname || null, id,
      ],
    );
    return result.rows[0] || null;
  }

  static async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM public."region" WHERE regionid = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
