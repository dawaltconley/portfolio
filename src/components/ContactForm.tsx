import type { FunctionComponent, JSX } from 'preact';
import { useState, useRef } from 'preact/hooks';
import classNames from 'classnames';
import Icon from './Icon';

import { faEnvelope as faSubmitIcon } from '@fortawesome/pro-solid-svg-icons/faEnvelope';
import { faSpinnerThird as faLoading } from '@fortawesome/pro-solid-svg-icons/faSpinnerThird';

const styles = {
  form: 'grid grid-cols-2 gap-5 text-slate-700',
  formField:
    'col-span-2 block rounded-md px-4 py-2 sm:py-3 focus-visible:outline outline-blue-300',
  formButton:
    'w-32 max-w-full rounded-full px-4 py-3 text-white duration-300 transition-colors focus-visible:outline outline-blue-100',
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
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<ContactFormStatus>('initial');

  const handleSubmit = async (
    e: JSX.TargetedEvent<HTMLFormElement>
  ): Promise<void> => {
    console.log('submitting');
    e.preventDefault();
    const container = containerRef.current;
    const form = formRef.current;
    if (!container || !form) return;

    container.style.minHeight = `${container.clientHeight.toString()}px`;
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

  const showForm = status === 'initial' || status === 'error';

  return (
    <div ref={containerRef} class="mx-auto max-w-prose text-center">
      <FormMessage status={status} />
      {showForm && (
        <form
          ref={formRef}
          class={classNames(styles.form)}
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
              'col-span-2 justify-self-center bg-indigo-500 font-medium disabled:bg-indigo-950',
              {
                'text-white hover:bg-indigo-400 focus-visible:bg-indigo-400':
                  status === 'initial',
              }
            )}
          >
            <Icon
              icon={faSubmitIcon}
              width="1em"
              height="1em"
              class="fa-inline mr-1.5"
            />
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

interface FormMessageProps {
  status: ContactFormStatus;
  errorMessage?: string;
}

const FormMessage: FunctionComponent<FormMessageProps> = ({
  status,
  errorMessage,
}) => {
  const title: Record<typeof status, string | JSX.Element> = {
    initial: 'Have a project?',
    submitting: 'Sending...',
    error: 'Oops!',
    success: 'Message received!',
  };

  return (
    <>
      <h2 class="mb-8 text-6xl font-extrabold">{title[status]}</h2>
      <div class="mb-12 text-xl font-medium">
        {status === 'submitting' ? (
          <SendingMessage />
        ) : status === 'error' ? (
          <ErrorMessage message={errorMessage} />
        ) : status === 'success' ? (
          <SuccessMessage />
        ) : (
          <InitialMessage />
        )}
      </div>
    </>
  );
};

const InitialMessage = () => (
  <>
    <p>Let’s discuss!</p>
    <p>
      Please message me with{' '}
      <span class="whitespace-nowrap">any relevant details.</span>
    </p>
  </>
);

const SendingMessage = () => (
  <Icon icon={faLoading} width="1em" height="1em" class="fa-spin text-6xl" />
);

const ErrorMessage: FunctionComponent<{ message?: string }> = ({ message }) => (
  <>
    <p>Something went wrong:.</p>
    {message && (
      <pre class="my-2 inline-block rounded-md bg-slate-900 px-4 py-1 text-red-300">
        {message}
      </pre>
    )}
    <p>
      Please try again, or{' '}
      <a
        class="underline duration-100 hover:text-blue-300"
        href="https://github.com/dawaltconley/portfolio/issues"
      >
        open an issue on GitHub
      </a>{' '}
      if the problem persists.
    </p>
  </>
);

const SuccessMessage = () => (
  <>
    <p>Thank you for contacting me.</p>
    <p>I'll be in touch soon.</p>
  </>
);
