import { REGEX } from '../global/constants/helpers';

/**
 * Проверка полей
 * @param field
 * @param value
 */
export function checkField(field: string, value: string) {
  return REGEX[field].test(value);
}
