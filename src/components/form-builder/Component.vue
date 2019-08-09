<template>
    <el-form :id="config.code" :model="form" :rules="validationRules" ref="form">
        <el-form-item
                v-for="(item, code) in viewData"
                :key="code"
                :prop="code"
                :label="item.label"
                :required="item.required"
        >
            <template v-if="item.multiple">
                <input-multiple
                        :componentName="item.componentName"
                        :value="item.attrs.value"
                        v-on="item.listeners"
                />
            </template>
            <template v-else>
                <component :is="item.componentName" v-bind="item.attrs" v-on="item.listeners"/>
            </template>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onSubmitForm">Зберегти</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import FormBuilderConfig, { CONFIG_ITEM_TYPE_MAP, ENUM_TYPES } from './services/FormBuilderConfig';
    import InputMultiple from '@/components/intput-multiple';

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

    export default {
        name: 'FormBuilder',

        components: { InputMultiple },

        props: {
            config: {
                required: true,
                type:     FormBuilderConfig,
            },
            model:  {
                required: true,
                type:     Object,
            },
        },

        data() {
            return {
                form: { ...this.model },
            };
        },

        computed: {
            /**
             * @return {object}
             */
            viewData() {
                const result = {};

                this.config.attributes.forEach(attribute => {
                    const item = {
                        label:    attribute.title,
                        required: attribute.validation && attribute.validation.required,
                        multiple: attribute.multiple,
                        attrs:    {
                            size:  'mini',
                            value: this.form[attribute.code],
                        },
                    };

                    if (
                        attribute.type === CONFIG_ITEM_TYPE_MAP.INT ||
                        attribute.type === CONFIG_ITEM_TYPE_MAP.FLOAT ||
                        attribute.type === CONFIG_ITEM_TYPE_MAP.STRING
                    ) {
                        item.componentName = 'el-input';

                        if (attribute.type === CONFIG_ITEM_TYPE_MAP.INT) {
                            item.attrs.type = 'number';
                            item.attrs.step = 1;
                        }

                        item.listeners = {
                            input: value => this.onChangeFormValue(attribute.code, value),
                        };
                    } else if (attribute.type === CONFIG_ITEM_TYPE_MAP.DATE) {
                        item.componentName = 'el-date-picker';

                        item.listeners = {
                            input: value => this.onChangeFormValue(attribute.code, value && value.toISOString()),
                        };
                    } else if (attribute.type === CONFIG_ITEM_TYPE_MAP.BOOLEAN) {
                        item.componentName = 'el-checkbox';

                        item.listeners = {
                            change: value => this.onChangeFormValue(attribute.code, value),
                        };
                    } else if (attribute.type === CONFIG_ITEM_TYPE_MAP.ENUM) {
                        item.componentName = 'el-cascader';

                        item.attrs.options       = normalizeEnumListToOptions(ENUM_TYPES[attribute.enumType]);
                        item.attrs.showAllLevels = false;
                        item.attrs.props         = {
                            emitPath: false,
                        };

                        item.listeners = {
                            change: value => this.onChangeFormValue(attribute.code, value),
                        };
                    }

                    result[attribute.code] = item;
                });

                return result;
            },

            /**
             * @return {object}
             */
            validationRules() {
                const result = {};

                this.config.attributes.forEach(attribute => {
                    if (attribute.validation) {
                        result[attribute.code] = { ...attribute.validation, trigger: 'blur' };
                    }
                });

                return result;
            },
        },

        methods: {
            /**
             * @param {string} code
             * @param {any} value
             */
            onChangeFormValue(code, value) {
                console.log(code, value);
                this.form[code] = value;
            },

            async onSubmitForm() {
                const isValid = await this.$refs.form.validate();

                if (isValid) {
                    this.$emit('update:model', this.form);
                } else {
                    console.error('Form is invalid!!!');
                }
            },
        },
    };
</script>
