function normalizeValue(value) {
  return String(value || '').trim();
}

export function buildSubmissionFields(formData, definitions) {
  return definitions
    .map((definition) => {
      const values = formData.getAll(definition.name)
        .map(normalizeValue)
        .filter(Boolean);

      if (!values.length) {
        return null;
      }

      return {
        label: definition.label,
        value: values.join(', '),
      };
    })
    .filter(Boolean);
}

export async function submitContactStyleForm({ formType, subject, replyTo, sourcePath, fields }) {
  const response = await fetch('/api/contact-submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      formType,
      subject,
      replyTo,
      sourcePath,
      fields,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Unable to send message.');
  }

  return data;
}
