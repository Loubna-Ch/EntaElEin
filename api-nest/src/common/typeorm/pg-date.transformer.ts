import { ValueTransformer } from 'typeorm';

/**
 * PostgreSQL `date` columns are often read as `YYYY-MM-DD` strings. Coerce to `Date` at UTC
 * midnight so GraphQL `DateTime` serialization and app logic see a real `Date`.
 */
export const pgDateToUtcDateTransformer: ValueTransformer = {
  to(value: Date | null | undefined): Date | null | undefined {
    return value ?? null;
  },
  from(value: unknown): Date | null {
    if (value == null) return null;
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }
    if (typeof value === 'string') {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
      if (m) {
        return new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z`);
      }
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    return null;
  },
};
