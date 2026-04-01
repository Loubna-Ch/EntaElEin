import pool from '../config/db';

export class FeedbackRepository {
    
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM public.feedback ORDER BY dateposted DESC',
    );
    return result.rows;
  }

  static async findById(id: number) {
    const result = await pool.query(
      'SELECT * FROM public.feedback WHERE feedbackid = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  static async create(feedbackData: {
    content: string;
    rating: number; 
    userid: number;
  }) {
    const { content, rating, userid } = feedbackData;

    const result = await pool.query(
      `INSERT INTO public.feedback (content, rating, userid)
       VALUES ($1, $2, $3)
       RETURNING feedbackid, content, rating, dateposted, userid`,
      [content, rating, userid],
    );
    return result.rows[0];
  }

  static async update(
    id: number,
    data: {
      content: string;
      rating: number;
      userid: number;
    },
  ) {
    const { content, rating, userid } = data;
    const result = await pool.query(
      `UPDATE public.feedback 
       SET content = $1, rating = $2, userid = $3
       WHERE feedbackid = $4
       RETURNING feedbackid, content, rating, dateposted, userid`,
      [
        content || null,
        rating || null,
        userid || null,
        id,
      ],
    );
    return result.rows[0] || null;
  }

  static async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM public.feedback WHERE feedbackid = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  }
}