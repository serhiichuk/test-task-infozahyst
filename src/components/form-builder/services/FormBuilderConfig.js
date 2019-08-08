import _ from 'lodash';

import ImportanceValue from '@/enums/ImportanceValue';
import JobPositionValue from '@/enums/JobPositionValue';

export const CONFIG_ITEM_TYPE_MAP = {
    INT:     'int',
    FLOAT:   'float',
    STRING:  'string',
    DATE:    'date',
    BOOLEAN: 'boolean',
    ENUM:    'enum'
};

const CONFIG_ITEM_TYPES_FOR_RANGE_VALIDATION = [
    CONFIG_ITEM_TYPE_MAP.INT,
    CONFIG_ITEM_TYPE_MAP.FLOAT,
    CONFIG_ITEM_TYPE_MAP.DATE
];

const CONFIG_ITEM_TYPES_FOR_LENGTH_VALIDATION = [CONFIG_ITEM_TYPE_MAP.STRING];

const CONFIG_ITEM_TYPES_LIST = Object.values(CONFIG_ITEM_TYPE_MAP);

const ENUM_TYPES = {
    ImportanceValue,
    JobPositionValue
};

export default class FormBuilderConfig {
    /**
     * @param {string} code
     * @param {object[]} attributes
     * @returns {{code:string, attributes:object[]}}
     * @throws {TypeError}
     */
    constructor(code, attributes) {
        if (!_.isString(code)) {
            throw new TypeError('"code" should be a string');
        }

        if (!(_.isArray(attributes) && attributes.every(_.isPlainObject))) {
            throw new TypeError('"attributes" should be an array of objects');
        }

        this.code       = code;
        this.attributes = attributes.map(this._prepareAttribute.bind(this));
    }

    /**
     * @param {string} title
     * @param {string} code
     * @param {string} type
     * @param {object} [validation]
     * @param {string} [enumType]
     * @param {boolean} [multiple]
     * @returns {object}
     */
    _prepareAttribute({
                          title,
                          code,
                          type = 'string',
                          validation,
                          enumType,
                          multiple
                      }) {
        if (!_.isString(title)) {
            throw new TypeError('"title" should be a string if exist');
        }

        if (!_.isString(code)) {
            throw new TypeError('"code" should be a string');
        }

        if (!CONFIG_ITEM_TYPES_LIST.includes(type)) {
            throw new TypeError(
                `'type' should be equal to one of that '${CONFIG_ITEM_TYPES_LIST}' values`
            );
        }

        if (validation && !_.isPlainObject(validation)) {
            throw new TypeError('"validation" should be an object if exist');
        }

        if (multiple && !_.isBoolean(multiple)) {
            throw new TypeError('"multiple" should be a boolean if exist');
        }

        if (
            type === CONFIG_ITEM_TYPE_MAP.ENUM &&
            !Object.keys(ENUM_TYPES).includes(enumType)
        ) {
        debugger;
            throw new TypeError(
                `'enumType' should be equal to one of that '${Object.keys(
                    ENUM_TYPES
                )}' values`
            );
        }

        if (validation) {
            const {
                      required,
                      pattern,
                      email,
                      min,
                      max,
                      minlength,
                      maxlength
                  } = validation;

            if (required && !_.isBoolean(required)) {
                throw new TypeError('"validation.required" should ba a boolean');
            }

            if (pattern && !_.isString(pattern)) {
                throw new TypeError('"validation.pattern" should ba a string');
            }

            if (email && !_.isBoolean(email)) {
                throw new TypeError('"validation.email" should ba a boolean');
            }

            const isAvailableTypeForRangeValidation = CONFIG_ITEM_TYPES_FOR_RANGE_VALIDATION.includes(type);

            if (min && isAvailableTypeForRangeValidation && !_.isNumber(min)) {
                throw new TypeError('"validation.min" should ba a number');
            }

            if (max && isAvailableTypeForRangeValidation && !_.isNumber(max)) {
                throw new TypeError('"validation.max" should ba a number');
            }

            const isAvailableTypeForLengthValidation = CONFIG_ITEM_TYPES_FOR_LENGTH_VALIDATION.includes(type);

            if (minlength && isAvailableTypeForLengthValidation && !_.isNumber(minlength)) {
                throw new TypeError('"validation.minlength" should ba a number');
            }

            if (maxlength && isAvailableTypeForLengthValidation && !_.isNumber(maxlength)) {
                throw new TypeError('"validation.maxlength" should ba a number');
            }
        }

        return {
            title,
            code,
            type,
            enumType,
            validation,
            multiple
        };
    }
}
