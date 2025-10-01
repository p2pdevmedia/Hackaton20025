import { useEffect, useMemo, useState } from 'react';
import { COUNTRIES } from '../constants/countries';

function ParticipantInfoModal({ isOpen, onClose, onSubmit, text = {}, initialValues }) {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    idType: 'dni',
    idNumber: '',
    accommodation: '',
    nationality: '',
    birthDate: '',
    contact: '',
    observations: ''
  });
  const [errors, setErrors] = useState({});
  const countries = useMemo(() => COUNTRIES, []);
  const defaultCountry = useMemo(
    () => countries.find(country => country.code === 'AR') || countries[0],
    [countries]
  );
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [contactNumber, setContactNumber] = useState('');

  const idTypeOptions = useMemo(
    () => [
      { value: 'dni', label: text.idTypeDni || 'DNI' },
      { value: 'passport', label: text.idTypePassport || 'Passport' },
      { value: 'other', label: text.idTypeOther || 'Other' }
    ],
    [text.idTypeDni, text.idTypePassport, text.idTypeOther]
  );

  useEffect(() => {
    if (!initialValues) {
      return;
    }
    setFormValues(prev => ({
      ...prev,
      ...initialValues
    }));
  }, [initialValues]);

  useEffect(() => {
    if (!initialValues) {
      setSelectedCountry(defaultCountry);
      setContactNumber('');
      return;
    }

    const contactValue = initialValues.contact || '';
    const matchedCountry = countries.find(country => contactValue?.startsWith(country.dialCode));

    if (matchedCountry) {
      const numberPart = contactValue.slice(matchedCountry.dialCode.length).trimStart();
      setSelectedCountry(matchedCountry);
      setContactNumber(numberPart);
    } else {
      setSelectedCountry(defaultCountry);
      setContactNumber(contactValue);
    }
  }, [countries, defaultCountry, initialValues]);

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = event => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatContactValue = (country, number) => {
    if (!number) {
      return '';
    }
    return `${country.dialCode} ${number}`.trim();
  };

  const handleContactNumberChange = event => {
    const { value } = event.target;
    setContactNumber(value);
    setFormValues(prev => ({
      ...prev,
      contact: formatContactValue(selectedCountry, value)
    }));
  };

  const handleCountryChange = event => {
    const country = countries.find(option => option.code === event.target.value);
    if (!country) {
      return;
    }
    setSelectedCountry(country);
    setFormValues(prev => ({
      ...prev,
      contact: formatContactValue(country, contactNumber)
    }));
  };

  const validate = values => {
    const newErrors = {};
    const requiredMessage = text.requiredField || 'This field is required.';

    ['firstName', 'lastName', 'idType', 'idNumber', 'accommodation', 'nationality', 'birthDate', 'contact'].forEach(field => {
      if (!values[field]) {
        newErrors[field] = requiredMessage;
      }
    });

    return newErrors;
  };

  const handleSubmit = event => {
    event.preventDefault();
    const validationErrors = validate(formValues);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit?.(formValues);
  };

  const title = text.title || 'Participant information';
  const description =
    text.description ||
    'Complete these details so we can share the activity registration with the hosts.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 space-y-2 text-slate-700">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="participant-first-name">
                {text.firstNameLabel || 'First name'}
              </label>
              <input
                id="participant-first-name"
                name="firstName"
                type="text"
                value={formValues.firstName}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="participant-last-name">
                {text.lastNameLabel || 'Last name'}
              </label>
              <input
                id="participant-last-name"
                name="lastName"
                type="text"
                value={formValues.lastName}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="participant-id-type">
                {text.idTypeLabel || 'Identification type'}
              </label>
              <select
                id="participant-id-type"
                name="idType"
                value={formValues.idType}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              >
                {idTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.idType && <p className="mt-1 text-xs text-red-600">{errors.idType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="participant-id-number">
                {text.idNumberLabel || 'Identification number'}
              </label>
              <input
                id="participant-id-number"
                name="idNumber"
                type="text"
                value={formValues.idNumber}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
              {errors.idNumber && <p className="mt-1 text-xs text-red-600">{errors.idNumber}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="participant-accommodation">
              {text.accommodationLabel || 'Accommodation'}
            </label>
            <input
              id="participant-accommodation"
              name="accommodation"
              type="text"
              value={formValues.accommodation}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
            {errors.accommodation && <p className="mt-1 text-xs text-red-600">{errors.accommodation}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="participant-nationality">
                {text.nationalityLabel || 'Nationality'}
              </label>
              <input
                id="participant-nationality"
                name="nationality"
                type="text"
                value={formValues.nationality}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
              {errors.nationality && <p className="mt-1 text-xs text-red-600">{errors.nationality}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="participant-birth-date">
                {text.birthDateLabel || 'Birth date'}
              </label>
              <input
                id="participant-birth-date"
                name="birthDate"
                type="date"
                value={formValues.birthDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
              {errors.birthDate && <p className="mt-1 text-xs text-red-600">{errors.birthDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="participant-contact">
              {text.contactLabel || 'Contact phone'}
            </label>
            <div className="mt-1 flex gap-2">
              <div className="min-w-[130px]">
                <label className="sr-only" htmlFor="participant-country-code">
                  {text.countryLabel || 'Country'}
                </label>
                <select
                  id="participant-country-code"
                  value={selectedCountry?.code || ''}
                  onChange={handleCountryChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {`${country.flag} ${country.dialCode} - ${country.name}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <input
                  id="participant-contact"
                  name="contact"
                  type="tel"
                  inputMode="tel"
                  value={contactNumber}
                  onChange={handleContactNumberChange}
                  placeholder={text.contactPlaceholder || '123 456 7890'}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>
            </div>
            {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="participant-observations">
              {text.observationsLabel || 'Observations'}
            </label>
            <textarea
              id="participant-observations"
              name="observations"
              value={formValues.observations}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              {text.cancelButton || 'Cancel'}
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              {text.saveButton || 'Save and continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ParticipantInfoModal;
