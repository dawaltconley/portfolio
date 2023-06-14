import type { JSX } from 'preact';
import { useState, useRef } from 'preact/hooks';
import classNames from 'classnames';
import Icon, { IconDefinition } from './Icon';

import { faEnvelope as faInitial } from '@fortawesome/pro-solid-svg-icons/faEnvelope';
import { faSpinnerThird as faSubmitting } from '@fortawesome/pro-solid-svg-icons/faSpinnerThird';
import { faXmark as faError } from '@fortawesome/pro-solid-svg-icons/faXmark';
import { faCheck as faSuccess } from '@fortawesome/pro-solid-svg-icons/faCheck';

const styles = {
  form: 'grid grid-cols-2 gap-5 text-slate-700',
  formField: 'col-span-2 block rounded-md px-4 py-3',
  formButton:
    'w-32 max-w-full rounded-full bg-pink-800 px-4 py-3 text-white duration-300',
};

type ContactFormStatus = 'initial' | 'submitting' | 'error' | 'success';

const requiredFields = ['name', 'email', 'subject', 'message'] as const;

const isValid = (data: FormData): boolean =>
  requiredFields.every((field) => data.get(field));

const getFormData = (form: HTMLFormElement): FormData => {
  const data = new FormData(form);
  const subject = data.get('subject');
  if (subject) data.set('subject', `[${window.location.host}] ${subject}`);
  return data;
};

const formDataToSearchParams = (formData: FormData): URLSearchParams => {
  const formEntries = Array.from(formData, ([key, value]) => [
    key,
    typeof value === 'string' ? value : value.name,
  ]);
  return new URLSearchParams(formEntries);
};

interface SubmitFormOps {
  action: string | URL;
  method?: 'GET' | 'POST';
  encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
}

const submitForm = (
  formData: FormData,
  { action, method, encType }: Required<SubmitFormOps>
): Promise<Response> => {
  const target = new URL(action);
  const opts: RequestInit = { method, redirect: 'follow' };

  if (method === 'GET') {
    if (encType === 'multipart/form-data')
      throw new Error(
        'Unupported: GET method with multipart/form-data encoding'
      );
    target.search = formDataToSearchParams(formData).toString();
  } else if (method === 'POST') {
    opts.body =
      encType === 'application/x-www-form-urlencoded'
        ? formDataToSearchParams(formData)
        : formData;
  } else {
    throw new Error(`Invalid ${method} request method`);
  }

  return fetch(target, opts);
};

interface ContactFormProps {
  action: string | URL;
  method?: 'GET' | 'POST';
  encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data';
}

interface ContactFormGetProps extends ContactFormProps {
  method: 'GET';
  encType: 'application/x-www-form-urlencoded';
}

interface ContactFormPostProps extends ContactFormProps {
  method: 'POST';
}

export default function ContactForm({
  action,
  method = 'GET',
  encType = 'application/x-www-form-urlencoded',
}: ContactFormGetProps | ContactFormPostProps): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<ContactFormStatus>('initial');

  const icons: Record<typeof status, IconDefinition> = {
    initial: faInitial,
    submitting: faSubmitting,
    error: faError,
    success: faSuccess,
  };

  const buttonText: Record<typeof status, string> = {
    initial: 'Submit',
    submitting: 'Sending...',
    error: 'Failed',
    success: 'Sent!',
  };

  const handleSubmit = async (
    e: JSX.TargetedEvent<HTMLFormElement>
  ): Promise<void> => {
    console.log('submitting');
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    setStatus('submitting');

    const data = getFormData(form);
    if (!isValid(data)) {
      console.error('Missing required fields in contact form');
      return setStatus('error');
    }

    try {
      const response = await submitForm(data, { action, method, encType });
      if (response.status >= 400) {
        console.error(await response.json());
        return setStatus('error');
      }
      return setStatus('success');
    } catch (e) {
      // NetworkError when attempting to fetch resource (bad CORS)
      console.error(e);
      return setStatus('error');
    }
  };

  return (
    <form
      ref={formRef}
      class={classNames(styles.form, 'form mx-auto max-w-prose')}
      method={method.toLowerCase()}
      encType={encType}
      action={action.toString()}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="name"
        class={classNames(styles.formField, 'sm:col-span-1')}
        placeholder="Name"
        required
      />
      <input
        type="email"
        name="email"
        class={classNames(styles.formField, 'sm:col-span-1')}
        placeholder="Email"
        required
      />
      <input
        type="text"
        name="subject"
        class={styles.formField}
        placeholder="Subject"
        required
      />
      <input
        type="text"
        name="fax_number"
        class={classNames(styles.formField, 'special-input')}
        tabIndex={-1}
        autocomplete="off"
      />
      <textarea
        name="message"
        class={classNames(styles.formField, 'min-h-[10rem] w-full')}
        placeholder="Enter your message here"
        required
      />
      <button
        class={classNames(
          styles.formButton,
          'col-span-2 justify-self-center font-medium disabled:bg-pink-900',
          {
            'text-white hover:bg-pink-700': status === 'initial',
          }
        )}
        disabled={status !== 'initial'}
      >
        <Icon
          icon={icons[status]}
          width="1em"
          height="1em"
          class={classNames('fa-inline mr-1.5', {
            'fa-spin': status === 'submitting',
          })}
        />
        {buttonText[status]}
      </button>
      {/* <p class="font-bold text-white">{status}</p> */}
    </form>
  );
}
