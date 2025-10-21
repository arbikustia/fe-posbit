import { z } from 'zod';

export const pointSchema = z.object({
  amount_per_point: z.preprocess((val) => {
    if (typeof val === 'string') return val.trim() === '' ? NaN : Number(val);
    return val;
  }, z.number().gt(0, 'Amount per Point must be > 0')),

  point_value: z.preprocess((val) => {
    if (typeof val === 'string') return val.trim() === '' ? NaN : Number(val);
    return val;
  }, z.number().gt(0, 'Point Value must be > 0')),

  is_active: z.preprocess((val) => {
    // normalize string values from query params or form to boolean,
    // allow undefined so default(true) can apply
    if (typeof val === 'string') {
      const v = val.trim().toLowerCase();
      if (v === '') return undefined;
      if (v === 'true' || v === '1') return true;
      if (v === 'false' || v === '0') return false;
    }
    return val;
  }, z.boolean().default(true))
});