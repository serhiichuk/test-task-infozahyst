<template>
    <el-form :model="form" ref="form">
        <template v-for="item in formItems">
            <template v-if="item.multiple">
                <template v-for="(value, index) in form[item.key]">
                    <el-form-item
                            :key="getItemMultipleProp(item.key, index)"
                            :prop="getItemMultipleProp(item.key, index)"
                            :label="item.label"
                            :rules="item.rules"
                    >
                        <component
                                :is="item.componentName"
                                v-bind="item.attrs"
                                v-model="form[item.key][index]"
                        />
                        <el-button
                                type="danger"
                                :disabled="getIsDisabledItemMultipleBtn(item.key)"
                                @click="onRemoveItemMultiple(item.key, index)"
                        >
                            Видалити
                        </el-button>
                    </el-form-item>
                </template>

                <el-button type="primary" @click="onAddItemMultiple(item.key)">Додати</el-button>
            </template>

            <template v-else>
                <el-form-item
                        :key="item.key"
                        :prop="item.key"
                        :label="item.label"
                        :rules="item.rules"
                >
                    <component
                            :is="item.componentName"
                            v-bind="item.attrs"
                            v-model="form[item.key]"
                    />
                </el-form-item>
            </template>
        </template>

        <el-form-item>
            <el-button type="success" @click="onSubmitForm">Зберегти</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import _ from 'lodash';

    import FormBuilderConfig, { CONFIG_ITEM_TYPE_MAP, ENUM_TYPES } from './services/FormBuilderConfig';

    /**
     * @param {object[]} enumList
     * @returns {object[]}
     */
    function normalizeEnumListToOptions(enumList) {
        const idToIndexMap = {};
        const options      = [];
        const result       = [];

        for (let i = 0; i < enumList.length; i += 1) {
            idToIndexMap[enumList[i].id] = i;
            options.push({
                value:    enumList[i].id,
                label:    enumList[i].title,
                parentId: enumList[i].parentId,
            });
        }

        for (let i = 0; i < options.length; i += 1) {
            const node = options[i];

            if (node.parentId) {
                if (!options[idToIndexMap[node.parentId]].children) {
                    options[idToIndexMap[node.parentId]].children = [];
                }

                options[idToIndexMap[node.parentId]].children.push(node);
            } else {
                result.push(node);
            }
        }

        return result;
    }

    /**
     * @param {object} attribute
     * @return {object}
     * @constructor
     */
    const FORM_INPUT_COMMON_GETTER = attribute => ({
        key:      attribute.code,
        label:    attribute.title,
        multiple: attribute.multiple,
        rules:    {
            ...(attribute.validation || {}),
            trigger: ['change', 'blur'],
        },
    });

    const CONFIG_ITEM_TYPE_TO_FORM_INPUT_GETTER_MAP = {
        [CONFIG_ITEM_TYPE_MAP.INT]:     () => ({
            componentName: 'el-input-number',
            attrs:         { type: 'number' },
            rules:         { type: 'integer' },
        }),
        [CONFIG_ITEM_TYPE_MAP.FLOAT]:   () => ({
            componentName: 'el-input-number',
            attrs:         { type: 'number', precision: 2 },
            rules:         { type: 'number' },
        }),
        [CONFIG_ITEM_TYPE_MAP.STRING]:  attribute => ({
            componentName: 'el-input',
            rules:         {
                min:  attribute.validation && attribute.validation.minlength,
                max:  attribute.validation && attribute.validation.maxlength,
                type: attribute.validation && attribute.validation.email ? 'email' : 'string',
            },
        }),
        [CONFIG_ITEM_TYPE_MAP.DATE]:    () => ({
            componentName: 'el-date-picker',
            rules:         { type: 'date' },
        }),
        [CONFIG_ITEM_TYPE_MAP.BOOLEAN]: () => ({
            componentName: 'el-checkbox',
        }),
        [CONFIG_ITEM_TYPE_MAP.ENUM]:    attribute => ({
            componentName: 'el-cascader',
            attrs:         {
                showAllLevels: false,
                props:         { emitPath: false },
                filterable:    true,
                options:       normalizeEnumListToOptions(ENUM_TYPES[attribute.enumType]),
            },
            rules:         { type: 'number' },
        }),

    };

    export default {
        name: 'FormBuilder',

        props: {
            config: {
                required: true,
                type:     FormBuilderConfig,
            },
            // todo: add model constructor or validator
            model:  {
                required: true,
                type:     Object,
            },
        },

        data() {
            return {
                form: this.getInitForm(),
            };
        },

        computed: {
            /**
             * @return {object[]}
             */
            formItems() {
                return this.config.attributes.map(attribute => _.merge(
                    FORM_INPUT_COMMON_GETTER(attribute),
                    CONFIG_ITEM_TYPE_TO_FORM_INPUT_GETTER_MAP[attribute.type](attribute),
                ));
            },
        },

        methods: {
            /**
             * @return {object}
             */
            getInitForm() {
                return _.mapValues(this.model, value => {
                    if (_.isArray(value) && value.length === 0) {
                        value.push('');
                    }

                    return value;
                });
            },

            /**
             * @param {string} key
             */
            getIsDisabledItemMultipleBtn(key) {
                return this.form[key].length <= 1;
            },

            /**
             * @param {string} key
             * @param {number} index
             */
            getItemMultipleProp(key, index) {
                return `${key}.${index}`;
            },

            /**
             * @param {string} key
             */
            onAddItemMultiple(key) {
                this.form[key].push('');
            },

            /**
             * @param {string} key
             * @param {number} index
             */
            onRemoveItemMultiple(key, index) {
                this.form[key].splice(index, 1);
            },

            async onSubmitForm() {
                this.$refs.form.validate(isValid => {
                    if (isValid) {
                        this.$emit('update:model', this.form);
                    } else {
                        console.error('Form is invalid!!!');
                    }
                });
            },
        },
    };
</script>

<style lang="scss">
    // todo: add styling (:
</style>
