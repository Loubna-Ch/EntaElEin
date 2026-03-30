import pool from '../config/db';

export class UserRepository {
  static async findAll() {
    const result = await pool.query(
      'SELECT userid, username, email, phonenumber, address, dateofbirth, role, regionid FROM public."User" ORDER BY userid ASC',
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await pool.query(
      'SELECT userid, username, email, phonenumber, address, dateofbirth, role, regionid FROM public."User" WHERE userid = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  static async findByEmail(email: string) {
    const result = await pool.query(
      'SELECT * FROM public."User" WHERE email = $1',
      [email],
    );
    return result.rows[0] || null;
  }

  static async create(userData: {
    username: string;
    email: string;
    password: string;
    phonenumber?: string;
    address?: string;
    dateofbirth?: string;
    role?: string;
    regionid?: number;
  }) {
    const {
      username,
      email,
      password,
      phonenumber,
      address,
      dateofbirth,
      role,
      regionid,
    } = userData;

    const result = await pool.query(
      `INSERT INTO public."User" (username, email, password, phonenumber, address, dateofbirth, role, regionid)
             VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'citizen'), $8)
             RETURNING userid, username, email, role`,
      [
        username,
        email,
        password,
        phonenumber || null,
        address || null,
        dateofbirth || null,
        role || null,
        regionid || null,
      ],
    );
    return result.rows[0];
  }

  static async update(
    id: number,
    data: {
      username: string;
      email: string;
      phonenumber?: string;
      address?: string;
      dateofbirth?: string;
      role?: string;
    },
  ) {
    const { username, email, phonenumber, address, dateofbirth, role } = data;
    const result = await pool.query(
      `UPDATE public."User" 
             SET username = $1, email = $2, phonenumber = $3, address = $4, dateofbirth = $5, role = $6
             WHERE userid = $7
             RETURNING userid, username, email, role`,
      [
        username,
        email,
        phonenumber || null,
        address || null,
        dateofbirth || null,
        role || null,
        id,
      ],
    );
    return result.rows[0] || null;
  }

  static async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM public."User" WHERE userid = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}
