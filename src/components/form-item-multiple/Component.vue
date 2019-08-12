<template>
    <el-form-item v-bind="$attrs">
        <div class="el-input-container" v-for="input in inputs" :key="input.id">
            <component
                    :is="componentName"
                    v-bind="componentAttrs"
                    v-model="input.value"
            />

            <el-button type="danger" :size="$attrs.size" @click="onRemoveInput(input.id)">
                Видалити
            </el-button>
        </div>
        <el-button type="success" :size="$attrs.size" @click="onAddInput">
            Додати
        </el-button>
    </el-form-item>
</template>

<script>
    import _ from 'lodash';

    export default {
        props: {
            componentName:  {
                required: true,
                type:     String,
            },
            componentAttrs: {
                type: Object,
            },
            value:          {
                required: true,
                type:     Array,
            },
        },

        model: {
            prop:  'value',
            event: 'update:value',
        },

        data() {
            return {
                inputs: this.value.map(value => ({ value, id: _.uniqueId() })),
            };
        },

        watch: {
            inputs: {
                deep:    true,
                handler: 'onChangeInputs',
            },
        },

        methods: {
            /**
             * @param {object[]}inputs
             */
            onChangeInputs(inputs) {
                this.$emit('update:value', inputs.map(input => input.value));
            },

            onAddInput() {
                this.inputs.push({ id: _.uniqueId(), value: '' });
            },

            /**
             * @param {string} inputId
             */
            onRemoveItemMultiple(inputId) {
                this.inputs = this.inputs.filter(input => input.id !== inputId);
            },
        },
    };
</script>

<style lang="scss">
    .input-multiple {
        .el-input-container {
            margin-bottom: 20px;
        }

        .el-input {
            &__icon {
                cursor: pointer;
            }
        }
    }
</style>

