<template>
    <div class="input-multiple">
        <div class="el-input-container" v-for="input in inputs" :key="input.id">
            <el-input class="el-input" size="mini" v-model="input.value">
                <i class="el-icon-delete el-input__icon" slot="suffix" @click="onRemoveInput(input.id)"></i>
            </el-input>
        </div>

        <el-button type="success" size="mini" @click="onAddInput">Додати</el-button>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                required: true,
                type:     Array
            }
        },

        data() {
            return {
                inputs: this.value.map(value => ({ value, id: _.uniqueId() }))
            };
        },

        watch: {
            inputs: {
                deep:    true,
                handler: 'onChangeInputs'
            }
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
            onRemoveInput(inputId) {
                this.inputs = this.inputs.filter(input => input.id !== inputId);
            }
        }
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

