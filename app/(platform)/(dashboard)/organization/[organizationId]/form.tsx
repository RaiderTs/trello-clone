'use client';

import { useAction } from '@/hooks/use-action';
import { createBoard } from '@/actions/create-board';
import { FormInput } from '@/components/form/form-input';
import { FormSubmit } from '@/components/form/form-submit';

export const Form = () => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data, 'SUCCESS');
    },
    onError: (error) => {
      console.log(error, 'ERROR');
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;

    console.log({ title });

    execute({ title });
  };

  return (
    <form action={onSubmit}>
      <div className='flex flex-col space-y-2'>
        <FormInput errors={fieldErrors} id={'title'} label='Board Title' />
      </div>
      <FormSubmit>Save</FormSubmit>
    </form>
  );
};
