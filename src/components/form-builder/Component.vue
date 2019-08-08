<template>
    <el-form :id="config.code" :model="form" :rules="validationRules">
        <el-form-item
                v-for="(item, code) in viewData"
                :key="code"
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
    import _ from 'lodash';

    import FormBuilderConfig, { CONFIG_ITEM_TYPE_MAP } from './services/FormBuilderConfig';
    import InputMultiple from '@/components/intput-multiple';

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
            viewData() {
                const result = {};

                this.config.attributes.forEach(attribute => {
                    result[attribute.code] = {
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
                        result[attribute.code].componentName = 'el-input';

                        if (attribute.type === CONFIG_ITEM_TYPE_MAP.INT) {
                            result[attribute.code].attrs.type = 'number';
                            result[attribute.code].attrs.step = 1;
                        }

                        result[attribute.code].listeners = {
                            input: value => this.onChangeFormValue(attribute.code, value),
                        };
                    } else if (attribute.type === CONFIG_ITEM_TYPE_MAP.DATE) {
                        result[attribute.code].componentName = 'el-date-picker';

                        result[attribute.code].listeners = {
                            change: value => this.onChangeFormValue(attribute.code, value),
                        };
                    } else if (attribute.type === CONFIG_ITEM_TYPE_MAP.BOOLEAN) {
                        result[attribute.code].componentName = 'el-checkbox';

                        result[attribute.code].listeners = {
                            change: value => this.onChangeFormValue(attribute.code, value),
                        };
                    } else if (attribute.type === CONFIG_ITEM_TYPE_MAP.enum) {
                        result[attribute.code].componentName = 'el-select';
                    }
                });

                return result;
            },

            validationRules() {
                const result = {};

                this.config.attributes.forEach(attribute => {
                    if (attribute.validation) {
                        result[attribute.code] = {
                            ...attribute.validation,
                            trigger: 'blur',
                        };
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

            onSubmitForm() {
                this.$emit('update:model', this.form);
            },
        },
    };
</script>

<style scoped lang="scss"></style>
