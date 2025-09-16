import {
  stringify,
  JsValue,
  bigIntToString,
  dateToISOString,
  symbolToString,
  errorToObject,
  mapToObject,
  setToArray,
} from "../deps.ts";

/**
 * Enhanced JSON serialization with support for complex JavaScript types.
 *
 * This function extends the native JSON.stringify() functionality by properly
 * serializing JavaScript values that would otherwise cause issues in standard
 * JSON serialization, including:
 *
 * - BigInt values (converted to strings)
 * - Date objects (converted to ISO strings)
 * - Symbol values (converted to strings)
 * - Error objects (converted to descriptive objects)
 * - Map objects (converted to regular objects)
 * - Set objects (converted to arrays)
 *
 * Uses the @mastermindzh/composable-json-stringify package under the hood,
 * which provides a modular approach to JSON serialization.
 *
 * @param {JsValue} value - The JavaScript value to stringify
 * @param {number} space - Number of spaces for indentation (default: 2)
 * @returns {string} A properly formatted JSON string
 *
 * @example
 * // Handles BigInt values that would normally throw errors
 * const data = { id: BigInt("9007199254740991") };
 * const json = jsonStringify(data);
 * // Result: { "id": "9007199254740991" }
 *
 * @example
 * // Properly formats Date objects
 * const event = { timestamp: new Date("2025-01-01T00:00:00.000Z") };
 * const json = jsonStringify(event);
 * // Result: { "timestamp": "2025-01-01T00:00:00.000Z" }
 */
export const jsonStringify = (value: JsValue, space: number = 2) => {
  return stringify(
    value,
    [bigIntToString, dateToISOString, symbolToString, errorToObject, mapToObject, setToArray],
    space,
  );
};
