import pool from '../config/db';

export class ParticipantsRepository {
    
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM public."participant" ORDER BY participantid ASC',
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await pool.query(
      'SELECT * FROM public."participant" WHERE participantid  = $1',
      [id],
    );
    return result.rows[0] || null;
  }


  static async create(participantData: {
    participantname: string;
    pdateofbirth?: string;
    gender?: string;
    description?: string;
    participanttype: string;
  }) {
    const { participantname, pdateofbirth, gender, description, participanttype } = participantData;

    const result = await pool.query(
      `INSERT INTO public."participant" (participantname, pdateofbirth, gender, description, participanttype)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING participantid, participantname, pdateofbirth, gender, description`,
      [participantname, pdateofbirth, gender, description, participanttype],
    );
    return result.rows[0];
  }

  static async update(
    id: number,
    data: {
      participantname: string;
      pdateofbirth?: string;
      gender?: string;
      description?: string;
      participanttype?: string;
    },
  ) {
    const { participantname, pdateofbirth, gender, description, participanttype } = data;
    const result = await pool.query(
      `UPDATE public."participant" 
             SET participantname = $1, pdateofbirth = $2, gender = $3, description = $4, participanttype = $5
             WHERE participantid = $6
             RETURNING participantid, participantname, pdateofbirth, gender, description, participanttype`,
      [
        participantname || null,
        pdateofbirth || null,
        gender || null,
        description || null,
        participanttype || null,
        id,
      ],
    );
    return result.rows[0] || null;
  }

  static async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM public."participant" WHERE participantid = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
