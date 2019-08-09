<template>
    <div id="app">
        <form-builder
                class="form"
                :config="$options.personFormConfig"
                :model="personForm"
                @update:model="onUpdateForm"
        />
    </div>
</template>

<script>
    import FormBuilder, { FormBuilderConfig } from '@/components/form-builder';

    const PERSON_FORM_CONFIG = new FormBuilderConfig('Person', [
        {
            title:      'Ім\'я',
            code:       'firstName',
            validation: {
                required:  true,
                minlength: 3,
                maxlength: 10,
            },
        },
        {
            title:      'Прізвище',
            code:       'lastName',
            validation: {
                minlength: 3,
                maxlength: 10,
                required:  true,
            },
        },
        {
            title:      'Вік',
            code:       'age',
            type:       'int',
            validation: {
                max: 120,
                min: 18,
            },
        },
        {
            title:      'Ріст',
            code:       'height',
            type:       'float',
            validation: {
                max: 250,
                min: 50,
            },
        },
        {
            title:      'Email',
            code:       'email',
            validation: {
                email: true,
            },
        },
        {
            title:    'Важливість',
            code:     'importance',
            type:     'enum',
            enumType: 'ImportanceValue',
        },
        {
            title:    'Посада',
            code:     'jobPosition',
            type:     'enum',
            enumType: 'JobPositionValue',
        },
        {
            title: 'Дата виходу на роботу',
            code:  'startJobAt',
            type:  'date',
        },
        {
            title:      'Телефон',
            code:       'phone',
            multiple:   true,
            validation: {
                pattern: '^\\+38 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$',
            },
        },
    ]);

    export default {
        personFormConfig: PERSON_FORM_CONFIG,

        name: 'App',

        components: {
            FormBuilder,
        },

        data() {
            return {
                personForm: {
                    firstName:   '',
                    lastName:    '',
                    age:         '',
                    height:      '',
                    email:       '',
                    importance:  '',
                    jobPosition: '',
                    startJobAt:  '',
                    phone:       [],
                },
            };
        },

        methods: {
            /**
             * @param {object} form
             */
            onUpdateForm(form) {
                this.personForm = { ...form };

                console.log(this.personForm);
            },
        },
    };
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .form {
        margin: auto;
        width: 60%;
    }
</style>
