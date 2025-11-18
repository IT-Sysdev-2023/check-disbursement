import AppLayout from '@/layouts/app-layout';
import { retrievedRecords } from '@/routes';
import { Cv, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import EmployeeForm from './components/checkForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: retrievedRecords().url,
    },
    {
        title: 'CV Details',
        href: '#',
    },
];

type FormFieldValue = string | string[] | number | boolean | File | null;

type EmployeeRole = 'Market' | 'Finance' | 'Development';
export interface Employee {
    id: number;
    name: string;
    age: number;
    joinDate: string;
    role: EmployeeRole;
    isFullTime: boolean;
}
interface EmployeeFormState {
    values: Partial<Omit<Employee, 'id'>>;
    errors: Partial<Record<keyof EmployeeFormState['values'], string>>;
}

const INITIAL_FORM_VALUES: Partial<EmployeeFormState['values']> = {
    role: 'Market',
    isFullTime: true,
};

export default function CvDetails({ cv }: { cv: Cv }) {
    console.log(cv);
    // const notifications = useNotifications();

    const [formState, setFormState] = useState<EmployeeFormState>(() => ({
        values: INITIAL_FORM_VALUES,
        errors: {},
    }));
    const formValues = formState.values;
    const formErrors = formState.errors;

    const setFormValues = useCallback(
        (newFormValues: Partial<EmployeeFormState['values']>) => {
            setFormState((previousState) => ({
                ...previousState,
                values: newFormValues,
            }));
        },
        [],
    );

    const setFormErrors = useCallback(
        (newFormErrors: Partial<EmployeeFormState['errors']>) => {
            setFormState((previousState) => ({
                ...previousState,
                errors: newFormErrors,
            }));
        },
        [],
    );

    function handleFormFieldChange() {}
    // const handleFormFieldChange = useCallback(
    //   (name: keyof EmployeeFormState['values'], value: FormFieldValue) => {
    //     // const validateField = async (values: Partial<EmployeeFormState['values']>) => {
    //     //   const { issues } = validateEmployee(values);
    //     //   setFormErrors({
    //     //     ...formErrors,
    //     //     [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
    //     //   });
    //     // };

    //     const newFormValues = { ...formValues, [name]: value };

    //     setFormValues(newFormValues);
    //     // validateField(newFormValues);
    //   },
    //   [formValues, formErrors, setFormErrors, setFormValues],
    // );

    const handleFormReset = useCallback(() => {
        setFormValues(INITIAL_FORM_VALUES);
    }, [setFormValues]);

    const handleFormSubmit = useCallback(async () => {
        // //   const { issues } = validateEmployee(formValues);
        // //   if (issues && issues.length > 0) {
        // //     setFormErrors(
        // //       Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
        // //     );
        // //     return;
        // //   }
        // //   setFormErrors({});

        // try {
        //     // await createEmployee(formValues as Omit<Employee, 'id'>);
        //     // notifications.show('Employee created successfully.', {
        //     //   severity: 'success',
        //     //   autoHideDuration: 3000,
        //     // });
        //     // navigate('/employees');
        // } catch (createError) {
        //     // notifications.show(
        //     //   `Failed to create employee. Reason: ${(createError as Error).message}`,
        //     //   {
        //     //     severity: 'error',
        //     //     autoHideDuration: 3000,
        //     //   },
        //     // );
        //     throw createError;
        // }
    }, [formValues, setFormErrors]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV Details" />
            {/* <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Check Voucher Details
            </Typography> */}
            <EmployeeForm
                cv= {cv}
                formState={formState}
                onFieldChange={handleFormFieldChange}
                onSubmit={handleFormSubmit}
                onReset={handleFormReset}
                submitButtonLabel="Submit"
            />
        </AppLayout>
    );
}
