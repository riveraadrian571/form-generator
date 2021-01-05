import { Formik, yupToFormErrors, Form, useField } from 'formik';
import React from 'react';
import styles from '../styles/Home.module.css'
import { Styles } from '../Styles';
import * as Yup from 'yup';
import Context from '../json_files/formConfig';
import _ from 'lodash';

const formConfigObj = (_.get(Context, "formBody"));
let initialValues = {};
formConfigObj.map((inputFieldObj, index) => { initialValues[inputFieldObj.name] = '' })
const formSubmitObj = (_.get(Context, "formSubmission"));
const sampleVar = 3;
/*
props contains the data directly associated to all attributes of a form field
label directly related to single attribute of a form field
*/
const CustomTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <>
            <label hmtlfor={props.id || props.name}>{label}</label>
            <input className="text-input" {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    )
}

const CustomCheckbox = ({ children, ...props }) => {
    const [field, meta] = useField(props, 'checkbox');
    return (
        <>
            <label className="checkbox">
                <input type="checkbox" {...field} {...props} />
                {children}
            </label>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    )
}

const CustomSelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);

    return (
        <>
            <label hmtlfor={props.id || props.name}>{label}</label>
            <select {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    )
}

const InitializeValues = () => {
    let initialValues = {}
    formConfigObj.map((inputFieldObj, index) => {
        initialValues[inputFieldObj.name] = ''
    })
    return initialValues;
}

/*
Checking if values are undefined 
*/
const CheckIfEmpty = (value) => (value === undefined)

/*

*/
const RenderCustomInputField = ({ ...props }) => {
    const attributes = props.inputFieldAttr;
    switch (attributes.type) {
        case ('text'):
        case ('email'):
            return (<>
                <CustomTextInput
                    label={attributes.label_placeholder}
                    name={attributes.name}
                    type={attributes.type}
                    placeholder={attributes.label_placeholder}
                />
            </>)
            break;
        case 'select':
            return (
                <>
                    <CustomSelect
                        key={attributes.id}
                        label={attributes.label_placeholder}
                        name={attributes.name}>
                        {attributes.values.map((v, index) => (<option key={index} value={v}>{_.startCase(_.camelCase(v))}</option>))}
                    </CustomSelect>
                </>
            )
            break;
        case 'checkbox':
            return (
                <>
                    <CustomCheckbox name={attributes.name}>
                        {attributes.checkboxDescription}
                    </CustomCheckbox>
                </>
            )
        default:
            null
        // code block
    }
}

const validationSchema = () => Yup.object({
    name: Yup.string()
        .min((CheckIfEmpty(sampleVar) ? 0 : sampleVar), 'Must be at least 3 characters')
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    acceptedTerms: Yup.boolean()
        .required('Required')
        .oneOf([true], 'you must accept the terms and conditions'),
    specialPower: Yup.string()
        .oneOf(['flight', 'invisibility', 'wealthyBatGuy', 'other'], 'invalid selection')
        .required('Required'),
})

export default function FormDisplay() {

    return (
        < Styles >
            <Formik
                initialValues={InitializeValues()}
                validationSchema={validationSchema()}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        resetForm();
                        setSubmitting(false);
                    }, 3000)
                }}
            >
                {props => (
                    <Form>
                        {formConfigObj.map(s => (<RenderCustomInputField inputFieldAttr={s} key={s.id} />))}
                        <button type={formSubmitObj.type}>{props.isSubmitting ? formSubmitObj.isSubmittingText : formSubmitObj.isSubmittedText}</button>
                    </Form>
                )}
            </Formik>
        </Styles >
    )
}